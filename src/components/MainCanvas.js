import React, { Component } from 'react';

class MainCanvas extends Component {

   componentDidMount () {
      // A reference to the canvas and the its context
      const canvas = this.refs.canvas;
      const context = canvas.getContext('2d');
  
      // The size of the canvas
      canvas.width = 400;
      canvas.height = 400;
  
      // The initial background color of the canvas. Without this there would be no pixel data at the start.
      context.fillStyle = '#fff';
      context.fillRect(0, 0, canvas.width, canvas.height);
  
      // const context = canvas.getContext('2d');
      // const imgObj = new Image();
  
      // imgObj.onload = () => {
      //   context.drawImage(imgObj, 0, 0);
      // };
      // imgObj.src = 'http://www.bulgariasega.com/files/zdrave/glavobolie1.jpg';
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

export default MainCanvas;