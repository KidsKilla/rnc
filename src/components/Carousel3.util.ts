import { clamp } from '../util/lib';
import { NativeScrollEvent, Platform } from 'react-native';

export type State = ReturnType<typeof getInitialState>;
export const getInitialState = (initialIndex: number) => ({
  counter: 0,
  currentIndex: initialIndex,
  nativeEvent: null as NativeScrollEvent | null,
  requestedIndex: null as number | null,
  width: 0,
  height: 0,
  // requestPlace: null as number | null,
});

export const getComputable = (
  clampIndex: (n: number) => number,
  state: State,
) => {
  const zeroPoint = state.width * 2;
  const x = state.nativeEvent?.contentOffset.x;
  const offset = x == null ? zeroPoint : x;
  const maxOffset = zeroPoint + (state.width - 1);
  const minOffset = zeroPoint - (state.width - 1);
  const isScrollOffBounds = minOffset >= offset || offset >= maxOffset;

  const getIndexByOffset = (offset: number) => {
    if (state.requestedIndex != null) {
      return state.requestedIndex;
    }
    if (offset === zeroPoint) {
      return state.currentIndex;
    }
    const indexOffset = offset < zeroPoint ? -1 : 1;
    return clampIndex(state.currentIndex + indexOffset);
  };
  const nextIndex = getIndexByOffset(offset);

  const progressPx =
    offset < zeroPoint
      ? state.width - (offset % state.width)
      : offset % state.width;
  const progress = progressPx / state.width;

  return {
    nextIndex,
    isScrollOffBounds,
    offset,
    progressPx,
    progress,
    zeroPoint,
  };
};

type Items = ReturnType<typeof createItems>;
type Item = Items extends (infer T)[] ? T : never;

export const cloneTimes = (n: number, item: Item): Item[] =>
  new Array(n).fill(null).map((_, i) => ({
    key: i === 2 ? item.key : `ct${n}${i}`,
    index: item.index,
  }));

export const createItems = (params: {
  totalLength: number;
  currentIndex: number;
  isLooped: boolean;
  requestedIndex: number | null;
}) => {
  const clampIndex = (i: number) =>
    clamp(i, {
      max: params.totalLength,
      isLooped: params.isLooped,
    });
  const createItem = (index: number) => ({
    index,
    key: `${index}`,
  });
  const items = [-2, -1, 0, 1, 2].map((i) =>
    createItem(clampIndex(params.currentIndex + i)),
  );
  if (params.requestedIndex == null) {
    return items;
  }
  // Animate | ->
  if (params.requestedIndex > params.currentIndex) {
    items[3] = createItem(params.requestedIndex);
    items[4] = createItem(clampIndex(params.requestedIndex + 1));
    items[4].key = 'anim+1';
    items[0].key = 'anim-2';
    items[1].key = 'anim-1';
  }
  // Animate <- |
  if (params.requestedIndex < params.currentIndex) {
    items[1] = createItem(params.requestedIndex);
    items[0] = createItem(clampIndex(params.requestedIndex - 1));
    items[0].key = 'anim-2';
    items[4].key = 'anim+2';
    items[3].key = 'anim+1';
  }
  return items;
};

interface ScrollArgs {
  x: number;
  animated?: boolean;
}
export interface Scrollabe {
  scrollTo: (p: ScrollArgs) => void;
}
export const scrollToWithFix = (scrollView: Scrollabe, args: ScrollArgs) => {
  scrollView.scrollTo({
    x: args.x,
    animated: args.animated,
  });
  // Fix bug
  // https://github.com/phil-r/react-native-looped-carousel/issues/50
  if (Platform.OS === 'android' && !args.animated) {
    scrollView.scrollTo({ x: args.x, animated: true });
  }
};
