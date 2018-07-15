import React, { Component } from 'react';
import PropTypes from 'prop-types';

class LabSliders extends Component {

  componentDidMount () {
    this.props.initCanvas(this.refs.canvas);
  }

  render () {
    const { color, focus, engage, getColor, disengage, handleColorChange } = this.props;
    console.log('Lab color', color);
    
    const styles = {
      color: {
        background:`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`
      },
      lGradient: {
        background:`linear-gradient(90deg, 
          rgb(${0}, ${0}, ${0}), 
          rgb(${255}, ${255}, ${255})
        )`
      },
      aGradient: {
        background:`linear-gradient(90deg, 
          rgb(${-951}, ${155}, ${116}), 
          rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}), 
          rgb(${289}, ${-525}, ${125})
        )`
      },
      bGradient: {
        background:`linear-gradient(90deg, 
          rgb(${-2224}, ${138}, ${346}), 
          rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}), 
          rgb(${149}, ${116}, ${-191})
        )`
      }
    }
    
    return (
      <div className="lab-sliders">

        { focus &&
        <div className="focus-overlay"
          onMouseMove={(e) => getColor(this.refs.canvas, e)}
          onMouseUp={() => disengage(this.refs.canvas)}
          onMouseLeave={() => disengage(this.refs.canvas)}>
        </div> }

        <div className="color" style={ styles.color }><div></div></div>

        <canvas ref="canvas" onMouseDown={(e) => engage(this.refs.canvas, e)}/>
          
        <div className="sliders">
          <div>
            <div className="gradient" style={ styles.lGradient }></div>
            <input className="slider" type="range" min="0" max="100" value={color.lab.l} onChange={(e) => handleColorChange('l', e)}/>
            <input value={color.lab.l} onChange={(e) => handleColorChange('l', e)}/>
          </div>
          <div>
            <div className="gradient" style={ styles.aGradient }></div>
            <input className="slider" type="range" min="-128" max="127" value={color.lab.a} onChange={(e) => handleColorChange('a', e)}/>
            <input value={color.lab.a} onChange={(e) => handleColorChange('a', e)}/>
          </div>
          <div>
            <div className="gradient" style={ styles.bGradient }></div>
            <input className="slider" type="range" min="-128" max="127" value={color.lab.b} onChange={(e) => handleColorChange('b', e)}/>
            <input value={color.lab.b} onChange={(e) => handleColorChange('b', e)}/>
          </div>
        </div>

      </div>
    );
  }
}

LabSliders.propTypes = {
  color: PropTypes.object.isRequired,
  focus: PropTypes.bool.isRequired,
  initCanvas: PropTypes.func.isRequired,
  engage: PropTypes.func.isRequired,
  getColor: PropTypes.func.isRequired,
  disengage: PropTypes.func.isRequired,
  handleColorChange: PropTypes.func.isRequired,
 }

export default LabSliders;