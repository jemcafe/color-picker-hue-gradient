import React, { Component } from 'react';
import PropTypes from 'prop-types';

class HslSliders extends Component {

   componentDidMount () {
      this.props.initCanvas(this.refs.canvas);
   }

   render () {
      const { color, focus, engage, getColor, disengage, handleColorChange } = this.props;
      console.log(color);
      
      const styles = {
         color: {
            background: `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`
         },
         hGradient: {
            background:`linear-gradient( 
               90deg, 
               hsl(0, 100%, ${color.hsl.l}%),
               hsl(60, 100%, ${color.hsl.l}%),
               hsl(120, 100%, ${color.hsl.l}%),
               hsl(180, 100%, ${color.hsl.l}%),
               hsl(240, 100%, ${color.hsl.l}%),
               hsl(300, 100%, ${color.hsl.l}%),
               hsl(360, 100%, ${color.hsl.l}%)
            )`
         },
         sGradient: {
            background:`linear-gradient(90deg, hsl(0, 0%, ${color.hsl.l}%), hsl(${color.hsl.h},100%,${Math.round(color.hsl.l)}%)`
         },
         lGradient: {
            background:`linear-gradient(90deg, #000, hsl(${color.hsl.h}, 100%, 50%), #fff)`
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

            <div className="color" style={ styles.color }><div></div></div>

            <canvas ref="canvas" onMouseDown={(e) => engage(this.refs.canvas, e)}/>
              
            <div className="sliders">
               <div>
                  <div className="h-gradient" style={ styles.hGradient }></div>
                  <input className="slider" type="range" min="0" max="360" value={color.hsl.h} onChange={(e) => handleColorChange('h', e)}/>
                  <input value={color.hsl.h} onChange={(e) => handleColorChange('h', e)}/>
               </div>
               <div>
                  <div className="s-gradient" style={ styles.sGradient }></div>
                  <input className="slider" type="range" min="0" max="100" value={color.hsl.s} onChange={(e) => handleColorChange('s', e)}/>
                  <input value={color.hsl.s} onChange={(e) => handleColorChange('s', e)}/>
               </div>
               <div>
                  <div className="l-gradient" style={ styles.lGradient }></div>
                  <input className="slider" type="range" min="0" max="100" value={color.hsl.l} onChange={(e) => handleColorChange('l', e)}/>
                  <input value={color.hsl.l} onChange={(e) => handleColorChange('l', e)}/>
               </div>
            </div>

         </div>
      );
   }
}

HslSliders.propTypes = {
   color: PropTypes.object.isRequired,
   focus: PropTypes.bool.isRequired,
   initCanvas: PropTypes.func.isRequired,
   engage: PropTypes.func.isRequired,
   getColor: PropTypes.func.isRequired,
   disengage: PropTypes.func.isRequired,
   handleColorChange: PropTypes.func.isRequired,
 }

export default HslSliders;