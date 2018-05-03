import React, { Component } from 'react';
import Sketcher from '../components/Sketcher';

class SketcherCntr extends Component {
  constructor () {
    super();
    this.state = {
      toolSelected: {
        brush: true,
        eraser: false,
        colorPicker: false
      },
      brush: {
        radius: 5,
        color: '#000'
      },
      eraser: {
        radius: 5,
        color: '#fff'
      },
      dragging: false
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

  handleToolChange = (tool) => {
    this.setState({
      toolSelected: {
        brush: tool === 'brush' ? true : false,
        eraser: tool === 'eraser' ? true : false,
        colorPicker: tool === 'colorPicker' ? true : false
      }
    });
  }

  handleBrushSettings = (tool, property, value) => {
    this.setState(prevState => ({
      [tool]: {
        radius: property === 'radius' ? value : prevState[tool].radius,
        color: property === 'color' ? value : prevState[tool].color
      }
    }));
  }

  engage = (e) => {
    this.setState({ dragging: true });

    // A point is drawn without dragging the mouse
    this.putPoint(e, false);
  }

  putPoint = (e, click) => {  // The click parameter is needed so a point is drawn without dragging the mouse
    const { brush, dragging } = this.state;

    // A reference to the canvas to get the context
    const context = this.refs.canvas.getContext('2d');
    
    // Mouse position
    const x = e.nativeEvent.offsetX,
          y = e.nativeEvent.offsetY;
    
    if ( dragging || click ) {
      context.lineWidth = brush.radius * 2;
      context.lineCap = 'round';

      // 
      context.lineTo(x, y);

      // The stroke method draws the path defined by lineTo and moveTo
      context.strokeStyle = brush.color;
      context.stroke();
      
      // A circle is created using the arc method. The start and end angles make the arc a circle. 2*PI is one cycle around a circle in radians. 
      context.arc(x, y, brush.radius, 0, 2 * Math.PI);  // context.arc(x, y, radius, startAngle, endAngle, [antiClockwise]);

      // Fills the circle with a color (without fillStyle the color is black by default)
      context.fillStyle = brush.color;
      context.fill();

      // The path is reset
      context.beginPath();

      // 
      context.moveTo(x, y)
    }
  }

  resetPath = () => {
    const context = this.refs.canvas.getContext('2d');
    
    // The path is reset
    context.beginPath();
  }

  disengage = () => {
    this.setState({ dragging: false });

    // The path is reset. All the paths would be connected without a reseting when the mouse is up.
    const context = this.refs.canvas.getContext('2d');
    context.beginPath();
  }

  // renderBrush = (e) => {
  //   // this.resetPath();
  //   const { brush } = this.state;

  //   // A reference to the canvas to get the context
  //   const context = this.refs.canvas.getContext('2d');
    
  //   // Mouse position
  //   const x = e.nativeEvent.offsetX,
  //         y = e.nativeEvent.offsetY;
    
  //   // Stroke color
  //   context.strokeStyle = 'white';
  //   context.stroke();

  //   // The beginPath method beigns a path and resets the current path
  //   context.beginPath();
    
  //   // context.arc(x, y, radius, startAngle, endAngle, [antiClockwise]);
  //   context.arc(x, y, brush.radius, 0, 2 * Math.PI);

  //   // Stroke color
  //   context.strokeStyle = 'blue';
  //   context.stroke();
  // }

  render() {
    const { toolSelected, brush, eraser } = this.state;

    return (
      <Sketcher toolSelected={ toolSelected }
                brush={ brush }
                eraser={ eraser }
                handleChange={ this.handleChange }
                handleToolChange={ this.handleToolChange }
                handleBrushSettings={ this.handleBrushSettings}>

        <canvas ref="canvas" 
                onMouseDown={ this.engage } 
                onMouseMove={ (e) => this.putPoint(e, false) }
                // onMouseMove={ this.renderBrush }
                onMouseOut={ this.resetPath }
                onMouseUp={ this.disengage }/>
      </Sketcher>
    );
  }
}

export default SketcherCntr;
