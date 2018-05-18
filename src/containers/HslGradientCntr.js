import React, { Component } from 'react';
import { rgbToHex, rgbToHSL, hslToRGB } from '../helpers/colorConverters';
import HslGradient from '../components/HslGradient';

class HslGradientCntr extends Component {
  constructor () {
    super();
    this.state = {
      color: {
        rgb: { r: 0, g: 0, b: 0 },
        hsl: { h: 0, s: 100, l: 0 },
        hex: '#000',
        x: 0,
        y: 200
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

  handleColorChange = (canvas, property, e) => {
    const value = +e.target.value;

    this.setState(prevState => {
      const hsl = {
        h: property === 'h' ? value : prevState.color.hsl.h,
        s: property === 's' ? value : prevState.color.hsl.s,
        l: property === 'l' ? value : prevState.color.hsl.l
      }
      const rgb = hslToRGB(hsl.h, hsl.s, hsl.l);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      const x = prevState.color.x;
      const y = prevState.color.y;

      return {
        color: { rgb, hsl, hex, x, y }
      }
    });

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
      const pos = this.getMousePosition(canvas, e);
      const x = pos.x;
      const y = pos.y;
      
      // The .getImageData() method returns an array of the pixel rgb colors [r,g,b,a,r,g,b,a,r...]
      const imgData = context.getImageData(x, y, 1, 1).data;  // .getImageData(x, y, width, height)

      // Color values
      const rgb = { r: imgData[0], g: imgData[1], b: imgData[2] };
      const hsl = rgbToHSL(rgb.r, rgb.g, rgb.b);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

      this.setState({ 
        color: { rgb, hsl, hex, x, y }
      });
    }
  }

  setCanvas = (canvas, e) => {
    this.setGradientColor(canvas);
    this.drawCircle(canvas, e);
  }

  setGradientColor = (canvas) => {  // The default hex color is the color stored in state. 
    // Canvas context
    const context = canvas.getContext('2d');

    // Color gradient
    const colorGrd = context.createLinearGradient(0, 0, canvas.width, 0);
    const deg = [0, ...new Array(6)];

    // The degrees of each color in the gradient
    for (let i = 1; i < deg.length; i++) {
      deg[i] = +((i+1)/deg.length).toFixed(2);
    }

    // The gradient colors
    for (let i = 0; i < deg.length; i++) {
      const r = (i === 0 || i === 1 || i === 5 || i === 6) ? 255 : 0;
      const g = (i === 1 || i === 2 || i === 3) ? 255 : 0;
      const b = (i === 3 || i === 4 || i === 5) ? 255 : 0;
      colorGrd.addColorStop(deg[i], `rgb(${r},${g},${b})`);
    }
    
    context.fillStyle = colorGrd;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // White gradient
    const whiteGrd = context.createLinearGradient(0, canvas.height/2, 0, 0);
    whiteGrd.addColorStop(0.01, "transparent");
    whiteGrd.addColorStop(0.99, "#fff");
    context.fillStyle = whiteGrd;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Black gradient
    const blackGrd = context.createLinearGradient(0, canvas.height, 0, canvas.height/2);
    blackGrd.addColorStop(0.01, "#000");
    blackGrd.addColorStop(0.99, "transparent");
    context.fillStyle = blackGrd;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  drawCircle = (canvas, e) => {
    // Canvas Context
    const context = canvas.getContext('2d');

    // Arc values
    const pos = this.getMousePosition(canvas, e);
    const x = pos.x;
    const y = pos.y;
    const radius = 5; // arc radius

    // These values are used for the strokeStyle condition
    const xLimit = Math.floor( (canvas.width-1)/2 );
    const yLimit = Math.floor( canvas.height/3 );
    
    // The fourth character in the hexidecimal string is tested to see if the gradient hue is one of the lighter colors (colors between orange and light blue)
    const { color: { hex } } = this.state;
    const hexCheck = /^([a-f])$/.test( hex[3] );

    // The color is black if the condition is met and white if it's not.
    const color = ((x < xLimit || hexCheck) && y < yLimit) ? '#000' : '#fff';

    // Circle
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.strokeStyle = color;
    context.stroke();

    // The path is reset, so the shape is not one long path
    context.beginPath();
  }

  getMousePosition = (canvas, e) => {
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

  setCirclePosition = (canvas) => {
    const { color: { h, s, l } } = this.state;
    const x = Math.round((h * canvas.width)/360);
    const y = this.state.color.y;
    return { x, y };
  }

  render() {
    const { color, focus } = this.state;

    return (
      <HslGradient
         color={ color }
         focus={ focus }
         initCanvas={ this.initCanvas }
         engage={ this.engage }
         getColor={ this.getColor }
         disengage={ this.disengage }
         handleColorChange={ this.handleColorChange} />
    );
  }
}

export default HslGradientCntr;
