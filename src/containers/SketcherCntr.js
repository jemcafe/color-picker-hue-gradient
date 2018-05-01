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
    }
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

  render() {
    const { brush, eraser, colorPicker, brushRadius, eraserRadius } = this.state;

    return (
      <Sketcher brush={ brush }
                eraser={ eraser }
                colorPicker={ colorPicker }
                brushRadius={ brushRadius }
                eraserRadius={ eraserRadius }
                handleChange={ this.handleChange }
                handleToolChange={ this.handleToolChange } />
    );
  }
}

export default SketcherCntr;
