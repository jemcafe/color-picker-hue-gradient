export const rgbToHex = (r, g, b) => (
  `#${colorToHex(r)}${colorToHex(g)}${colorToHex(b)}`
);

export const colorToHex = (c) => {
  // The radix is 16 for hexidecimal numbers
  const hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

export const rgbToHSL = (r, g, b) => {
  // If the parameter values are out of range or not numbers, the default is returned.
  if (
    r > 255  || g > 255  || b > 255 || 
    r < 0    || g < 0    || b < 0   ||
    isNaN(r) || isNaN(g) || isNaN(b)
  ) return { h: 0, s: 0, l: 0 };

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
        // Function expression for offsetting the index. It loops around if it's greater the array length. 
        const index = (offset, j = i+offset) => j > RGB.length-1 ? j-RGB.length : j;
        // Hue formula   (i * 2 is the bit value (0deg, 120deg, or 240deg) (red, green, or blue zone))
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
  // If the parameter values are out of range or not numbers, the default is returned.
  if (
    h > 360  || s > 100  || l > 100 || 
    h < 0    || s < 0    || l < 0   ||
    isNaN(h) || isNaN(s) || isNaN(l)
  ) return { r: 0, g: 0, b: 0 };

  // The HSL values are converted to deciamls
  const H = +(h / 360).toFixed(3); 
  const S = s * 0.01;
  const L = l * 0.01;
  let RGB = [0, 0, 0];

  if (S === 0) {
    // If saturation is 0, there is no color. It's a grayscale, so the rgb values are equal.
    RGB = RGB.map(e => Math.round(L * 0.01 * 255));
  } else {
    // If lightness is less than 50%, use the formula for the darker values else use the formula for the lighter values.
    const temp_1 = L < 0.5 ? (L * (1.0 + S)) : (L + S - (L * S));
    const temp_2 = (2 * L) - temp_1;
    
    // 100% / 3 = 33.333...
    let temp_RGB = [
      +(H + 0.333).toFixed(3),
      +(H).toFixed(3),
      +(H - 0.333).toFixed(3)
    ];

    // The temporary rgb values are kept between 0 and 1
    temp_RGB = temp_RGB.map(e => e < 0 ? e+1 : e > 1 ? e-1 : e);

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

    // Converted to 8-bit color values
    RGB = RGB.map(e => Math.round(e * 255));
  }

  return { r: RGB[0], g: RGB[1], b: RGB[2] };
}

export const rgbToCMYK = (r, g, b) => {
  // The HSL values equal 0, if the parameter values are out of range or not numbers.
  if (
    r > 255  || g > 255  || b > 255 || 
    r < 0    || g < 0    || b < 0   ||
    isNaN(r) || isNaN(g) || isNaN(b)
  ) return { c: 0, m: 0, y: 0, k: 1 };

  // 
  let CMYK = [
    1 - (r/255),
    1 - (g/255),
    1 - (b/255),
    0
  ];
  let temp_K = 1;

  // Find the smallest CMY value
  CMYK.forEach((e,i) => { if (i !== 3) temp_K = e < temp_K ? e : temp_K });

  // CMYK
  if (temp_K === 1) {  // The color is black
    CMYK = CMYK.map((e,i) => i !== 3 ? 0 : e);
  } else {
    // Formula for CMY values
    CMYK = CMYK.map((e,i) => i !== 3 ? +((e - temp_K)/(1 - temp_K)).toFixed(2) : e);
  }
  CMYK[3] = +temp_K.toFixed(2);

  // Converted to percentage
  CMYK = CMYK.map(e => Math.floor(e *= 100));
  
  return { c: CMYK[0], m: CMYK[1], y: CMYK[2], k: CMYK[3] };
}

// export const cmykToRGB = (c, m, y, k) => {

// }