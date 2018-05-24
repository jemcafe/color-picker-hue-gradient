import React, { Component } from 'react';
import HueGradient from './containers/HueGradientCntr';
import HslSliders from './containers/HslSlidersCntr';
import RgbSliders from './containers/RgbSlidersCntr';
import CmykSliders from './containers/CmykSlidersCntr';

class App extends Component {
  render() {
    return (
      <div className="App">
        <HueGradient />
        <HslSliders />
        <RgbSliders />
        <CmykSliders />
      </div>
    );
  }
}

export default App;
