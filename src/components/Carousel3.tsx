import React from 'react';
import { Text, ScrollView, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { updateRef, usePrevious } from '../util/react';
import { useCarousel3 } from './useCarousel3';

const renderCarousel3 = (
  props: Carousel3.Props,
  ref?: React.Ref<Carousel3.API>,
) => {
  const debug = false;
  const children = React.Children.toArray(props.children);
  const carouselAPI = useCarousel3({
    totalLength: children.length,
    initialIndex: props.currentPage,
    isLooped: props.isLooped,
    onChangePage: props.onChangePage,
    onScroll: props.onScroll,
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
  return (
    <View onLayout={carouselAPI.onLayout}>
      <ScrollView
        ref={carouselAPI.scrollViewRef}
        onScroll={carouselAPI.onScroll}
        bounces={!carouselAPI.isLooped}
        onScrollAnimationEnd={() => console.log('onScrollAnimationEnd')}
        onMomentumScrollEnd={() => console.log('onMomentumScrollEnd')}
        onScrollEndDrag={() => console.log('onScrollEndDrag')}
        onResponderEnd={() => console.log('onResponderEnd')}
        onTouchEnd={() => console.log('onTouchEnd')}
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
      >
        {carouselAPI.items.map((item, i) => (
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
                  {(i = Math.floor(carouselAPI.items.length))}
                </Text>
              </>
            )}
          </View>
        ))}
      </ScrollView>

      {debug && (
        <Text style={{ borderWidth: 1 }}>
          Debug:
          {JSON.stringify(
            {
              i: carouselAPI.items.map((it) => it.index).join(','),
              keys: carouselAPI.items.map((it) => it.key).join(','),
              debug: carouselAPI.debug,
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
