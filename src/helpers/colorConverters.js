export const rgbToHex = (r, g, b) => (
  `#${colorToHex(r)}${colorToHex(g)}${colorToHex(b)}`
);

export const colorToHex = (c) => {
  // The radix is 16 for hexidecimal numbers
  const hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

export const rgbToHSL = (r, g, b) => {
  const rgb = [r, g, b];
  let min = 255, max = 0;
  let H = 0, S = 0, B = 0;

  // The rgb values are converted to decimals for 8-bit color, and the smallest and largest values are found.
  for (let i = 0; i < rgb.length; i++) {
    rgb[i] = +(rgb[i]/255).toFixed(2);
    max = rgb[i] > max ? rgb[i] : max;
    min = rgb[i] < min ? rgb[i] : min;
  }
  
  // BRIGHTNESS
  B = Math.round((min + max)/2 * 100);  // Brightness formula
  
  // SATURATION
  // The color is a shade of grey when they're all equal, so I just used the max value for the percentage.
  if (rgb[0] === rgb[1] && rgb[1] === rgb[2]) {
    S = max * 100;
  } else if (max === min) {
    S = 0;
  } else {
    // 0deg or 120deg (red or green zone)
    const bit = B > 0.5 ? 2.0 : 0;
    // Brightness formula
    S = Math.round((max-min)/(bit-min-max) * 100);  // Saturation formula
  }

  // HUE
  if (S === 0) {
    H = 0;
  } else {
    rgb.forEach((e, i) => {
      if (e === max) {
        // The index offset. I loops around if it goes over the array length. 
        const index = (offset) => i+offset > rgb.length-1 ? 0 : i+offset;
        // bit values (0deg, 120deg, or 240deg) (red, green, or blue zone)
        const bit = i * 2;
        // Hue formula
        H = bit + (rgb[index(1)]-rgb[index(2)])/(max-min);
        // Converted to a percentage of 360
        H = Math.round(H.toFixed(2) * 60);
        // When the hue goes back to red it's negative, so 360 must be added.
        H = H < 0 ? H + 360 : H;
      }
    });
  }

  return { H, S, B };
}

// export const hsbToRGB = (h, s, b) => {
//   const hsb = [h, s, b];
//   let R = 0, G = 0, B = 0;
// }