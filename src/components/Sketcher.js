import React from 'react';
import PropTypes from 'prop-types';

const Sketcher = (props) => {
  const {
    brush, 
    eraser, 
    colorPicker, 
    brushRadius, 
    eraserRadius, 
    handleChange, 
    handleToolChange
  } = props;
  // console.log('Brush Selected', brush);
  // console.log('Eraser Selected', eraser);
  // console.log('ColorPicker Selected', colorPicker);

  return (
    <div className="sketcher">
      <ul className="tool-menu">
        <li className="fas fa-paint-brush" onClick={() => handleToolChange('brush')}></li>
        <li className="fas fa-eraser" onClick={() => handleToolChange('eraser')}></li>
        <li className="fas fa-eye-dropper" onClick={() => handleToolChange('colorPicker')}></li>
      </ul>

      <div className="tool-customize-menu">
        Brush Radius:
        <input type="range" value={ brushRadius } onChange={(e) => handleChange('brushRadius', e.target.value)}/>
        { brushRadius }
        {/* Eraser Radius:
        <input type="range" value={ eraserRadius } onChange={(e) => handleChange('eraserRadius', e.target.value)}/>
        { eraserRadius } */}
      </div>

      { /* The canvas */ props.children }
    </div>
  );
}

Sketcher.propTypes = {
  brush: PropTypes.bool.isRequired, 
  eraser: PropTypes.bool.isRequired, 
  colorPicker: PropTypes.bool.isRequired, 
  brushRadius: PropTypes.number.isRequired, 
  eraserRadius: PropTypes.number.isRequired, 
  handleChange: PropTypes.func.isRequired, 
  handleToolChange: PropTypes.func.isRequired
}

export default Sketcher;
