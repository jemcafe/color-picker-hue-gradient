import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CymkSliders extends Component {

   componentDidMount () {
      this.props.initCanvas(this.refs.canvas);
   }

   render () {
      const { color, focus, engage, getColor, disengage, handleColorChange } = this.props;
      console.log('CMYK color', color);
      
      const styles = {
         color: {
            background: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`
         },
         cGradient: {
            background:`linear-gradient(90deg, rgb(255, ${color.cmyk.g}, ${color.cmyk.b}), rgb(${color.cmyk.r}, ${color.cmyk.g}, ${color.cmyk.b})`
         },
         mGradient: {
            background:`linear-gradient(90deg, rgb(${color.cmyk.r}, 255, ${color.cmyk.b}), rgb(${color.cmyk.r}, ${color.cmyk.g}, ${color.cmyk.b})`
         },
         yGradient: {
            background:`linear-gradient(90deg, rgb(${color.cmyk.r}, ${color.cmyk.g}, 255), rgb(${color.cmyk.r}, ${color.cmyk.g}, ${color.cmyk.b})`
         },
         kGradient: {
            background:`linear-gradient(90deg, rgb(255, 255, 255), rgb(0, 0, 0))`
         }
      }
      
      return (
         <div className="cmyk-gradient">

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
                  <div className="c-gradient" style={ styles.cGradient }></div>
                  <input className="slider" type="range" min="0" max="100" value={color.cmyk.c} onChange={(e) => handleColorChange('c', e)}/>
                  <input value={color.cmyk.c} onChange={(e) => handleColorChange('c', e)}/>
               </div>
               <div>
                  <div className="m-gradient" style={ styles.mGradient }></div>
                  <input className="slider" type="range" min="0" max="100" value={color.cmyk.m} onChange={(e) => handleColorChange('m', e)}/>
                  <input value={color.cmyk.m} onChange={(e) => handleColorChange('m', e)}/>
               </div>
               <div>
                  <div className="y-gradient" style={ styles.yGradient }></div>
                  <input className="slider" type="range" min="0" max="100" value={color.cmyk.y} onChange={(e) => handleColorChange('y', e)}/>
                  <input value={color.cmyk.y} onChange={(e) => handleColorChange('y', e)}/>
               </div>
               <div>
                  <div className="k-gradient" style={ styles.kGradient }></div>
                  <input className="slider" type="range" min="0" max="100" value={color.cmyk.k} onChange={(e) => handleColorChange('k', e)}/>
                  <input value={color.cmyk.k} onChange={(e) => handleColorChange('k', e)}/>
               </div>
            </div>

         </div>
      );
   }
}

CymkSliders.propTypes = {
   color: PropTypes.object.isRequired,
   focus: PropTypes.bool.isRequired,
   initCanvas: PropTypes.func.isRequired,
   engage: PropTypes.func.isRequired,
   getColor: PropTypes.func.isRequired,
   disengage: PropTypes.func.isRequired,
   handleColorChange: PropTypes.func.isRequired,
 }

export default CymkSliders;