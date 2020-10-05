import React from 'react';
import {
  Text,
  View,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { usePrevious, updateRef, scrollToWithFix } from '../util/react';
import { clamp } from '../util/lib';

type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>;

export namespace Carousel {
  export interface API {
    animateToPage: (page: number) => void;
  }
  export interface Props {
    isLooped?: boolean;
    currentPage?: number;
    onChangePage?: (index: number) => void;
    onScroll?: ScrollView['props']['onScroll'];
    children: React.ReactNode;
    style?: View['props']['style'];
    pageStyle?: View['props']['style'];
    contentContainerStyle?: View['props']['style'];
  }
}

export const Carousel = React.forwardRef<Carousel.API, Carousel.Props>(
  (props, ref) => {
    const isLooped = props.isLooped == null ? true : Boolean(props.isLooped);
    const childrenLength = React.Children.count(props.children) || 1;
    const scrollViewRef = React.useRef<ScrollView>(null);

    const [offset, setOffset] = React.useState(0);
    const [itemSize, setSize] = React.useState({ width: 0, height: 0 });
    const [currentPage, setCurrentPage] = React.useState(
      props.currentPage || 0,
    );
    const scrollContainer = {
      total: itemSize.width * 3,
      start: itemSize.width,
      end: 0,
    };
    const loopOffset = (x: number) => {
      const offset = clamp(x, {
        isLooped,
        min: scrollContainer.end,
        max: scrollContainer.start,
      });
      if (offset !== x) {
        console.log(`offset: ${x} => ${offset}`);
        scrollTo({
          offset,
          animated: false,
        });
      }
      return offset;
    };

    const updateCurrentPage = React.useCallback(
      (pageNum: number) => {
        const clampedPageNum = clamp(pageNum, {
          max: childrenLength,
          isLooped,
        });
        console.log(`page: ${pageNum} => ${clampedPageNum}`);
        setCurrentPage(clampedPageNum);
      },
      [childrenLength],
    );

    React.useCallback(() => {
      if (currentPage >= childrenLength) {
        setCurrentPage(childrenLength - 1);
      }
    }, [childrenLength]);

    const scrollTo = React.useCallback(
      (args: { offset: number; animated: boolean; nofix?: boolean }) => {
        if (scrollViewRef.current) {
          scrollToWithFix(scrollViewRef.current, {
            x: args.offset,
            animated: args.animated,
          });
        }
      },
      [scrollViewRef.current],
    );

    // On currentPage prop change
    const prevPageProp = usePrevious(props.currentPage);
    React.useEffect(() => {
      if (props.currentPage != null && prevPageProp !== props.currentPage) {
        updateCurrentPage(props.currentPage);
      }
    }, [props.currentPage, updateCurrentPage]);

    // onScroll
    const onScroll = React.useCallback(
      (event: ScrollEvent) => {
        const newOffset = event.nativeEvent.contentOffset.x;
        setOffset(newOffset);
        props.onScroll?.(event);
      },
      [props.onScroll],
    );

    const fixOffset = React.useCallback(
      (event: ScrollEvent) => {
        loopOffset(event.nativeEvent.contentOffset.x);
      },
      [itemSize.width, childrenLength],
    );

    // onScrollEnd: set new page
    const onScrollEnd = React.useCallback(
      (event: ScrollEvent) => {
        const newOffset = loopOffset(event.nativeEvent.contentOffset.x);
        const pageNum = Math.round(newOffset / itemSize.width);
        updateCurrentPage(pageNum);
      },
      [updateCurrentPage, childrenLength, itemSize],
    );

    // onLayout: get size
    const onLayout = React.useCallback((event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      setSize({ width, height });
      loopOffset(0);
    }, []);

    // Setup Public API
    updateRef(ref, {
      animateToPage: updateCurrentPage,
    });

    // Width of all ScrollView children combined
    const children = React.Children.toArray(props.children);

    // const renderItem = (pos: number, text: string) => {
    //   const index = clamp(pos, {
    //     isLooped,
    //     max: childrenLength,
    //   });
    //   return (
    //     <View style={[itemSize]}>
    //       <Text>
    //         {text} i: {index}
    //       </Text>
    //       {children[index]}
    //     </View>
    //   );
    // };

    return (
      <View onLayout={onLayout} style={[props.style]}>
        <ScrollView
          ref={scrollViewRef}
          onMomentumScrollEnd={onScrollEnd}
          onScrollBeginDrag={fixOffset}
          onScrollEndDrag={fixOffset}
          onScroll={onScroll}
          directionalLockEnabled={true}
          decelerationRate="fast"
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={100}
          scrollToOverflowEnabled={true}
          bounces={!props.isLooped}
          contentContainerStyle={[
            props.contentContainerStyle,
            {
              position: 'absolute',
              width: scrollContainer.total,
              height: itemSize.height,
            },
          ]}
          snapToInterval={itemSize.width}
        >
          <View style={[itemSize, { marginLeft: -itemSize.width }]}>
            <Text>first i: {children.length - 1}</Text>
            {children[children.length - 1]}
          </View>
          {children.map((page, i) => (
            <View style={[itemSize]} key={`page:${i}`}>
              <Text>i: {i}</Text>
              {page}
            </View>
          ))}
          <View style={[itemSize]}>
            <Text>last i: {0}</Text>
            {children[0]}
          </View>
        </ScrollView>

        <Text style={{ borderWidth: 1 }}>
          offset: {offset}; currentPage: {currentPage}; childrenLength:{' '}
          {childrenLength};
        </Text>
      </View>
    );
  },
);
