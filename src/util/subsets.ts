import { clamp } from './lib';
export type CarouselMap<T = unknown> = Record<string, T[]>;

const reduceNums = (nums: number[]) => nums.reduce((memo, n) => memo + n, 0);

export const createSubsetsManager = <T>(carouselMap: CarouselMap<T>) => {
  const keys = Object.keys(carouselMap);
  const lengths = keys.map((k) => carouselMap[k].length);
  const totalLength = reduceNums(lengths);
  const allItems = keys.reduce(
    (memo, k) => memo.concat(carouselMap[k]),
    [] as T[],
  );

  const getStartIndexByKey = (key: string) => {
    const keyIndex = keys.findIndex((k) => k === key);
    const globalIndex =
      keyIndex === -1 ? 0 : reduceNums(lengths.slice(0, keyIndex));
    // console.log(key, globalIndex);
    return globalIndex;
  };

  const getSubsetByIndex = (globalIndex: number) => {
    let startIndex = 0;
    let subsetIndex = clamp(globalIndex, { max: totalLength });
    const keyIndex = lengths.findIndex((subsetLength) => {
      if (subsetIndex < subsetLength) {
        return true;
      }
      startIndex += subsetLength;
      subsetIndex -= subsetLength;
      return false;
    });

    const key = keys[keyIndex];
    return {
      key,
      keyIndex,
      index: subsetIndex,
      length: carouselMap[key].length,
      startIndex,
    };
  };

  return {
    keys,
    totalLength,
    allItems,
    getSubsetByIndex,
    getStartIndexByKey,
  };
};
