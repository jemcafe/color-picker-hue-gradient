import React, { Component } from 'react';
import Sketcher from '../components/Sketcher';

class SketcherCntr extends Component {
  constructor () {
    super();
    this.state = {
      brush: true,
      eraser: false,
      colorPicker: false,
      brushRadius: 5,
      eraserRadius: 5,
    }
  }

  componentDidMount () {
    // A reference to the canvas
    const canvas = this.refs.canvas;

    // The size of the canvas
    canvas.width = 400;
    canvas.height = 400;
}

  handleChange = (property, value) => {
    this.setState({ [property]: value });
  }

  handleToolChange = (property) => {
    this.setState({
      brush: property === 'brush' ? true : false,
      eraser: property === 'eraser' ? true : false,
      colorPicker: property === 'colorPicker' ? true : false
    });
  }

  renderBrush = (e) => {
    const { brushRadius } = this.state;

    // A reference to the canvas to get the context
    const context = this.refs.canvas.getContext('2d');
    
    // Mouse position
    const x = e.nativeEvent.offsetX,
          y = e.nativeEvent.offsetY;

    // The beginPath method beigns a path and resets the current path
    context.beginPath();
    
    // context.arc(x, y, radius, startAngle, endAngle, [antiClockwise]);
    context.arc(x, y, brushRadius, 0, 2 * Math.PI);

    // Stroke color
    // context.strokeStyle = 'slateblue';
    context.stroke();
  }

  render() {
    const { brush, eraser, colorPicker, brushRadius, eraserRadius } = this.state;

    return (
      <Sketcher brush={ brush }
                eraser={ eraser }
                colorPicker={ colorPicker }
                brushRadius={ parseInt(brushRadius, 10) }
                eraserRadius={ parseInt(eraserRadius, 10) }
                handleChange={ this.handleChange }
                handleToolChange={ this.handleToolChange }>
        <canvas ref="canvas" onMouseMove={ this.renderBrush }/>
      </Sketcher>
    );
  }
}

export default SketcherCntr;
