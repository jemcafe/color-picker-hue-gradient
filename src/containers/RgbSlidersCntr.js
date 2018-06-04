import React, { Component } from 'react';
import { RGBtoHex } from '../helpers/colorConversion';
import { setGradientColor, getPosition } from '../helpers/canvas';
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

    console.log('RGB canvas', canvas.getContext('2d'));

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
      const hex = RGBtoHex(rgb.r, rgb.g, rgb.b);
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
      const { color: c } = this.state;
      const initialPos = { x: c.x, y: c.y };
      const pos = getPosition(canvas, e, initialPos);
      const x = pos.x;
      const y = pos.y;
      
      // The .getImageData() method returns an array of the pixel rgb colors [r,g,b,a,r,g,b,a,r...]
      const imgData = context.getImageData(x, y, 1, 1).data;  // .getImageData(x, y, width, height)

      // Color values
      const rgb = { r: imgData[0], g: imgData[1], b: imgData[2] };
      const hex = RGBtoHex(rgb.r, rgb.g, rgb.b);

      this.setState({ 
        color: { rgb, hex, x, y }
      });
    }
  }

  setCanvas = (canvas, e) => {
    setGradientColor(canvas);
    this.drawCircle(canvas, e);
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
    
    // The fourth character in the hexidecimal string is tested to see if the gradient hue is one of the lighter colors (colors between orange and light blue)
    const hexCheck = /^([a-f])$/.test( c.hex[3] );

    // The color is black if the condition is met and white if it's not.
    const strokeColor = hexCheck ? '#000' : '#fff';

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
