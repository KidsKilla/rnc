import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

type OnLayout = View['props']['onLayout'];
type OnMomentumScrollEnd = ScrollView['props']['onMomentumScrollEnd'];
interface PublicAPI {
  goToPage: (index: number) => void;
}

export interface SlideshowProps<T = unknown> {
  data: T[];
  children: (item: T, index: number) => React.ReactNode;
  onScroll?: ScrollView['props']['onScroll'];
  onScrollEnd?: (index: number) => void;
  style?: ViewStyle;
  apiRef?: React.MutableRefObject<PublicAPI | undefined>;
}

export const Slideshow = <T extends unknown>(props: SlideshowProps<T>) => {
  const [canvasWidth, setWindowWidth] = React.useState(0);
  const scrollViewRef = React.useRef<ScrollView>(null);

  const goToPage = React.useCallback(
    (index: number) => {
      const x = (index % props.data.length) * canvasWidth;
      console.log('goToPage', index, x);
      scrollViewRef.current?.scrollTo({
        x,
        animated: true,
      });
    },
    [scrollViewRef.current, canvasWidth, props.data.length],
  );

  const { apiRef } = props;
  if (apiRef) {
    apiRef.current = { goToPage };
  }

  const onLayout: OnLayout = React.useCallback(
    (e) => {
      setWindowWidth(e.nativeEvent.layout.width);
    },
    [setWindowWidth],
  );

  const onMomentumScrollEnd: OnMomentumScrollEnd = React.useCallback(
    (e) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / canvasWidth);
      props.onScrollEnd?.(index);
    },
    [props.onScrollEnd, canvasWidth],
  );

  return (
    <ScrollView
      onLayout={onLayout}
      style={[styles.canvas, props.style]}
      onMomentumScrollEnd={onMomentumScrollEnd}
      ref={scrollViewRef}
      scrollEventThrottle={50}
      pagingEnabled={true}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      onScroll={(e) => {
        props.onScroll?.(e);
      }}
    >
      {props.data.map((item, i) => (
        <View
          key={`${i}`}
          style={{ width: canvasWidth, alignContent: 'center' }}
        >
          {props.children(item, i)}
        </View>
      ))}
    </ScrollView>
  );
};

Slideshow.defaultProps = {
  data: [],
  renderDot: undefined,
};

const styles = StyleSheet.create({
  canvas: {
    borderWidth: 1,
    margin: 10,
  },
});
