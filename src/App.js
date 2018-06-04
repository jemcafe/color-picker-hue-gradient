import React, { Component } from 'react';
import HueGradient from './containers/HueGradientCntr';
import HslSliders from './containers/HslSlidersCntr';
import RgbSliders from './containers/RgbSlidersCntr';
import CmykSliders from './containers/CmykSlidersCntr';
import LabSliders from './containers/LabSlidersCntr';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h4>Hue Gradient</h4>
        <HueGradient />
        <h4>HSL Sliders</h4>
        <HslSliders />
        <h4>RGB Sliders</h4>
        <RgbSliders />
        <h4>CMYK Sliders</h4>
        <CmykSliders />
        <h4>CIELAB Sliders</h4>
        <LabSliders />
      </div>
    );
  }
}

export default App;
