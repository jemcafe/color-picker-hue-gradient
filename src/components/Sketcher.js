import React from 'react';
import PropTypes from 'prop-types';

const Sketcher = (props) => {
  const {
    toolSelected,
    brush, 
    eraser,
    handleChange, 
    handleToolChange
  } = props;

  return (
    <div className="sketcher">
      <ul className="tool-menu">
        <li className="fas fa-paint-brush" onClick={() => handleToolChange('brush')}></li>
        <li className="fas fa-eraser" onClick={() => handleToolChange('eraser')}></li>
        <li className="fas fa-eye-dropper" onClick={() => handleToolChange('colorPicker')}></li>
      </ul>

      <div className="tool-customize-menu">
        Brush Radius:
        <input type="range" value={ brush.radius } onChange={(e) => handleChange('brushRadius', e.target.value)}/>
        { brush.radius }
      </div>

      { props.children /* The canvas */  }
    </div>
  );
}

Sketcher.propTypes = {
  toolSelected: PropTypes.object.isRequired,
  brush: PropTypes.object.isRequired, 
  eraser: PropTypes.object.isRequired, 
  handleChange: PropTypes.func.isRequired, 
  handleToolChange: PropTypes.func.isRequired
}

export default Sketcher;
