export const rgbToHex = (r, g, b) => (
  `#${colorToHex(r)}${colorToHex(g)}${colorToHex(b)}`
);

export const colorToHex = (c) => {
  // The radix is 16 for hexidecimal numbers
  const hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

export const rgbToHSL = (r, g, b) => {
  const RGB = [r, g, b];
  let min = 255, max = 0;
  let H = 0; 
  let S = 0; 
  let L = 0;

  // The rgb values are converted from 8-bit color values to decimals, and the smallest and largest values are found.
  for (let i = 0; i < RGB.length; i++) {
    RGB[i] = +(RGB[i]/255).toFixed(2);
    max = RGB[i] > max ? RGB[i] : max;
    min = RGB[i] < min ? RGB[i] : min;
  }
  
  // LIGHTNESS
  L = Math.round((min + max)/2 * 100);  // Brightness formula
  
  // SATURATION
  if (max === min) {
    S = 0;
  } else if (RGB[0] === RGB[1] && RGB[1] === RGB[2]) {
    // It's grayscaled when the values are equal. The max, min, r, g, or b value can be used to get the percentage.
    S = max * 100;
  } else {
    // If the lightness is greater than 50%, the saturation is darker and lighter if it's not.
    const bit = L > 0.5 ? 2.0 : 0;
    // Saturation formula
    S = Math.round((max-min)/(bit-min-max) * 100);
  }

  // HUE
  if (S === 0) {
    H = 0;
  } else {
    RGB.forEach((e, i) => {
      if (e === max) {
        // The index offset. It loops around if it goes over the array length. 
        const index = (offset, j = i+offset) => j > RGB.length-1 ? j-RGB.length : j;
        // Hue formula    (The i * 2 is the bit value (0deg, 120deg, or 240deg) (red, green, or blue zone))
        H = (i * 2) + (RGB[index(1)]-RGB[index(2)])/(max-min);
        // Converted to a percentage of 360
        H = Math.round(H.toFixed(2) * 60);
        // When the hue goes back to red it's negative, so 360 must be added.
        H = H < 0 ? H + 360 : H;
      }
    });
  }

  return { h: H, s: S, l: L };
}

export const hslToRGB = (h, s, l) => {
  // hsl values are converted to deciamls
  const H = +(h / 360).toFixed(3); 
  const S = s * 0.01;
  const L = l * 0.01;
  let RGB = [0, 0, 0];

  if (S === 0) {
    // If saturation is zero there is no color. It's a grayscale, so the rgb values are the same.
    RGB = RGB.map(e => Math.round(L * 0.01 * 255));
  } else {
    // If this lightness (L) is less than 50%, use the formula for the darker values else use the formula for the lighter values.
    const temp_1 = L < 0.5 ? (L * (1.0 + S)) : (L + S - (L * S));
    const temp_2 = (2 * L) - temp_1;
    
    // 100% / 3 = 33.333...
    let temp_RGB = [
      +(H + 0.333).toFixed(3),
      +(H).toFixed(3),
      +(H - 0.333).toFixed(3)
    ];

    // The temporary rgb values kept between 0 and 1
    temp_RGB = temp_RGB.map(e => e < 0 ? e + 1 : e > 1 ? e - 1 : e);

    // RGB
    RGB = RGB.map((e, i) => {
      if (6 * temp_RGB[i] < 1) {
        return temp_2 + (temp_1 - temp_2) * 6 * temp_RGB[i];
      } else if (2 * temp_RGB[i] < 1) {
        return temp_1;
      } else if (3 * temp_RGB[i] < 2) {
        return temp_2 + (temp_1 - temp_2) * 6 * (0.666 - temp_RGB[i]);
      } else {
        return temp_2;
      }
    });

    // Converted to 8-bit colors
    RGB = RGB.map(e => Math.round(e * 255));
  }

  return { r: RGB[0], g: RGB[1], b: RGB[2] };
}