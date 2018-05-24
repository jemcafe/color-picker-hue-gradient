import React, { Component } from 'react';
import HueGradient from './containers/HueGradientCntr';
import HslSliders from './containers/HslSlidersCntr';
import RgbSliders from './containers/RgbSlidersCntr';

class App extends Component {
  render() {
    return (
      <div className="App">
        <HueGradient />
        <HslSliders />
        <RgbSliders />
      </div>
    );
  }
}

export default App;
