import React, { Component } from 'react';
import { rgbToHex } from '../helpers/colorConverters';
import RgbSliders from '../components/RgbSliders';

class RgbSlidersCntr extends Component {
  constructor () {
    super();
    this.state = {
      color: {
        rgb: { r: 255, g: 0, b: 0 },
        hex: '#ff0000',
        x: 0,
        y: 100
      },
      dragging: false,
      focus: false
    }
  }

  initCanvas = (canvas) => {
    // The size of the canvas.
    // Needed to add 1 to the width to prevent the getImageData method from returning values of 0 when trying to get the color at the edge of the canvas (the right side only).
    const { color: { y } } = this.state;
    canvas.width = (y * 2) + 1;
    canvas.height = y * 2;

    console.log(canvas.getContext('2d'));

    this.setCanvas(canvas);
  }

  handleColorChange = (property, e) => {
    const value = +e.target.value;

   this.setState(prevState => {
      const rgb = {
         r: property === 'r' ? value : prevState.color.rgb.r,
         g: property === 'g' ? value : prevState.color.rgb.g,
         b: property === 'b' ? value : prevState.color.rgb.b
      };
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      const x = prevState.color.x;
      const y = prevState.color.y;

      return {
         color: { rgb, hex, x, y }
      }
   });
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

      // Color values
      const rgb = { r: imgData[0], g: imgData[1], b: imgData[2] };
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

      this.setState({ 
        color: { rgb, hex, x, y }
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
    const deg = new Array(7);
    
    // The gradient colors
    for (let i = 0; i < deg.length; i++) {
      // The degrees of each color in the gradient (from 0 to 1)
      const degrees = +((i + 1)/deg.length).toFixed(2);
      deg[i] = i === 0 ? 0.01 : i === deg.length-1 ? 0.99 : degrees;

      // RGB color values
      const r = (i === 0 || i === 1 || i === 5 || i === 6) ? 255 : 0;
      const g = (i === 1 || i === 2 || i === 3) ? 255 : 0;
      const b = (i === 3 || i === 4 || i === 5) ? 255 : 0;

      // Gradient color
      colorGrd.addColorStop(deg[i], `rgb(${r},${g},${b})`);
    }
    
    context.fillStyle = colorGrd;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Black and white gradient
    const BWGrd = context.createLinearGradient(0, 0, 0, canvas.height);
    BWGrd.addColorStop(0.01, "#fff");
    BWGrd.addColorStop(0.49, "transparent");
    BWGrd.addColorStop(0.51, "transparent");
    BWGrd.addColorStop(1, "#000");
    context.fillStyle = BWGrd;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  drawCircle = (canvas, e) => {
    // Canvas Context
    const context = canvas.getContext('2d');

    // Arc values
    const pos = this.getPosition(canvas, e);
    const x = pos.x;
    const y = pos.y;
    const radius = 5;
    
    // The fourth character in the hexidecimal string is tested to see if the gradient hue is one of the lighter colors (colors between orange and light blue)
    const { color: { hex } } = this.state;
    const hexCheck = /^([a-f])$/.test( hex[3] );

    // The color is black if the condition is met and white if it's not.
    const color = hexCheck ? '#000' : '#fff';

    // Circle
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.strokeStyle = color;
    context.stroke();

    // The path is reset, so the shape is not one long path
    context.beginPath();
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
      <RgbSliders
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

export default RgbSlidersCntr;
