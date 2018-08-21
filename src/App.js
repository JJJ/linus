import React, { Component } from 'react';
import './App.css';
import Terminal from './components/Terminal'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Terminal/>
        <div className='bg-red h5 w-100'>
        </div>
        <div className='bg-green h5 w-100'>
        </div>
        <div className='bg-blue h5 w-100'>
        </div>
      </div>
    );
  }
}

export default App;
