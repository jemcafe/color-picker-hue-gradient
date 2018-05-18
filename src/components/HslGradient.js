import React, { Component } from 'react';
import PropTypes from 'prop-types';

class HslGradient extends Component {

   componentDidMount () {
      this.props.initCanvas(this.refs.canvas);
   }

   render () {
      const { color, focus, engage, getColor, disengage, handleColorChange } = this.props;
      console.log(color);
      
      const styles = {
         sGradient: {
            background:`linear-gradient(90deg, hsl(0, 0%, ${color.hsl.l}%), hsl(${color.hsl.h},100%,${Math.round(color.hsl.l/2)}%)`
         },
         bGradient: {
            background:`linear-gradient(90deg, #000, hsl(${color.hsl.h},${color.hsl.s}%,${Math.round(color.hsl.l/2)}%))`
         }
      }
      
      return (
         <div className="hsl-gradient">

            { focus &&
            <div className="overlay"
               onMouseMove={(e) => getColor(this.refs.canvas, e)}
               onMouseUp={() => disengage(this.refs.canvas)}
               onMouseLeave={() => disengage(this.refs.canvas)}>
            </div> }

            <div className="color" style={{background: color.hex}}><div></div></div>

            <canvas ref="canvas" onMouseDown={(e) => engage(this.refs.canvas, e)}/>
              
            <div className="sliders">
               <div>
                  <div className="h-gradient"></div>
                  <input className="slider" type="range" min="0" max="360" value={color.hsl.h} onChange={(e) => handleColorChange(this.refs.canvas, 'h', e)}/>
               </div>
               <div>
                  <div className="s-gradient" style={ styles.sGradient }></div>
                  <input className="slider" type="range" min="0" max="100" value={color.hsl.s} onChange={(e) => handleColorChange(this.refs.canvas, 's', e)}/>
               </div>
               <div>
                  <div className="b-gradient" style={ styles.bGradient }></div>
                  <input className="slider" type="range" min="0" max="100" value={color.hsl.l} onChange={(e) => handleColorChange(this.refs.canvas, 'l', e)}/>
               </div>
            </div>

         </div>
      );
   }
}

HslGradient.propTypes = {
   color: PropTypes.object.isRequired,
   focus: PropTypes.bool.isRequired,
   initCanvas: PropTypes.func.isRequired,
   engage: PropTypes.func.isRequired,
   getColor: PropTypes.func.isRequired,
   disengage: PropTypes.func.isRequired,
   handleColorChange: PropTypes.func.isRequired,
 }

export default HslGradient;