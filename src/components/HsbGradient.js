import React, { Component } from 'react';
import PropTypes from 'prop-types';

class HsbGradient extends Component {

   componentDidMount () {
      this.props.initCanvas(this.refs.canvas);
   }

   render () {
      const { color, focus, engage, getColor, disengage, handleHsbChange } = this.props;
      console.log('color', color);
      
      const styles = {
         sGradient: {
            background:`linear-gradient(90deg, hsl(0, 0%, ${color.hsb.B}%), hsl(${color.hsb.H},100%,${Math.round(color.hsb.B/2)}%)`
         },
         bGradient: {
            background:`linear-gradient(90deg, #000, hsl(${color.hsb.H},${color.hsb.S}%,${Math.round(color.hsb.B/2)}%))`
         }
      }
      
      return (
         <div className="hsb-gradient">

            <div className="overlay" 
               style={{ display: focus ? '' : 'none' }}
               onMouseMove={(e) => getColor(this.refs.canvas, e)}
               onMouseUp={() => disengage(this.refs.canvas)}
               onMouseLeave={() => disengage(this.refs.canvas)}>
            </div>

            <div className="color" style={{background: color.hex}}><div></div></div>

            <canvas ref="canvas" onMouseDown={(e) => engage(this.refs.canvas, e)}/>
              
            <div className="sliders">
               <div>
                  <div className="h-gradient"></div>
                  <input className="slider" type="range" min="0" max="360" value={color.hsb.H} onChange={(e) => handleHsbChange('H', e)}/>
               </div>
               <div>
                  <div className="s-gradient" style={ styles.sGradient }></div>
                  <input className="slider" type="range" min="0" max="100" value={color.hsb.S} onChange={(e) => handleHsbChange('S', e)}/>
               </div>
               <div>
                  <div className="b-gradient" style={ styles.bGradient }></div>
                  <input className="slider" type="range" min="0" max="100" value={color.hsb.B} onChange={(e) => handleHsbChange('B', e)}/>
               </div>
            </div>

         </div>
      );
   }
}

HsbGradient.propTypes = {
   color: PropTypes.object.isRequired,
   focus: PropTypes.bool.isRequired,
   initCanvas: PropTypes.func.isRequired,
   engage: PropTypes.func.isRequired,
   getColor: PropTypes.func.isRequired,
   disengage: PropTypes.func.isRequired,
   handleHsbChange: PropTypes.func.isRequired,
 }

export default HsbGradient;