import React from 'react';
import { FlatList, NativeScrollEvent } from 'react-native';

export const InfiniteScroll = <T,>(
  props: FlatList['props'] & { offset: number },
) => {
  const [state, replaceState] = React.useState({
    data: props.data || [],
    end: true,
  });
  const setState = (partState: Partial<typeof state>) => {
    replaceState({
      ...state,
      ...partState,
    });
  };
  const infListRef = React.useRef<FlatList | null>(null);
  const length = state.data.length;
  const data = state.data.slice();

  const checkScroll = ({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    if (state.data.length >= length * 3) {
      setState({
        data: state.data.slice(length * 2),
      });
    }

    if (contentOffset.y <= props.offset) {
      setState({
        data: [...state.data, ...data],
      });
    }
    React.useEffect(() => {
      if (contentOffset.y <= props.offset) {
        infListRef.current?.scrollToIndex({ index: length, animated: false });
      }
    });

    if (
      layoutMeasurement.height + contentOffset.y >=
        contentSize.height - props.offset &&
      state.end
    ) {
      setState({
        data: [...state.data, ...data],
        end: false,
      });
    } else {
      setState({
        end: true,
      });
    }
  };
  React.useEffect(() => {
    setState({
      data: [...state.data, ...state.data],
    });
    setTimeout(() => {
      infListRef.current?.scrollToIndex({ animated: false, index: length });
    }, 500);
  });

  return (
    <FlatList
      {...props}
      ref={infListRef}
      data={state.data}
      renderItem={props.renderItem}
      onScroll={checkScroll}
      showsVerticalScrollIndicator={props.showsVerticalScrollIndicator}
    />
  );
};

// InfiniteScroll.propTypes = {
//     offset: PropTypes.number,
//     showsVerticalScrollIndicator: PropTypes.bool
// }

// InfiniteScroll.defaultProps = {
//     offset: 20,
//     showsVerticalScrollIndicator: false
// };
