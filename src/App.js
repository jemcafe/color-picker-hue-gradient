import React, { Component } from 'react';
// import Sketcher from './containers/SketcherCntr';
import ColorGradient from './containers/ColorGradientCntr';

class App extends Component {
  render() {
    return (
      <div className="App">
        {/* <Sketcher /> */}
        <ColorGradient />
      </div>
    );
  }
}

export default App;
