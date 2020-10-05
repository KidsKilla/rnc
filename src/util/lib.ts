const inBoundsExEx = (value: number, max: number, min = 0) => {
  if (value >= max) {
    return 1;
  }
  if (value <= min) {
    return -1;
  }
  return 0;
};
const isInEx = (value: number, max: number, min = 0) =>
  value === min ? 0 : inBoundsExEx(value, max, min);

export const bounds = {
  isExEx: inBoundsExEx,
  array: isInEx,
};

type Overflow = -1 | 0 | 1;

export const clampArrayLike = (length: number, index: number) =>
  (length + (index % length)) % length;

const clampLooped = (
  overflow: Overflow,
  value: number,
  max: number,
  min: number,
) => {
  if (overflow === 0) {
    return value;
  }
  const length = max - min;
  const offsetAboveZero = clampArrayLike(length, value);
  return min + offsetAboveZero;
};

const clampLinear = (
  overflow: Overflow,
  value: number,
  max: number,
  min: number,
) => {
  switch (overflow) {
    case 1:
      return max;
    case -1:
      return min;
    case 0:
      return value;
  }
};

export const clamp = (
  value: number,
  params: {
    max: number;
    min?: number;
    isLooped?: boolean;
    testBounds?: typeof inBoundsExEx;
  },
) => {
  const isLooped = params.isLooped || params.isLooped == null;
  const testBounds = params.testBounds || bounds.array;
  const overflow = testBounds(value, params.max, params.min);
  const result = isLooped
    ? clampLooped(overflow, value, params.max, params.min || 0)
    : clampLinear(overflow, value, params.max, params.min || 0);
  return result;
};
