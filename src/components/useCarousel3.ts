import React from 'react';
import { NativeScrollEvent, ScrollView } from 'react-native';
import {
  scrollToWithFix,
  usePrevious,
  useDebounce,
  Scrollabe,
} from '../util/react';
import { clamp } from '../util/lib';
import {
  createItems,
  getComputable,
  getInitialState,
  State,
} from './Carousel3.util';

export const useCarousel3 = (props: useCarousel3.Props) => {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const isLooped = props.isLooped == null ? true : Boolean(props.isLooped);
  const totalLength = props.totalLength || 1;
  const requestPlace = React.useRef<number>();

  const clampIndex = (n: number) =>
    clamp(n, {
      max: totalLength,
      isLooped,
    });
  const initIndex = clampIndex(props.initialIndex || 0);
  const [state, replaceState] = React.useState(() =>
    getInitialState(initIndex),
  );
  const vars = getComputable(clampIndex, state);
  const updateState = (newValues: Partial<State>) => {
    replaceState((prevState) => ({
      ...prevState,
      ...newValues,
      counter: state.counter + 1,
    }));
  };

  const updateCurrentPage = (index: number) => {
    if (index === state.currentIndex) {
      return;
    }
    props.onChangePage?.(index);
    console.log('🟢 updateCurrentPage <==', `(${index})`);
    requestPlace.current = vars.zeroPoint;
    placeAt(vars.zeroPoint);
    updateState({
      currentIndex: index,
      nativeEvent: null,
      requestedIndex: null,
    });
  };
  ////////////////////
  //
  // scrollTo
  const animateTo = (offset: number) => {
    if (scrollViewRef.current) {
      console.log('🟠 animateTo', offset);
      scrollToWithFix(scrollViewRef.current, {
        x: offset,
        animated: true,
      });
    }
  };
  const placeAt = (offset: number) => {
    if (scrollViewRef.current) {
      console.log('🟡 placeAt', offset);
      scrollToWithFix(scrollViewRef.current, {
        x: offset,
        animated: false,
      });
    }
  };

  // Callback: offset change
  const onScroll = React.useCallback((event: rn.ScrollEvent) => {
    const x = event.nativeEvent.contentOffset.x;
    if (requestPlace.current == null) {
      console.log('🔹 onScroll b', x);
      updateState({
        nativeEvent: event.nativeEvent,
      });
      console.log('🔹 onScroll a', x);
      return;
    }
    console.log('🔳 requestPlace.current', requestPlace.current, x);
    requestPlace.current = undefined;
    return;
  }, []);

  // Callback: get size
  const onLayout = React.useCallback<rn.OnLayout>((event) => {
    const { width, height } = event.nativeEvent.layout;
    console.log('🔸 onLayout');
    updateState({
      width: width,
      height: height,
    });
  }, []);

  // Effect: content change
  React.useEffect(() => {
    if (state.currentIndex >= totalLength) {
      updateCurrentPage(totalLength - 1);
    }
  }, [totalLength]);

  // Effect: width
  React.useEffect(() => {
    placeAt(vars.zeroPoint);
  }, [state.width]);

  // Effect: animateToPage
  const prevIndex = usePrevious(state.requestedIndex);
  React.useEffect(() => {
    if (state.requestedIndex == null || prevIndex === state.requestedIndex) {
      return;
    }
    const multiplier = state.requestedIndex > state.currentIndex ? 1 : -1;
    animateTo(vars.zeroPoint + state.width * multiplier);
  }, [state.requestedIndex]);

  // Effect: scroll
  const callLater = useDebounce(50);
  React.useEffect(() => {
    if (!state.nativeEvent) {
      return;
    }
    if (vars.isScrollOffBounds) {
      callLater(() => {
        updateCurrentPage(vars.nextIndex);
      });
    } else {
      props.onScroll?.({
        currentIndex: state.currentIndex,
        nextIndex: vars.nextIndex,
        progress: vars.progress,
        progressPx: vars.progressPx,
        nativeEvent: state.nativeEvent,
      });
    }
  }, [state.nativeEvent]);

  const animateToPage = React.useCallback(
    (index: number) => {
      const clampedIndex = clampIndex(index);
      if (state.currentIndex !== clampedIndex) {
        updateState({
          requestedIndex: clampedIndex,
        });
      }
    },
    [totalLength, isLooped, state.currentIndex],
  );

  const items = createItems({
    totalLength,
    currentIndex: state.currentIndex,
    isLooped,
    requestedIndex: state.requestedIndex,
  });

  return {
    id: state.counter,
    isLooped,
    items,
    width: state.width,
    height: state.height,
    currentIndex: state.currentIndex,
    nextIndex: vars.nextIndex,
    progress: vars.progress,
    progressPx: vars.progressPx,
    // method
    animateToPage,
    onLayout,
    onScroll,
    scrollViewRef,
    // debug
    debug: {
      items,
      isLooped,
      totalLength,
      state,
      vars,
    },
  };
};

namespace rn {
  export type OnLayout = NonNullable<ScrollView['props']['onLayout']>;
  export type OnScroll = NonNullable<ScrollView['props']['onScroll']>;
  export type ScrollEvent = {
    nativeEvent: NativeScrollEvent;
  };
}

export namespace useCarousel3 {
  export interface ScrollEvent {
    currentIndex: number;
    nextIndex: number;
    progress: number;
    progressPx: number;
    nativeEvent: NativeScrollEvent;
  }
  export type Props = {
    totalLength: number;
    initialIndex?: number;
    isLooped?: boolean;
    onChangePage?: (index: number) => void;
    onScroll?: (event: ScrollEvent) => void;
  };
}
