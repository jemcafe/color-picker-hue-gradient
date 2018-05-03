import React from 'react';
import PropTypes from 'prop-types';
import Aux from '../hoc/Aux';

const Sketcher = (props) => {
  const {
    toolSelected,
    brush, 
    eraser,
    handleChange, 
    handleToolChange,
    handleBrushSettings
  } = props;

  return (
    <div className="sketcher">
      <ul className="tool-menu">
        <li className="fas fa-paint-brush" onClick={() => handleToolChange('brush')}></li>
        <li className="fas fa-eraser" onClick={() => handleToolChange('eraser')}></li>
        <li className="fas fa-eye-dropper" onClick={() => handleToolChange('colorPicker')}></li>
      </ul>

      <div className="tool-customize-menu">
        { toolSelected.brush &&
          <Aux>
            Brush Radius:
            <input type="range" value={ brush.radius } onChange={(e) => handleBrushSettings('brush', 'radius', e.target.value)}/>
            { brush.radius }
          </Aux> }

        { toolSelected.eraser &&
          <Aux>
            Eraser Radius:
            <input type="range" value={ eraser.radius } onChange={(e) => handleBrushSettings('eraser', 'radius', e.target.value)}/>
            { eraser.radius }
          </Aux> }
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
  handleToolChange: PropTypes.func.isRequired,
  handleBrushSettings: PropTypes.func.isRequired,
}

export default Sketcher;
