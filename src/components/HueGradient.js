import React, { Component } from 'react';
import PropTypes from 'prop-types';

class HueGradient extends Component {

  componentDidMount () {
    this.props.initCanvas(this.refs.canvas);
  }

  render () {
    const { color, focus, engage, getColor, disengage, handleHueChange } = this.props;
    console.log('Hue color', color);

    const styles = {
      color: {
        background: color.hex
      }
    }
      
    return (
      <div className="hue-gradient">

        { focus &&
        <div className="focus-overlay"
          onMouseMove={(e) => getColor(this.refs.canvas, e)}
          onMouseUp={() => disengage(this.refs.canvas)}
          onMouseLeave={() => disengage(this.refs.canvas)}>
        </div> }

        <div className="color" style={ styles.color }><div></div></div>

        <canvas ref="canvas" onMouseDown={(e) => engage(this.refs.canvas, e)}/>
          
        <div className="slider-wrapper">
          <input className="slider" type="range" min="0" max={255 * 6} defaultValue="0" onChange={(e) => handleHueChange(this.refs.canvas, e)}/>
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