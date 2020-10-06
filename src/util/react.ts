import React from 'react';

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

export const useDebounce = (time: number = 1000) => {
  const tmr = React.useRef<unknown>();
  return (callback: () => unknown, iterTime?: number) => {
    clearTimeout(tmr.current as number);
    tmr.current = setTimeout(callback, iterTime || time);
  };
};
