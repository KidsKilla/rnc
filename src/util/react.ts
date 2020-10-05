import React from 'react';
import { Platform, ScrollView } from 'react-native';

type Ref<T = unknown> =
  | ((instance: T | null) => void)
  | React.MutableRefObject<T | null>
  | null;

export const updateRef = <T>(ref: Ref<T>, api: T) => {
  if (typeof ref === 'function') {
    ref(api);
  } else if (ref) {
    ref.current = api;
  }
};

export const usePrevious = <T>(value: T) => {
  const ref = React.useRef<T>();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

interface ScrollArgs {
  x: number;
  animated?: boolean;
}
interface Scrollabe {
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

export const useDebounce = (time: number = 1000) => {
  const tmr = React.useRef<unknown>();
  return (callback: () => unknown, iterTime?: number) => {
    clearTimeout(tmr.current as number);
    tmr.current = setTimeout(callback, iterTime || time);
  };
};
