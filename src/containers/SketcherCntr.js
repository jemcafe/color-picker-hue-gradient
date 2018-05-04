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
      colorPicker: {
        color: '#000'
      },
      dragging: false
    }
  }

  componentDidMount () {
    // A reference to the canvas and the its context
    const canvas = this.refs.canvas;
    const context = canvas.getContext('2d');

    // The size of the canvas
    canvas.width = 400;
    canvas.height = 400;

    // The initial background color of the canvas. Without this there would be no pixel data at the start.
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // const context = canvas.getContext('2d');
    // const imgObj = new Image();

    // imgObj.onload = () => {
    //   context.drawImage(imgObj, 0, 0);
    // };
    // imgObj.src = 'http://www.bulgariasega.com/files/zdrave/glavobolie1.jpg';
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
    const { brush, eraser, colorPicker } = this.state.toolSelected;

    if ( brush || eraser ) {
      this.setState({ dragging: true });

      // An initial point is drawn without dragging the mouse
      this.putPoint(e, false);

    } else if ( colorPicker ) {
      // Gets the pixel color
      this.getColor(e);
    }
  }

  putPoint = (e, click) => {  // The click parameter is needed so a point is drawn without dragging the mouse
    const { toolSelected, brush, eraser, dragging } = this.state;

    // A conditional for whether the brush or eraser is selected
    const tool = toolSelected.brush ? brush : eraser;

    // The context of the canvas
    const context = this.refs.canvas.getContext('2d');
    
    // Mouse position
    const x = e.nativeEvent.offsetX,
          y = e.nativeEvent.offsetY;
    
    if ( dragging || click ) {
      context.lineWidth = tool.radius * 2;
      context.lineCap = 'round';

      // End of the line path
      context.lineTo(x, y);

      // The stroke method draws the path defined by lineTo and moveTo
      context.strokeStyle = tool.color;
      context.stroke();
      
      // A circle is created using the arc method. The start and end angles make the arc a circle. 2*PI is one cycle around a circle in radians. 
      context.arc(x, y, tool.radius, 0, 2 * Math.PI);  // context.arc(x, y, radius, startAngle, endAngle, [antiClockwise]);

      // Fills the circle with a color (without fillStyle the color is black by default)
      context.fillStyle = tool.color;
      context.fill();

      // The path is reset
      context.beginPath();

      // Beginning of the line path
      context.moveTo(x, y)
    }
  }

  resetPath = () => {
    // The path is reset
    this.refs.canvas.getContext('2d').beginPath();
  }

  disengage = () => {
    this.setState({ dragging: false });

    // The path is reset. All the paths would be connected without a reseting when the mouse is up.
    const context = this.refs.canvas.getContext('2d');
    context.beginPath();
  }

  getColor = (e) => {
    // Mouse position
    const x = e.nativeEvent.offsetX,
          y = e.nativeEvent.offsetY;
    
    // A reference to the context of the canvas
    const context = this.refs.canvas.getContext('2d');

    // .getImageData gets an array of the pixels rgb colors [r,g,b,a,r,g,b,a,r...]
    const imgData = context.getImageData(x, y, 1, 1).data;  // .getImageData( x, y, width, height)
    
    // The hexadecimal color of the canvas pixel
    const hexColor = this.rgbToHex(imgData[0], imgData[1], imgData[2])

    console.log('Image Data', imgData);
    console.log('Hex color', hexColor);

    this.handleBrushSettings('brush', 'color', hexColor);
  }

  colorToHex = (c) => {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }

  rgbToHex = (r, g, b) => {
    const { colorToHex } = this;
    return `#${colorToHex(r)}${colorToHex(g)}${colorToHex(b)}`;
  }

  render() {
    const { toolSelected, brush, eraser, colorPicker } = this.state;

    return (
      <Sketcher toolSelected={ toolSelected }
                brush={ brush }
                eraser={ eraser }
                colorPicker={ colorPicker }
                handleChange={ this.handleChange }
                handleToolChange={ this.handleToolChange }
                handleBrushSettings={ this.handleBrushSettings}>

        <canvas ref="canvas" 
                onMouseDown={ this.engage } 
                onMouseMove={ (e) => this.putPoint(e, false) }
                onMouseOut={ this.resetPath }
                onMouseUp={ this.disengage }/>
      </Sketcher>
    );
  }
}

export default SketcherCntr;
