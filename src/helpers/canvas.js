export const getPosition = (canvas, e, initial = {x: 0, y: 0}) => {
   let x = initial.x;
   let y = initial.y;

   if (e) {
     // If the event's coordinate values are undefined, then values from state are used.
     // Subtracting the canvas offset from the event coordinates get the coordinates relative to the canvas, which is needed to position the circle when the mouse is out the canvas.
     // Adding the window offset gets the coordinates relative to the canvas when the window page is scrolled.
     x = e.clientX ? e.clientX - canvas.offsetLeft + window.pageXOffset : x;
     y = e.clientY ? e.clientY - canvas.offsetTop + window.pageYOffset  : y;

     // Boundaries so the circle stays with in the canvas
     x = x < 0 ? 0 : x > canvas.width-1 ? canvas.width-1 : x;
     y = y < 0 ? 0 : y > canvas.height  ? canvas.height  : y;
   }
   
   return { x, y };
 }