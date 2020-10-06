import React from 'react';
import { NativeScrollEvent, ScrollView } from 'react-native';
import { usePrevious, useDebounce } from '../util/react';
import { clamp } from '../util/lib';
import {
  createItems,
  getComputable,
  getInitialState,
  State,
} from './Carousel3.util';

export const useCarousel3 = (props: useCarousel3.Props) => {
  const isLooped = props.isLooped == null ? true : Boolean(props.isLooped);
  const totalLength = props.totalLength || 1;
  const requestPlace = React.useRef<number>();

  const clampIndex = (n: number) =>
    clamp(n, {
      max: totalLength,
      isLooped,
    });
  const initIndex = clampIndex(props.initialIndex || 0);
  const [STATE, replaceState] = React.useState(() =>
    getInitialState(initIndex),
  );
  const VARS = getComputable(clampIndex, STATE);
  const updateState = (newValues: Partial<State>) => {
    replaceState((prevState) => ({
      ...prevState,
      ...newValues,
      counter: STATE.counter + 1,
    }));
  };

  const updateCurrentPage = (index: number) => {
    if (index === STATE.currentIndex) {
      return;
    }
    props.onChangePage?.(index);
    // console.log('🟢 updateCurrentPage <==', `(${index})`);
    requestPlace.current = VARS.zeroPoint;
    updateState({
      currentIndex: index,
      nativeEvent: null,
      requestedIndex: null,
    });
  };

  // Callback: offset change
  const onScroll = React.useCallback((event: rn.ScrollEvent) => {
    // const x = event.nativeEvent.contentOffset.x;
    if (requestPlace.current == null) {
      // console.log('🔹 onScroll b', x);
      updateState({
        nativeEvent: event.nativeEvent,
      });
      // console.log('🔹 onScroll a', x);
      return;
    }
    // console.log('🔳 requestPlace.current', requestPlace.current, x);
    requestPlace.current = undefined;
    return;
  }, []);

  // Callback: get size
  const onLayout = React.useCallback<rn.OnLayout>((event) => {
    const { width, height } = event.nativeEvent.layout;
    // console.log('🔸 onLayout');
    updateState({
      width: width,
      height: height,
    });
  }, []);

  // Effect: content change
  React.useEffect(() => {
    if (STATE.currentIndex >= totalLength) {
      updateCurrentPage(totalLength - 1);
    }
  }, [totalLength]);

  // Effect: width
  React.useEffect(() => {
    props.scrollTo({
      x: VARS.zeroPoint,
      index: STATE.currentIndex,
      itemIndex: 2,
      animated: false,
    });
  }, [STATE.width]);

  // Effect: animateToPage
  const prevIndex = usePrevious(STATE.requestedIndex);
  React.useEffect(() => {
    if (STATE.requestedIndex == null || prevIndex === STATE.requestedIndex) {
      return;
    }
    const multiplier = STATE.requestedIndex > STATE.currentIndex ? 1 : -1;
    props.scrollTo({
      x: VARS.zeroPoint + STATE.width * multiplier,
      index: clampIndex(STATE.currentIndex + multiplier),
      itemIndex: 2 + multiplier,
      animated: true,
    });
  }, [STATE.requestedIndex]);

  // Effect: reset position
  React.useLayoutEffect(() => {
    if (requestPlace.current) {
      props.scrollTo({
        x: requestPlace.current,
        index: STATE.currentIndex,
        itemIndex: 2,
        animated: false,
      });
    }
  }, [requestPlace.current]);

  // Effect: scroll
  const callLater = useDebounce(50);
  React.useEffect(() => {
    if (!STATE.nativeEvent) {
      return;
    }
    if (VARS.isScrollOffBounds) {
      // console.log('☑️ vars.isScrollOffBounds', VARS.isScrollOffBounds);
      callLater(() => {
        updateCurrentPage(VARS.nextIndex);
      });
    } else {
      props.onScroll?.({
        currentIndex: STATE.currentIndex,
        nextIndex: VARS.nextIndex,
        progress: VARS.progress,
        progressPx: VARS.progressPx,
        nativeEvent: STATE.nativeEvent,
      });
    }
  }, [STATE.nativeEvent]);

  const animateToPage = React.useCallback(
    (index: number) => {
      const clampedIndex = clampIndex(index);
      if (STATE.currentIndex !== clampedIndex) {
        updateState({
          requestedIndex: clampedIndex,
        });
      }
    },
    [totalLength, isLooped, STATE.currentIndex],
  );

  const items = createItems({
    totalLength,
    currentIndex: STATE.currentIndex,
    isLooped,
    requestedIndex: STATE.requestedIndex,
  });

  return {
    id: STATE.counter,
    offsetX: requestPlace.current,
    isLooped,
    items,
    width: STATE.width,
    height: STATE.height,
    currentIndex: STATE.currentIndex,
    nextIndex: VARS.nextIndex,
    progress: VARS.progress,
    progressPx: VARS.progressPx,
    // method
    animateToPage,
    onLayout,
    onScroll,
    // debug
    debug: {
      items,
      isLooped,
      totalLength,
      state: STATE,
      vars: VARS,
    },
  };
};

namespace rn {
  export type ScrollEvent = {
    nativeEvent: NativeScrollEvent;
  };
  export type OnLayout = NonNullable<ScrollView['props']['onLayout']>;
  export type OnScroll = (e: rn.ScrollEvent) => void;
}

export namespace useCarousel3 {
  export interface ScrollEvent {
    currentIndex: number;
    nextIndex: number;
    progress: number;
    progressPx: number;
    nativeEvent: NativeScrollEvent;
  }
  export type Item = ReturnType<typeof createItems>[0];
  export type Props = {
    totalLength: number;
    initialIndex?: number;
    isLooped?: boolean;
    onChangePage?: (index: number) => void;
    onScroll?: (event: ScrollEvent) => void;
    scrollTo: (props: {
      x: number;
      index: number;
      itemIndex: number;
      animated: boolean;
    }) => void;
  };
}
