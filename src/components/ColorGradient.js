import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import Aux from '../hoc/Aux';

class ColorGradient extends Component {

   componentDidMount () {
      this.props.initCanvas(this.refs.canvas);
   }

   render () {
      const { color, engage, getColor, disengage, handleHueChange } = this.props;
      
      return (
         <div className="color-gradient"
          onMouseMove={(e) => getColor(this.refs.canvas, e)}
          onMouseUp={(e) => disengage(this.refs.canvas, e)}>

            <div className="color" style={{background: color.hex}}><div></div></div>

            <canvas 
              className="color-gradient-canvas" 
              ref="canvas" 
              onMouseDown={(e) => engage(this.refs.canvas, e)}
              onMouseMove={(e) => getColor(this.refs.canvas, e)}/>
              
            <div className="slider-wrapper">
              <input type="range" min="0" max={255 * 6} onChange={(e) => handleHueChange(this.refs.canvas, e)}/>
            </div>

         </div>
      );
   }
}

ColorGradient.propTypes = {
   color: PropTypes.object.isRequired,
   initCanvas: PropTypes.func.isRequired,
   engage: PropTypes.func.isRequired,
   getColor: PropTypes.func.isRequired,
   disengage: PropTypes.func.isRequired,
   handleHueChange: PropTypes.func.isRequired,
 }

export default ColorGradient;