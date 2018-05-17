import React, { Component } from 'react';
import HueGradient from './containers/HueGradientCntr';
import HsbGradient from './containers/HsbGradientCntr';

class App extends Component {
  render() {
    return (
      <div className="App">
        <HueGradient />
        <HsbGradient />
      </div>
    );
  }
}

export default App;
