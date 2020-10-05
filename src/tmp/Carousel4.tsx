import React from 'react';
import { Text, ScrollView, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { updateRef, usePrevious } from '../util/react';
import { useCarousel3 } from './useCarousel3';

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

const renderCarousel3 = (
  props: Carousel3.Props,
  ref?: React.Ref<Carousel3.API>,
) => {
  const debug = false;
  const children = React.Children.toArray(props.children);
  return <FlatList ref={ref} data={} />;
};

export const Carousel3 = React.forwardRef(renderCarousel3);
