import React, { Component } from 'react';
import { rgbToHex } from '../helpers/colorConversion';
import { getPosition } from '../helpers/canvas';
import HueGradient from '../components/HueGradient';

class HueGradientCntr extends Component {
  constructor () {
    super();
    this.state = {
      color: {
        rgb: { r: 255, g: 0, b: 0 },
        hex: '#ff0000',
        x: 200,
        y: 0
      },
      gradientHue: {
        r: 255,
        g: 0,
        b: 0,
        hex: '#ff0000'
      },
      dragging: false,
      focus: false
    }
  }

  initCanvas = (canvas) => {
    // The size of the canvas. 
    // The coordinate value of color is used for the initial canvas size because the default color is the size of the canvas.
    // Needed to add 1 to the width to prevent the getImageData method from returning values of 0 when trying to get the color at the edge of the canvas (the right side only).
    const { color: { x } } = this.state;
    canvas.width = x + 1;
    canvas.height = x;

    console.log('Hue canvas', canvas.getContext('2d'));

    this.setCanvas(canvas);
  }

  engage = (canvas, e) => {
    this.setState({ dragging: true, focus: true });
    this.getColor(canvas, e, true);
  }

  disengage = (canvas) => {
    this.setState({ dragging: false, focus: false });
  }

  getColor = (canvas, e, fire) => {
    // If the fire parameter is true, the code runs. This is needed when mouse dragging isn't involved.
    if ( this.state.dragging || fire ) {
      // The canvas is updated so the circle changes position.
      this.setCanvas(canvas, e);

      // Canvas context
      const context = canvas.getContext('2d');

      // Color location (mouse location)
      const { color: c } = this.state;
      const initialPos = { x: c.x, y: c.y };
      const pos = getPosition(canvas, e, initialPos);
      const x = pos.x;
      const y = pos.y;
      
      // The .getImageData() method returns an array of the pixel rgb colors [r,g,b,a,r,g,b,a,r...]
      const imgData = context.getImageData(x, y, 1, 1).data;  // .getImageData(x, y, width, height)
      
      const rgb = { r: imgData[0], g: imgData[1], b: imgData[2] };
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

      console.log('getColor', { rgb, hex, x, y });

      this.setState({ 
        color: { rgb, hex, x, y }
      });
    }
  }

  handleHueChange = (canvas, e) => {
    const value = +e.target.value;               // The string is converted to a number
    let rgb = [0, 0, 0];                    // An array for the rgb values
    const range = new Array(rgb.length * 2 + 1); // red, green, and blue increases to 255 and decreases to 0  (3 * 2).  1 is added for when the color goes back to red.

    // Range values. RGB values range from 0 to 255.
    for (let i = 0; i < range.length; i++) range[i] = i * 255;

    // RGB values
    const l = range.length-1;
    rgb = rgb.map((e, i) => {
      // Function expression for the ranges's index value. The value loops around.
      const index = (offset, j = (i * 2 + offset)) => (i === rgb.length-1 && j === l) ? l : (j % l);

      // The rgb values change if the input value is within the specific ranges
      return (value >= range[index(4)] && value < range[index(5)]+1) 
           ? (value - range[index(4)]) 
           : (value >= range[index(5)] && value < range[index(1)]+1) ||
             (i === 0 && (value >= range[5] || (value >= range[0] && value < range[1]+1))) // When the color goes back to red
           ? range[1] 
           : (value >= range[index(1)] && value < range[index(2)]+1) 
           ? (range[index(2)] - value) 
           : range[0];
    });

    const r = rgb[0], 
          g = rgb[1], 
          b = rgb[2], 
          hex = rgbToHex(r, g, b);

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

  setGradientColor = (canvas, hex = this.state.gradientHue.hex ) => {  // The default hex color is the color stored in state. 
    // Canvas context
    const context = canvas.getContext('2d');
    
    // White linear gradient
    const whiteGrd = context.createLinearGradient(0, 0, canvas.width, 0);
    whiteGrd.addColorStop(0, "#fff");
    whiteGrd.addColorStop(0.99, hex);
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

    // Arc values
    const { color: c } = this.state;
    const initialPos = { x: c.x, y: c.y };
    const pos = getPosition(canvas, e, initialPos);
    const x = pos.x;
    const y = pos.y;
    const radius = 5;

    // These values are used for the strokeStyle condition
    const xLimit = Math.floor( (canvas.width-1)/2 );
    const yLimit = Math.floor( canvas.height/3 );
    
    // The fourth character in the hexidecimal string is tested to see if the gradient hue is one of the lighter colors (colors between orange and light blue)
    const { gradientHue: { hex } } = this.state;
    const hexCheck = /^([a-f])$/.test( hex[3] );

    // The stroke is black if the condition is met and white if it's not.
    const strokeColor = ((x < xLimit || hexCheck) && y < yLimit) ? '#000' : '#fff';;

    // Circle
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.strokeStyle = strokeColor;
    context.stroke();

    // The path is reset, so the shape is not one long path
    context.beginPath();
  }

  render() {
    const { color, focus } = this.state;

    return (
      <HueGradient
        color={ color }
        focus={ focus }
        initCanvas={ this.initCanvas }
        engage={ this.engage }
        getColor={ this.getColor }
        disengage={ this.disengage }
        handleHueChange={ this.handleHueChange } />
    );
  }
}

export default HueGradientCntr;
