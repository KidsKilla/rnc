import { clampArrayLike } from './lib';
export const getTransitionByScrollPosition = (input: {
  loop: boolean;
  index: number;
  length: number;
  itemPosition: number;
  itemSize: number;
}) => {
  const totalSize = input.length * input.itemSize;
  const relativeCoord = input.itemPosition / totalSize;
  const absCoord = relativeCoord * input.length;
  const isReverse = absCoord < input.index;

  let clampedCoord = NaN;
  let prevIndex = NaN;
  let nextIndex = NaN;
  let offset = 0;

  if (input.loop) {
    clampedCoord = clampArrayLike(input.length, absCoord);
  } else {
    clampedCoord = absCoord;
    if (absCoord < 0) {
      clampedCoord = 0;
    } else if (absCoord > input.length - 1) {
      clampedCoord = input.length - 1;
    }
  }

  const biggerIndex = Math.ceil(clampedCoord) % input.length;
  const smallerIndex = Math.floor(clampedCoord);
  const coordTail = Math.abs(clampedCoord) % 1;

  if (isReverse) {
    prevIndex = biggerIndex;
    nextIndex = smallerIndex;
    offset = 1 - coordTail;
  } else {
    prevIndex = smallerIndex;
    nextIndex = biggerIndex;
    offset = coordTail;
  }

  if (prevIndex === nextIndex) {
    offset = 0;
  }

  return {
    nextIndex,
    prevIndex,
    offset,
    coord: absCoord,
    debug: {
      isReverse,
      input,
      totalSize,
      relativeCoord,
      absCoord,
      clampedCoord,
      prevIndex,
      nextIndex,
      offset,
    },
  };
};
