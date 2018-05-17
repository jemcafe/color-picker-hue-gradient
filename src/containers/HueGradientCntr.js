import React, { Component } from 'react';
import HueGradient from '../components/HueGradient';

class HueGradientCntr extends Component {
  constructor () {
    super();
    this.state = {
      color: {
        r: 0,
        g: 0,
        b: 0,
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
      dragging: false,
      focus: false
    }
  }

  initCanvas = (canvas) => {
    // The size of the canvas. 
    // The y coordinate value of color is used for the initial canvas size because the default color is black which always located at the height value of the canvas.
    // Needed to add 1 to the width to prevent the getImageData method from returning values of 0 when trying to get the color at the edge of the canvas (the right side only).
    const { color: { y } } = this.state;
    canvas.width = y+1;
    canvas.height = y;

    console.log(canvas.getContext('2d'));

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
      const pos = this.getPosition(canvas, e);
      const x = pos.x;
      const y = pos.y;
      
      // The .getImageData() method returns an array of the pixel rgb colors [r,g,b,a,r,g,b,a,r...]
      const imgData = context.getImageData(x, y, 1, 1).data;  // .getImageData(x, y, width, height)
      
      const r = imgData[0];
      const g = imgData[1];
      const b = imgData[2];
      const hex = this.rgbToHex(r, g, b);

      console.log('getColor', { r, g, b, hex, x, y });

      this.setState({ 
        color: { r, g, b, hex, x, y }
      });
    }
  }

  handleHueChange = (canvas, e) => {
    const value = +e.target.value;               // The string is converted to a number
    const rgb = new Array(3);                    // An array for the rgb values
    const range = new Array(rgb.length * 2 + 1); // red, green, and blue increases to 255 and decreases to 0  (3 * 2).  1 is added for when the color goes back to red.
    const index = new Array(rgb.length);         // rgb index values for the range array
    const indexStart = [4, 5, 1, 2];             // Initial index values for the range array

    // Range values. RGB values range from 0 to 255.
    for (let i = 0; i < range.length; i++) {
      range[i] = i * 255;
    }

    // The index values for the rgb ranges. If an index is greater than the length of range, the value is 0, so it loops around.
    const l = range.length-1;
    for (let i = 0; i < index.length; i++) {
      index[i] = indexStart.map((e, k) => {
        const j = (i * 2) + e;
        return ((k === 0 && j >= l) || j > l) ? j - l : j;
      });
    }

    // The rgb values change within specific ranges.
    for (let i = 0; i < rgb.length; i++) {
      const j = index[i];
      rgb[i] = (value >= range[j[0]] && value < range[j[1]]+1) 
             ? (value - range[j[0]])
             : (value >= range[j[1]] && value < range[j[2]]+1) 
               || (i === 0 && (value >= range[5] || (value >= range[0] && value < range[1]+1))) // When the color goes back to red
             ? range[1] 
             : (value >= range[j[2]] && value < range[j[3]]+1) 
             ? (range[j[3]] - value) 
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

  setGradientColor = (canvas, hex = this.state.gradientHue.hex ) => {  // The default hex color is the color stored in state. 
    // Canvas context
    const context = canvas.getContext('2d');
    
    // White linear gradient
    const whiteGrd = context.createLinearGradient(0, 0, canvas.width, 0);
    whiteGrd.addColorStop(0, "#fff");
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

    // Arc values
    const pos = this.getPosition(canvas, e);
    const x = pos.x;
    const y = pos.y;
    const radius = 5; // arc radius

    // These values are used for the strokeStyle condition
    const xLimit = Math.floor( (canvas.width-1)/2 );
    const yLimit = Math.floor( canvas.height/3 );
    
    // The fourth character in the hexidecimal string is tested to see if the gradient hue is one of the lighter colors (colors between orange and light blue)
    const { gradientHue: { hex } } = this.state;
    const hexCheck = /^([a-f])$/.test( hex[3] );

    // Circle
    context.arc(x, y, radius, 0, 2 * Math.PI);

    // The stroke is black if the condition is met and white if it's not.
    context.strokeStyle = ((x < xLimit || hexCheck) && y < yLimit) ? '#000' : '#fff';
    context.stroke();

    // The path is reset, so the shape is not one long path
    context.beginPath();
  }

  rgbToHex = (r, g, b) => {
    const { colorToHex: cth } = this;
    return `#${cth(r)}${cth(g)}${cth(b)}`;
  }
  
  colorToHex = (c) => {
    const hex = c.toString(16); // The radix is 16 for hexidecimal numbers
    return hex.length === 1 ? "0" + hex : hex;
  }

  getPosition = (canvas, e) => {
    const { color: c } = this.state;
    let x = c.x;
    let y = c.y;

    if (e) {
      // If the event's coordinate values are undefined, then values from state are used.
      // Subtracting the canvas offset from the event coordinates get the coordinates relative to the canvas, which is needed to position the circle when the mouse is out the canvas.
      x = e.clientX ? e.clientX - canvas.offsetLeft : x;
      y = e.clientY ? e.clientY - canvas.offsetTop  : y;

      // Boundaries so the circle stays with in the canvas
      x = x < 0 ? 0 : x > canvas.width-1 ? canvas.width-1 : x;
      y = y < 0 ? 0 : y > canvas.height  ? canvas.height  : y;
    }
    
    return { x, y };
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
