import React, { Component } from 'react';
import Sketcher from '../components/Sketcher';
import MainCanvas from '../components/MainCanvas';
import ColorGradient from '../components/ColorGradient';

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
      dragging: false,
      colorGradientHue: {
        r: 255,
        g: 0,
        b: 0,
        hex: '#ff0000'
      }
    }
  }

  initCanvas = (canvas) => {
    // The context of the canvas
    const context = canvas.getContext('2d');

    // The size of the canvas
    canvas.width = 400;
    canvas.height = 400;

    // The initial background color of the canvas. Without this there would be no pixel data at the start.
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  initGradientCanvas = (canvas) => {
    // The size of the canvas
    canvas.width = 200;
    canvas.height = 200;

    const { colorGradientHue: { hex: hexColor } } = this.state; // Nested destructuring. The name of the property can be changed

    this.setGradientColor(canvas, hexColor);
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

  engage = (e, canvas) => {
    const { brush, eraser, colorPicker } = this.state.toolSelected;

    if ( brush || eraser ) {
      this.setState({ dragging: true });

      // An initial point is drawn without dragging the mouse
      this.putPoint(e, canvas, true);

    } else if ( colorPicker ) {
      // Gets the pixel color
      this.getColor(e, canvas);
    }
  }

  putPoint = (e, canvas, click) => {  // The click parameter is needed so a point is drawn without dragging the mouse
    const { toolSelected, brush, eraser, dragging } = this.state;

    // A conditional for whether the brush or eraser is selected
    const tool = toolSelected.brush ? brush : eraser;

    // The context of the canvas
    const context = canvas.getContext('2d');
    
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
      context.moveTo(x, y);
    }
  }

  resetPath = (canvas) => {
    // The path is reset
    canvas.getContext('2d').beginPath();
  }

  disengage = (canvas) => {
    this.setState({ dragging: false });

    // The path is reset. All the paths would be connected without a reseting when the mouse is up.
    const context = canvas.getContext('2d');
    context.beginPath();
  }

  getColor = (e, canvas) => {
    // Mouse position
    const x = e.nativeEvent.offsetX,
          y = e.nativeEvent.offsetY;
    
    // A reference to the context of the canvas
    const context = canvas.getContext('2d');

    // .getImageData gets an array of the pixels rgb colors [r,g,b,a,r,g,b,a,r...]
    const imgData = context.getImageData(x, y, 1, 1).data;  // .getImageData( x, y, width, height)
    
    // The hexadecimal color of the canvas pixel
    const hex = this.rgbToHex(imgData[0], imgData[1], imgData[2]);

    console.log('hex', hex);

    // The colorPicker's color is changed
    this.setState({ colorPicker: { color: hex } });
    
    // The brush's color is changed
    this.handleBrushSettings('brush', 'color', hex);
  }

  handleGradientHueChange = (e, canvas) => {
    const value = e.target.value;
    const range = new Array(7);
    for (let i = 0; i < range.length; i++) {
      range[i] = i * 255;
    }

    const r = (value >= range[4]  && value < range[5]+1) 
            ? (value - range[4]) 
            : ((value >= range[0] && value < range[1]+1) || value >= range[5]) 
            ? range[1] 
            : (value >= range[1]  && value < range[2]+1) 
            ? (range[2] - value) 
            : range[0];
    const g = (value >= range[0]  && value < range[1]+1) 
            ? (+value) 
            : (value >= range[1]  && value < range[3]+1) 
            ? range[1] 
            : (value >= range[3]  && value < range[4]+1) 
            ? (range[4] - value) 
            : range[0];
    const b = (value >= range[2]  && value < range[3]+1) 
            ? (value - range[2]) 
            : (value >= range[3]  && value < range[5]+1) 
            ? range[1] 
            : (value >= range[5]  && value < range[6]+1) 
            ? (range[6] - value) 
            : range[0];
    const hex = this.rgbToHex(r, g, b);

    console.log( r, g, b, hex );

    this.setState({ 
      colorGradientHue: { r, g, b, hex } 
    });

    this.setGradientColor(canvas, hex);
  }

  setGradientColor = (canvas, hexColor) => {
    const context = canvas.getContext('2d');

    // Hue color
    context.fillStyle = hexColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // White linear gradient
    const whiteGrd = context.createLinearGradient(0, 0, canvas.width, 0);
    whiteGrd.addColorStop(0, "#fff");
    whiteGrd.addColorStop(1, "transparent");
    context.fillStyle = whiteGrd;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Black linear gradient
    const blackGrd = context.createLinearGradient(0, canvas.height, 0, 0);
    blackGrd.addColorStop(0, "#000");
    blackGrd.addColorStop(1, "transparent");
    context.fillStyle = blackGrd;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Picker circle
    context.strokeStyle = '#fff';
    context.stroke();
    context.arc(100, 100, 5, 0, 2 * Math.PI);
  }

  drawGradientPickerCircle = (e, canvas) => {
    const context = canvas.getContext('2d');

    // Mouse position
    const x = e.nativeEvent.offsetX,
          y = e.nativeEvent.offsetY;

    // Picker circle
    context.strokeStyle = '#fff';
    context.stroke();
    context.arc(x, y, 5, 0, 2 * Math.PI);
  }

  colorToHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }

  rgbToHex = (r, g, b) => {
    const { colorToHex } = this;
    return `#${colorToHex(r)}${colorToHex(g)}${colorToHex(b)}`;
  }

  render() {
    const { toolSelected, brush, eraser, colorPicker, colorGradientHue } = this.state;

    return (
      <Sketcher 
        toolSelected={ toolSelected }
        brush={ brush }
        eraser={ eraser }
        colorPicker={ colorPicker }
        handleChange={ this.handleChange }
        handleToolChange={ this.handleToolChange }
        handleBrushSettings={ this.handleBrushSettings }>

        <MainCanvas 
          initCanvas={ this.initCanvas }
          engage={ this.engage }
          putPoint={ this.putPoint }
          resetPath={ this.resetPath }
          disengage={ this.disengage } />
        <ColorGradient
          colorGradientHue={ colorGradientHue }
          initGradientCanvas={ this.initGradientCanvas }
          getColor={ this.getColor }
          handleGradientHueChange={ this.handleGradientHueChange } />

      </Sketcher>
    );
  }
}

export default SketcherCntr;
