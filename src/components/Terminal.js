import React from 'react';
import { fromEvent, of } from 'rxjs';
import { filter, map, scan, merge, tap } from 'rxjs/operators';

import ReactStreamWrapper from '../architecture/ReactStreamWrapper'

const Terminal = (props) => {
  return (
    <div>
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

export default (props) => {

  const mousedown = fromEvent(document, 'mousedown')
    .pipe(
      filter(e => (e.target.id !== 'linusTerminal' && e.target.id !== 'outerLinusTerminal')),
      // Map to a function which returns false
      map(e => () => false)

    )

  const esc = fromEvent(document, 'keydown')
    .pipe(
      filter(e => e.key === 'Escape'),
      // Map to a function which returns false
      map(e => () => false)
    )

  const toggle = fromEvent(document, 'keypress')
    .pipe(
      filter(e => e.key==='b' && e.ctrlKey===true),
      // Map to a function which returns opposite of current state
      map(e => (state) => !state)
    )

  const toggled = toggle
    .pipe(
      merge(esc),
      merge(mousedown),
      scan((state, next) => next(state), false),
    )

  /*************************** Functions **************************/

  const handleText = (text) => {
    return console.log(text)
  }

  const streams = {
    toggled: toggled,
    handleText: of(handleText) // Needs to be a stream
  }

  return ReactStreamWrapper(streams, Terminal, props)
}
