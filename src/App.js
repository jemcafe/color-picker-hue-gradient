import React, { Component } from 'react';
import HueGradient from './containers/HueGradientCntr';
import HslGradient from './containers/HslGradientCntr';

class App extends Component {
  render() {
    return (
      <div className="App">
        <HueGradient />
        <HslGradient />
      </div>
    );
  }
}

export default App;
