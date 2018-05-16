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
    canvas.width = y+1;
    canvas.height = y;

    console.log(canvas.getContext('2d'));

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

  getColor = (canvas, e, fire) => {
    // If the fire parameter is true, the code runs. This is needed when mouse dragging isn't involved.
    if ( this.state.dragging || fire ) {
      // The canvas is updated so the circle changes position.
      this.setCanvas(canvas, e);

      // Canvas context
      const context = canvas.getContext('2d');

      //
      const x = this.getPosition(canvas, e).x;
      const y = this.getPosition(canvas, e).y;
      
      // The .getImageData() method returns an array of the pixel rgb colors [r,g,b,a,r,g,b,a,r...]
      const imgData = context.getImageData(x, y, 1, 1).data;  // .getImageData(x, y, width, height)
      
      const r = imgData[0];
      const g = imgData[1];
      const b = imgData[2];
      const hex = this.rgbToHex(r, g, b);

      console.log('getColor', { x, y, hex });

      this.setState({ 
        color: { hex, x, y }
      });
    }
  }

  handleHueChange = (canvas, e) => {
    const value = +e.target.value; // The target value is converted to an integer
    const rgb = new Array(3);
    const range = new Array(rgb.length * 2 + 1);
    const index = new Array(rgb.length);
    const indexStart = [4, 5, 1, 2]; // Initial index values for the range

    // Range values. RGB values range from 0 to 255.
    for (let i = 0; i < range.length; i++) {
      range[i] = i * 255;
    }

    // The index values for the rgb ranges. If an index are greater thaan the length of range, the value is 0.
    const l = range.length-1;
    for (let i = 0; i < index.length; i++) {
      const j = i * 2;
      index[i] = indexStart.map((e, k) => {
        return ((k === 0 && j+indexStart[0] >= l) || j+indexStart[k] > l) ? j+indexStart[k] - l : j+indexStart[k];
      });
    }

    // The rgb values change within specific ranges. The rgb values always range from 0 to 255.
    for (let i = 0; i < rgb.length; i++) {
      rgb[i] = (value >= range[index[i][0]] && value < range[index[i][1]]+1) 
             ? (value - range[index[i][0]])
             : (value >= range[index[i][1]] && value < range[index[i][2]]+1) 
               || (i === 0 && (value >= range[5] || (value >= range[0] && value < range[1]+1))) // When the color goes back to red
             ? range[1] 
             : (value >= range[index[i][2]] && value < range[index[i][3]]+1) 
             ? (range[index[i][3]] - value) 
             : range[0];
    }

    const r = rgb[0], 
          g = rgb[1], 
          b = rgb[2], 
          hex = this.rgbToHex(r, g, b);

    console.log( 'handleHueChange', { r, g, b, hex });

    this.setState({ 
      gradientHue: { r, g, b, hex } 
    });

    // The selected color and the canvas are updated.
    this.getColor(canvas, e, true);
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
    // Canvas Context
    const context = canvas.getContext('2d');

    //
    const x = this.getPosition(canvas, e).x;
    const y = this.getPosition(canvas, e).y;
    const radius = 5; // arc radius

    // Circle
    context.arc(x, y, radius, 0, 2 * Math.PI);

    // The stroke is black in the lighter area and white in the darker area
    context.strokeStyle = (x < 50 && y < 50) ? '#000' : '#fff';
    context.stroke();

    // The path is reset so it's not one long path
    context.beginPath();
  }

  colorToHex = (c) => {
    const hex = c.toString(16); // The radix is 16 for hexidecimal numbers
    return hex.length === 1 ? "0" + hex : hex;
  }

  rgbToHex = (r, g, b) => {
    const { colorToHex } = this;
    return `#${colorToHex(r)}${colorToHex(g)}${colorToHex(b)}`;
  }

  getPosition = (canvas, e) => {
    const { color: c } = this.state;
    let x = c.x;
    let y = c.y;

    if (e) {
      // Subtracting the canvas coordinates from the mouse coordinates get the coordinates relative to the canvas, which is needed to position the circle when the mouse is out the canvas.
      // If the event values are undefined, the values from state are used.
      x = e.clientX - canvas.offsetLeft || c.x;
      y = e.clientY - canvas.offsetTop  || c.y;

      // Boundaries so the circle stays with in the canvas
      x = x < 0 ? 0 : x > canvas.width-1 ? canvas.width-1 : x;
      y = y < 0 ? 0 : y > canvas.height  ? canvas.height  : y;
    }
    
    return { x, y };
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
