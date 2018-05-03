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
      dragging: false
    }
  }

  componentDidMount () {
    // A reference to the canvas
    const canvas = this.refs.canvas;
    console.log(canvas.getContext('2d'));

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

  engage = (e) => {
    this.setState({ dragging: true });

    // A point is drawn without dragging the mouse
    this.putPoint(e, false);
  }

  // The click parameter is needed so a point is drawn without dragging the mouse
  putPoint = (e, click) => {
    const { brushRadius } = this.state;

    // A reference to the canvas to get the context
    const context = this.refs.canvas.getContext('2d');
    
    // Mouse position
    const x = e.nativeEvent.offsetX,
          y = e.nativeEvent.offsetY;
    
    if ( this.state.dragging || click ) {
      context.lineWidth = brushRadius * 2;
      context.lineCap = 'round';

      // 
      context.lineTo(x, y);

      // The stroke method draws the path defined by lineTo and moveTo
      context.strokeStyle = 'slateblue';
      context.stroke();
      
      // A circle is created using the arc method. The start and end angles make the arc a circle. 2*PI is one cycle around a circle in radians. 
      context.arc(x, y, brushRadius, 0, 2 * Math.PI);  // context.arc(x, y, radius, startAngle, endAngle, [antiClockwise]);

      // Fills the circle with a color (without fillStyle the color is black by default)
      context.fillStyle = 'slateblue';
      context.fill();

      // The path is reset
      context.beginPath();

      // 
      context.moveTo(x, y)
    }
  }

  // If the mouse is out the canvas the path will disconnect
  resetPath = () => {
    const context = this.refs.canvas.getContext('2d');
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
  //   const { brushRadius } = this.state;

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
  //   context.arc(x, y, brushRadius, 0, 2 * Math.PI);

  //   // Stroke color
  //   context.strokeStyle = 'blue';
  //   context.stroke();
  // }

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

        <canvas ref="canvas" onMouseDown={ this.engage } 
                             onMouseMove={ (e) => this.putPoint(e, false) }
                            //  onMouseMove={ this.renderBrush }
                             onMouseOut={ this.resetPath }
                             onMouseUp={ this.disengage }/>
      </Sketcher>
    );
  }
}

export default SketcherCntr;
