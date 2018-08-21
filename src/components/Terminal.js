import React from 'react';
import { fromEvent, of } from 'rxjs';
import { filter, map, scan, merge } from 'rxjs/operators';

import ReactStreamWrapper from '../architecture/ReactStreamWrapper'

// Normal React Component
const Terminal = (props) => {
  return (
    <div className='fixed w-100 top-0'>
      {props.toggled ?
        <div className='dt vh-100 w-100 mw6 center'>
          <div className='dtc v-mid center w-100 mr4 ml4'>
            <div
              id='outerLinusTerminal'
              className='bg-dark-gray br2 pa2'>
              <input
                id='linusTerminal'
                className='w-100 bg-gray b--near-gray ba pv2 ph2 white'
                defaultValue='Tell me how you want it'
                type='text'
                onChange={e => props.handleText(e.target.value)}/>
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
  const mousedown = fromEvent(document, 'mousedown')
    .pipe(
      filter(e => (e.target.id !== 'linusTerminal' && e.target.id !== 'outerLinusTerminal')),
      map(e => (state) => false)
    )

  // Maps each input to a function
  const esc = fromEvent(document, 'keydown')
    .pipe(
      filter(e => e.key === 'Escape'),
      map(e => (state) => false)
    )

  // Maps each input to a function
  const toggle = fromEvent(document, 'keypress')
    .pipe(
      filter(e => e.key==='b' && e.ctrlKey===true),
      map(e => (state) => !state)
    )


  // Creates the toggle state by calling the functions from the streams above.
  const toggled = toggle
    .pipe(
      merge(esc),
      merge(mousedown),
      // Start with toggled false. Call each function passing the previous state in
      scan((state, next) => next(state), false),
    )

  /*************************** Functions **************************/

  // Handles changes to the text input box
  const handleText = (text) => {
    return console.log(text)
  }

  const streams = {
    toggled: toggled,
    handleText: of(handleText) // Passes function in as a single item stream
  }

  // Wraps the react component and adds the streams as props
  return ReactStreamWrapper(streams, Terminal, props)
}
