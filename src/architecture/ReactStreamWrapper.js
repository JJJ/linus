import React from 'react';
import _ from 'lodash'

import * as Rx from 'rxjs';
import { map } from 'rxjs/operators'

import BaseComponent from './BaseComponent'

export default (input, component, props) => {
  let streams = []
  let mappings = []
  Object.keys(input).forEach(key => {
    streams.push(input[key])
    mappings.push(key)
  });
  const state = Rx
    .combineLatest(
      streams
    )
    .pipe(
      map(e => {
        let props = {}
        mappings.forEach((mapping,index) => _.merge(props, { [mapping]: e[index] }))
        return props
      })
    )

  return (
    <BaseComponent
      Component={component}
      store={state}
      {...props}
    />
  );
}
