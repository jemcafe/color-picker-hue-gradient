import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Aux from '../hoc/Aux';

class ColorGradient extends Component {

   componentDidMount () {
      // A reference to the canvas and the its context
      const canvas = this.refs.canvas;
      const context = canvas.getContext('2d');

      // The size of the canvas
      canvas.width = 200;
      canvas.height = 200;

      // Base color
      context.fillStyle = "blue";
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Linear Gradient color
      const whiteGrd = context.createLinearGradient(0, 0, canvas.width, 0);
      whiteGrd.addColorStop(0, "white");
      whiteGrd.addColorStop(1, "transparent");
      context.fillStyle = whiteGrd;
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Linear Gradient color
      const blackGrd = context.createLinearGradient(0, canvas.height, 0, 0);
      blackGrd.addColorStop(0, "black");
      blackGrd.addColorStop(1, "transparent");
      context.fillStyle = blackGrd;
      context.fillRect(0, 0, canvas.width, canvas.height);
   }

   render () {
      const { colorGradientHue, getColor, handleGradientHueChange } = this.props;

      return (
         <div className="color-gradient">
            <canvas 
               className="color-gradient-canvas" 
               ref="canvas" 
               onMouseDown={(e) => getColor(e, this.refs.canvas)}/>
            <input type="range" min="0" max={255 * 2} onChange={(e) => handleGradientHueChange(e)}/>
         </div>
      );
   }
}

ColorGradient.propTypes = {
   colorGradientHue: PropTypes.object.isRequired,
   getColor: PropTypes.func.isRequired,
   handleGradientHueChange: PropTypes.func.isRequired,
 }

export default ColorGradient;