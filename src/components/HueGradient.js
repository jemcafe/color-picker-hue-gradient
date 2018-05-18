import React, { Component } from 'react';
import PropTypes from 'prop-types';

class HueGradient extends Component {

   componentDidMount () {
      this.props.initCanvas(this.refs.canvas);
   }

   render () {
      const { color, focus, engage, getColor, disengage, handleHueChange } = this.props;
      
      return (
         <div className="hue-gradient">

            { focus &&
            <div className="overlay"
               onMouseMove={(e) => getColor(this.refs.canvas, e)}
               onMouseUp={() => disengage(this.refs.canvas)}
               onMouseLeave={() => disengage(this.refs.canvas)}>
            </div> }

            <div className="color" style={{background: color.hex}}><div></div></div>

            <canvas ref="canvas" onMouseDown={(e) => engage(this.refs.canvas, e)}/>
              
            <div className="slider-wrapper">
               <input className="slider" type="range" min="0" max={255 * 6} onChange={(e) => handleHueChange(this.refs.canvas, e)}/>
            </div>

            <div className="hue"></div>
            {/* <canvas className="hue" refs="hue-canvas"/> */}

         </div>
      );
   }
}

HueGradient.propTypes = {
   color: PropTypes.object.isRequired,
   focus: PropTypes.bool.isRequired,
   initCanvas: PropTypes.func.isRequired,
   engage: PropTypes.func.isRequired,
   getColor: PropTypes.func.isRequired,
   disengage: PropTypes.func.isRequired,
   handleHueChange: PropTypes.func.isRequired,
 }

export default HueGradient;