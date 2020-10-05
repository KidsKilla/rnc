import { getTransitionByScrollPosition } from './getTransitionByScrollPosition';

type Resp = ReturnType<typeof getTransitionByScrollPosition>;

const expectedResponse = (
  offset: number,
  nextIndex: number,
  prevIndex: number,
) => ({
  toMath: (res: Resp) => {
    // console.log('dbg:', res.debug);
    expect({
      offset: res.offset,
      nextIndex: res.nextIndex,
      prevIndex: res.prevIndex,
    }).toEqual({ offset, nextIndex, prevIndex });
  },
});

describe('getTransitionByScrollPosition', () => {
  describe('within range', () => {
    it('[  |->]', () => {
      const res = getTransitionByScrollPosition({
        index: 0,
        itemPosition: 4.5,
        itemSize: 3,
        length: 3,
        loop: false,
      });
      expectedResponse(0.5, 2, 1).toMath(res);
    });
    it('[<-|  ]', () => {
      const res = getTransitionByScrollPosition({
        index: 2,
        itemPosition: 3,
        itemSize: 2,
        length: 3,
        loop: false,
      });
      expectedResponse(0.5, 1, 2).toMath(res);
    });
    it('[  |  ]', () => {
      const res = getTransitionByScrollPosition({
        index: 1,
        itemPosition: 3,
        itemSize: 3,
        length: 3,
        loop: false,
      });
      expectedResponse(0, 1, 1).toMath(res);
    });
  });
  describe('loop: false', () => {
    it('<-[..]  ', () => {
      const res = getTransitionByScrollPosition({
        index: 0,
        itemPosition: -1,
        itemSize: 3,
        length: 2,
        loop: false,
      });
      expectedResponse(0, 0, 0).toMath(res);
    });
    it('  [..]->', () => {
      const res = getTransitionByScrollPosition({
        index: 0,
        itemPosition: 100,
        itemSize: 3,
        length: 3,
        loop: false,
      });
      expectedResponse(0, 2, 2).toMath(res);
    });
  });
  describe('loop: true', () => {
    it('<-[..]   x1', () => {
      const res = getTransitionByScrollPosition({
        index: 1,
        itemPosition: -1,
        itemSize: 2,
        length: 3,
        loop: true,
      });
      expectedResponse(0.5, 2, 0).toMath(res);
    });
    it('<-[..]   x2', () => {
      const res = getTransitionByScrollPosition({
        index: 1,
        itemPosition: -1 - 2 * 3,
        itemSize: 2,
        length: 3,
        loop: true,
      });
      expectedResponse(0.5, 2, 0).toMath(res);
    });
    it('  [..]-> x1', () => {
      const res = getTransitionByScrollPosition({
        index: 1,
        itemPosition: 3 * 2 + 1,
        itemSize: 2,
        length: 3,
        loop: true,
      });
      expectedResponse(0.5, 0, 2).toMath(res);
    });
    it('  [..]-> x2', () => {
      const res = getTransitionByScrollPosition({
        index: 1,
        itemPosition: 2 * 2 * 3 + 1,
        itemSize: 2,
        length: 3,
        loop: true,
      });
      expectedResponse(0.5, 0, 2).toMath(res);
    });
  });
});
