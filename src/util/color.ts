export type Color = {
  r: number;
  g: number;
  b: number;
};

export const createColor = (r: number, g: number, b: number): Color => ({
  r: Math.round(r),
  g: Math.round(g),
  b: Math.round(b),
});

export const toRGB = (color: Color) =>
  `rgb(${color.r}, ${color.g}, ${color.b})`;

const getTransitValue = (valFrom: number, valTo: number, offset: number) =>
  (valTo - valFrom) * offset + valFrom;

export const getTransitColor = (
  colorFrom: Color,
  colorTo: Color,
  offset: number,
): Color =>
  createColor(
    getTransitValue(colorFrom.r, colorTo.r, offset),
    getTransitValue(colorFrom.g, colorTo.g, offset),
    getTransitValue(colorFrom.b, colorTo.b, offset),
  );
