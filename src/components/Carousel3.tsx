import React from 'react';
import { Text, View, ScrollView, FlatList } from 'react-native';
import { updateRef, usePrevious } from '../util/react';
import { useCarousel3 } from './useCarousel3';
import { scrollToWithFix } from './Carousel3.util';
// import { FlatList } from 'react-native-gesture-handler';

const renderCarousel3 = (
  props: Carousel3.Props,
  ref?: React.Ref<Carousel3.API>,
) => {
  const debug = props.debug;
  const children = React.Children.toArray(props.children);
  // const fl = React.useRef<FlatList<useCarousel3.Item>>(null);
  const sv = React.useRef<ScrollView>(null);
  const scrollTo: useCarousel3.Props['scrollTo'] = (props) => {
    if (sv.current) {
      scrollToWithFix(sv.current, {
        x: props.x,
        animated: props.animated,
      });
    }
    // if (fl.current) {
    //   fl.current.scrollToOffset({
    //     offset: props.x,
    //     animated: props.animated,
    //   });
    // }
  };
  const carouselAPI = useCarousel3({
    totalLength: children.length,
    initialIndex: props.currentPage,
    isLooped: props.isLooped,
    onChangePage: props.onChangePage,
    onScroll: props.onScroll,
    scrollTo,
  });

  // On currentPage prop change
  const prevPageProp = usePrevious(props.currentPage);
  React.useEffect(() => {
    if (props.currentPage != null && prevPageProp !== props.currentPage) {
      carouselAPI.animateToPage(props.currentPage);
    }
  }, [props.currentPage, carouselAPI.animateToPage]);

  // Publish API in ref
  if (ref) {
    updateRef(ref, {
      animateToPage: carouselAPI.animateToPage,
      state: carouselAPI,
    });
  }
  const idx = carouselAPI.items.map((it) => it.index).join(',');
  // const keys = carouselAPI.items.map((it) => it.key).join(',');

  const renderItem = (item: typeof carouselAPI.items[0], i: number) => (
    <View
      key={item.key}
      style={{
        flexDirection: 'column',
        width: carouselAPI.width,
        height: carouselAPI.height,
      }}
    >
      {children[item.index]}
      {debug && (
        <>
          <Text style={{ fontSize: 36, alignSelf: 'center' }}>
            {item.index}
          </Text>
          <Text style={{ fontSize: 10, alignSelf: 'center' }}>
            {i - Math.floor(carouselAPI.items.length)}
          </Text>
        </>
      )}
    </View>
  );
  // console.log('C3', idx, carouselAPI.progress);
  return (
    <View onLayout={carouselAPI.onLayout}>
      {/* <FlatList
        ref={fl}
        onMomentumScrollEnd={carouselAPI.onScroll}
        data={carouselAPI.items}
        renderItem={({ item, index }) => renderItem(item, index)}
        directionalLockEnabled={true}
        decelerationRate={'fast'}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        style={props.style}
        contentContainerStyle={[
          props.contentContainerStyle,
          {
            position: 'absolute',
            width: carouselAPI.width * carouselAPI.items.length,
          },
        ]}
      /> */}

      <ScrollView
        ref={sv}
        onLayout={carouselAPI.onLayout}
        // onMomentumScrollEnd={carouselAPI.onScroll}
        onScroll={carouselAPI.onScroll}
        bounces={!carouselAPI.isLooped}
        directionalLockEnabled={true}
        decelerationRate={'normal'}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        style={[props.style]}
        contentContainerStyle={[
          props.contentContainerStyle,
          {
            position: 'absolute',
            width: carouselAPI.width * carouselAPI.items.length,
            height: carouselAPI.height,
          },
        ]}
      >
        {carouselAPI.items.map(renderItem)}
      </ScrollView>

      {debug && (
        <Text style={{ borderWidth: 1 }}>
          Debug:
          {JSON.stringify(
            {
              p: carouselAPI.progress,
              px: carouselAPI.progressPx,
              w: carouselAPI.width,
              idx,
              // debug: carouselAPI.debug,
            },
            null,
            2,
          )}
        </Text>
      )}
    </View>
  );
};

export const Carousel3 = React.forwardRef(renderCarousel3);

export namespace Carousel3 {
  export interface API {
    animateToPage: (page: number) => void;
    state: ReturnType<typeof useCarousel3>;
  }
  export interface Props {
    children: React.ReactNode[];
    // children: (dataItem: ItemType, index: number) => JSX.Element;
    style?: View['props']['style'];
    pageStyle?: View['props']['style'];
    contentContainerStyle?: View['props']['style'];
    //
    currentPage?: useCarousel3.Props['initialIndex'];
    isLooped?: useCarousel3.Props['isLooped'];
    onChangePage?: useCarousel3.Props['onChangePage'];
    onScroll?: useCarousel3.Props['onScroll'];
    debug?: boolean;
  }
}
