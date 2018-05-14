import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import Aux from '../hoc/Aux';

class ColorGradient extends Component {

   componentDidMount () {
      this.props.initCanvas(this.refs.canvas);
   }

   render () {
      const { color, gradientHue, engage, getColor, disengage, handleHueChange } = this.props;
      
      return (
         <div className="color-gradient">
            <div style={{width:'25px',height:'25px',background: color.hex}}></div>
            <canvas 
              className="color-gradient-canvas" 
              ref="canvas" 
              onMouseDown={(e) => engage(e, this.refs.canvas)}
              onMouseMove={(e) => getColor(e, this.refs.canvas)}
              // onMouseOut={(e) => getColor(e), this.refs.canvas}
              onMouseUp={(e) => disengage(e, this.refs.canvas)}
            />
            <div className="slider-wrapper">
              <input type="range" min="0" max={255 * 6} onChange={(e) => handleHueChange(e, this.refs.canvas)}/>
            </div>
         </div>
      );
   }
}

ColorGradient.propTypes = {
   gradientHue: PropTypes.object.isRequired,
   initCanvas: PropTypes.func.isRequired,
   engage: PropTypes.func.isRequired,
   getColor: PropTypes.func.isRequired,
   disengage: PropTypes.func.isRequired,
   handleHueChange: PropTypes.func.isRequired,
 }

export default ColorGradient;