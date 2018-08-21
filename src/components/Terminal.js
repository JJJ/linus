import React from 'react';
import { fromEvent, of, ReplaySubject } from 'rxjs';
import { filter, map, scan, merge, startWith, tap } from 'rxjs/operators';

import _ from 'lodash'
import ReactStreamWrapper from '../architecture/ReactStreamWrapper'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSlidersH } from '@fortawesome/free-solid-svg-icons'

const Dispatcher = new ReplaySubject(1);

const searchObject = (object, key) => {
  const split = key.split(' ')
  const suggestions = split.reduce((prev, key, index) => {
    if (prev.terminatemmm11111111 !== true) {

      return prev[key] ?
        prev[key]
      :
        _.merge({}, prev, {terminatemmm11111111: true})
    }
    else {
      return {}
    }
  }, object)
  !_.isNil(suggestions.terminatemmm11111111)
    ? delete suggestions.terminatemmm11111111 : null
  const last = _.last(split)
  let availableKeys = []
  Object.keys(suggestions).forEach(index => index.includes(last)
   ? availableKeys.push(index) : null)
  return availableKeys
}

const tree = {
  wp: {
    admin: () => 'test',
    cache: {
      add: () => 'test',
      decr: () => 'test',
    },
    cap: {
      add: () => 'test',
      remove: () => 'test',
    }
  },
  test: {
    bob: {
      tim: () => 'test',
    }
  }
}

// Normal React Component
const Terminal = (props) => {
  return (
    <div className='fixed w-100 top-2 avenir ph3'>
      {props.toggled ?
        <div className='w-100 mw7 center'>
          <div className=' center w-100 mr4 ml4'>
            <div
              className='linusTerminal dib bg-near-white br1 pa2 w-100'>
              <div className='pr5'>
                <input
                  className='linusTerminal fl w-100 f3 bg-moon-gray b--light-gray ba pv3 ph3 black'
                  style={{right: 40}}
                  placeholder='Tell me how you want it'
                  type='text'
                  onChange={e => props.handleText(e.target.value)}/>
                </div>
                <div className='linusTerminal fr f2 dark-gray pv2 ph2 pointer grow'>
                    <FontAwesomeIcon
                      onClick={props.handleSettings}
                      className='linusTerminal' icon={faSlidersH} />
                </div>
                {props.suggestions.map((suggestion, index) =>
                  <div key={index} className='f3 dib w-100 ph3 pv3 tl'>
                    {suggestion}
                  </div>
                )}
            </div>
          </div>
        </div>
      :
      null
      }
    </div>
  )
}

// Wrapper around React Component to inject streams (injects streams as props into the component)
export default (props) => {

  /***************** Input Listeners **********************/

  // Maps each input to a function
  const mousedown$ = fromEvent(document, 'mousedown')
    .pipe(
      filter(e => (!e.target.classList.contains('linusTerminal') && !e.target.parentElement.classList.contains('linusTerminal'))),
      map(e => (state) => false)
    )

  // Maps each input to a function
  const esc$ = fromEvent(document, 'keydown')
    .pipe(
      filter(e => e.key === 'Escape'),
      map(e => (state) => false)
    )

  // Maps each input to a function
  const toggle$ = fromEvent(document, 'keypress')
    .pipe(
      filter(e => e.key==='b' && e.ctrlKey===true),
      map(e => (state) => !state)
    )

  // Creates the toggle state by calling the functions from the streams above.
  const toggled$ = toggle$
    .pipe(
      merge(esc$),
      merge(mousedown$),
      // Start with toggled false. Call each function passing the previous state in
      scan((state, next) => next(state), true),
      startWith(true)
    )

  const suggestions$ = Dispatcher
    .pipe(
      filter(e => e.action === 'tree'),
      map(e => e.value),
      startWith([])
    )

  /*************************** Functions **************************/

  // Handles changes to the text input box
  const handleText = (text) => {
    Dispatcher.next({action: 'tree', value: searchObject(tree, text)})
  }

  // Handles changes to the settings button
  const handleSettings = () => {
    return console.log("SETTINGS")
  }

  const streams = {
    toggled: toggled$,
    suggestions: suggestions$,
    handleText: of(handleText), // Passes function in as a single item stream
    handleSettings: of(handleSettings), // Passes function in as a single item stream
  }

  // Wraps the react component and adds the streams as props
  return ReactStreamWrapper(streams, Terminal, props)
}
