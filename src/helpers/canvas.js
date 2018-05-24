export const setGradientColor = (canvas) => {  // The default hex color is the color stored in state. 
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

    // RGB values
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