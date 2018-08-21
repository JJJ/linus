import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';


/*
 * To Add BaseRxComponent functionality to a component, use it
 * as a wrapper.
 *
 * Example:
 *
 * <RxBaseComponent
 *   store={combinedObservable}
 *   Component={ComponentClass}
 *   loading=false
 *  />
*/

export default class RxBaseComponent extends React.Component {

  static propTypes = {
    //TODO: Add this someday
    //store: PropTypes.Observable
    loading: PropTypes.bool,
    loader: PropTypes.func,
    Component: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.func
    ]).isRequired
  }

  static defaultProps = {
    loading: true,
    loader: () => "test"
  };

  constructor(props) {
    super(props);
    this.loaded = false;
  }

  componentWillMount() {
    this.Store = this.props.store
      .subscribe((e) => {
        this.loaded = true;
        this.setState(e);
      });
  }

  componentWillUnmount() {
    this.Store.unsubscribe();
  }

  render() {
    // If component is loading show a spinner instead of rendering component
    // If component is loading show a spinner instead of rendering component
    if (this.props.loading && this.loaded === false) {
      //const CustomLoader = this.props.loader;
      return (
        null
      );
    }

    //const propsWithReset = _.merge({}, this.props, { reset: this.reset });
    const combinedProps = _.merge({}, this.props, this.state);

    const Component = this.props.Component;
    return (
      <Component
        {...combinedProps}
      />
    );
  }
}
