import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RgbSliders extends Component {

   componentDidMount () {
      this.props.initCanvas(this.refs.canvas);
   }

   render () {
      const { color, focus, engage, getColor, disengage, handleColorChange } = this.props;
      console.log(color);
      
      const styles = {
         color: {
            background: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`
         },
         rGradient: {
            background:`linear-gradient(90deg, rgb(0, ${color.rgb.g}, ${color.rgb.b}), rgb(255, ${color.rgb.g}, ${color.rgb.b})`
         },
         gGradient: {
            background:`linear-gradient(90deg, rgb(${color.rgb.r}, 0, ${color.rgb.b}), rgb(${color.rgb.r}, 255, ${color.rgb.b})`
         },
         bGradient: {
            background:`linear-gradient(90deg, rgb(${color.rgb.r}, ${color.rgb.g}, 0), rgb(${color.rgb.r}, ${color.rgb.g}, 255)`
         }
      }
      
      return (
         <div className="rgb-gradient">

            { focus &&
            <div className="overlay"
               onMouseMove={(e) => getColor(this.refs.canvas, e)}
               onMouseUp={() => disengage(this.refs.canvas)}
               onMouseLeave={() => disengage(this.refs.canvas)}>
            </div> }

            <div className="color" style={ styles.color }><div></div></div>

            <canvas ref="canvas" onMouseDown={(e) => engage(this.refs.canvas, e)}/>
              
            <div className="sliders">
               <div>
                  <div className="r-gradient" style={ styles.rGradient }></div>
                  <input className="slider" type="range" min="0" max="255" value={color.rgb.r} onChange={(e) => handleColorChange('r', e)}/>
                  <input value={color.rgb.r} onChange={(e) => handleColorChange('h', e)}/>
               </div>
               <div>
                  <div className="g-gradient" style={ styles.gGradient }></div>
                  <input className="slider" type="range" min="0" max="255" value={color.rgb.g} onChange={(e) => handleColorChange('g', e)}/>
                  <input value={color.rgb.g} onChange={(e) => handleColorChange('s', e)}/>
               </div>
               <div>
                  <div className="b-gradient" style={ styles.bGradient }></div>
                  <input className="slider" type="range" min="0" max="255" value={color.rgb.b} onChange={(e) => handleColorChange('b', e)}/>
                  <input value={color.rgb.b} onChange={(e) => handleColorChange('l', e)}/>
               </div>
            </div>

         </div>
      );
   }
}

RgbSliders.propTypes = {
   color: PropTypes.object.isRequired,
   focus: PropTypes.bool.isRequired,
   initCanvas: PropTypes.func.isRequired,
   engage: PropTypes.func.isRequired,
   getColor: PropTypes.func.isRequired,
   disengage: PropTypes.func.isRequired,
   handleColorChange: PropTypes.func.isRequired,
 }

export default RgbSliders;