import React, { Component } from 'react';
import PropTypes from 'prop-types';

class MainCanvas extends Component {

   componentDidMount () {
      this.props.initCanvas(this.refs.canvas);
   }

   render () {
      const { engage, putPoint, resetPath, disengage } = this.props;

      return (
         <canvas 
            className="main-canvas"
            ref="canvas"
            onMouseDown={(e) => engage(e, this.refs.canvas)}
            onMouseMove={(e) => putPoint(e, this.refs.canvas, false)}
            onMouseOut={(e) => resetPath(this.refs.canvas)}
            onMouseUp={(e) => disengage(this.refs.canvas)}/>
      );
   }
}

MainCanvas.propTypes = {
   initCanvas: PropTypes.func.isRequired,
   engage: PropTypes.func.isRequired,
   putPoint: PropTypes.func.isRequired,
   resetPath: PropTypes.func.isRequired,
   disengage: PropTypes.func.isRequired
 }

export default MainCanvas;