import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Aux from '../hoc/Aux';

class ColorGradient extends Component {

   componentDidMount () {
      this.props.initGradientCanvas(this.refs.canvas);
   }

   render () {
      const { colorGradientHue, getColor, handleGradientHueChange } = this.props;

      return (
         <div className="color-gradient">
            <canvas 
               className="color-gradient-canvas" 
               ref="canvas" 
               onMouseDown={(e) => getColor(e, this.refs.canvas)}/>
            <input type="range" min="0" max={255 * 6} onChange={(e) => handleGradientHueChange(e, this.refs.canvas)}/>
         </div>
      );
   }
}

ColorGradient.propTypes = {
   colorGradientHue: PropTypes.object.isRequired,
   initGradientCanvas: PropTypes.func.isRequired,
   getColor: PropTypes.func.isRequired,
   handleGradientHueChange: PropTypes.func.isRequired,
 }

export default ColorGradient;