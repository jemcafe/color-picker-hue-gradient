import React, { Component } from 'react';
import ColorGradient from '../components/ColorGradient';

class ColorGradientCntr extends Component {
  constructor () {
    super();
    this.state = {
      color: {
        hex: '#000',
        x: 0,
        y: 200
      },
      gradientHue: {
        r: 255,
        g: 0,
        b: 0,
        hex: '#ff0000'
      },
      dragging: false
    }
  }

  initCanvas = (canvas) => {
    const { color: { y } } = this.state;

    // The size of the canvas. 
    // The y coordinate value of color is used for the initial canvas size because the default color is black which always located at the height value of the canvas.
    canvas.width = y;
    canvas.height = y;

    this.setCanvas(canvas);
  }

  handleChange = (property, value) => {
    this.setState({ [property]: value });
  }

  engage = (canvas, e) => {
    this.setState({ dragging: true });
    this.getColor(canvas, e, true);
  }

  disengage = (canvas) => {
    this.setState({ dragging: false });
  }

  getColor = (canvas, e, click) => {
    if ( this.state.dragging || click ) {
      // Mouse position
      const x = e.nativeEvent.offsetX,
            y = e.nativeEvent.offsetY;
      
      // A reference to the context of the canvas
      const context = canvas.getContext('2d');

      // The .getImageData() method returns an array of the pixel rgb colors [r,g,b,a,r,g,b,a,r...]
      const imgData = context.getImageData(x, y, 1, 1).data;  // .getImageData(x, y, width, height)
      
      // The hexadecimal color of the canvas pixel
      const hex = this.rgbToHex(imgData[0], imgData[1], imgData[2]);

      console.log('getColor', { x, y, hex });

      // The selected color and coordinates are updated
      this.setState({ 
        color: { hex, x, y }
      });

      // The canvas is set so the circle changes position.
      this.setCanvas(canvas, e);
    }
  }

  handleHueChange = (canvas, e) => {
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

    console.log( 'handleHueChange', { r, g, b, hex });

    this.setState({ 
      gradientHue: { r, g, b, hex } 
    });

    this.setCanvas(canvas, e, hex);
  }

  setCanvas = (canvas, e, hex) => {
    this.setGradientColor(canvas, hex);
    this.drawCircle(canvas, e);
  }

  setGradientColor = (canvas, hex = this.state.gradientHue.hex ) => {
    // Canvas context
    const context = canvas.getContext('2d');
    
    // White linear gradient
    const whiteGrd = context.createLinearGradient(0, 0, canvas.width, 0);
    whiteGrd.addColorStop(0.01, "#fff");
    whiteGrd.addColorStop(1, hex);
    context.fillStyle = whiteGrd;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Black linear gradient
    const blackGrd = context.createLinearGradient(0, canvas.height, 0, 0);
    blackGrd.addColorStop(0, "#000");
    blackGrd.addColorStop(0.99, "transparent");
    context.fillStyle = blackGrd;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  drawCircle = (canvas, e) => {
    // Canvas context
    const context = canvas.getContext('2d');

    // Mouse position and radius
    // If there is no mouse event or the mouse coordinates are undefined, the coordinates from state are used.
    const { color: c } = this.state;
    const x = e ? e.nativeEvent.offsetX || c.x : c.x,
          y = e ? e.nativeEvent.offsetY || c.y : c.y,
          radius = 5;

    // Circle
    context.arc(x, y, radius, 0, 2 * Math.PI);

    // The stroke is black in the lighter area and white in the darker area
    context.strokeStyle = (x < 50 && y < 50) ? '#000' : '#fff';
    context.stroke();

    // The path is reset so it's not one long path
    context.beginPath();
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
    const { color } = this.state;

    return (
      <ColorGradient
         color={ color }
         initCanvas={ this.initCanvas }
         engage={ this.engage }
         getColor={ this.getColor }
         disengage={ this.disengage }
         handleHueChange={ this.handleHueChange } />
    );
  }
}

export default ColorGradientCntr;
