import React, { Component } from 'react';
import {
  Platform,
  Text,
  ScrollView,
  View,
  LayoutChangeEvent,
} from 'react-native';
import { CarouselProps, StateProps, ScrollEvent, ScrollTo } from './types';

/**
 * Animates pages in cycle
 * (loop possible if children count > 1)
 */
export class Carousel2 extends Component<CarouselProps, StateProps> {
  offset: number;
  nextPage: number;
  scrollView?: ScrollView | null;
  timer?: number;

  static defaultProps = {
    isLooped: true,
  };

  constructor(props: CarouselProps) {
    super(props);
    const childrenLength = React.Children.count(props.children) || 1;
    this.state = {
      currentPage: props.currentPage || 0,
      size: { width: 0, height: 0 },
      childrenLength,
      contents: [],
    };
    this.offset = 0;
    this.nextPage = 0;
  }

  // componentDidMount() {
  //   console.log(this.props);
  //   if (this.props.isLooped) {
  //     this._placeCritical(0);
  //     this._placeCritical(1);
  //     this._placeCritical(2);
  //     this.animateToPage(this.state.currentPage);
  //   }
  // }

  componentDidUpdate({ children }: CarouselProps) {
    if (this.props.children !== children) {
      const { currentPage } = this.state;
      let childrenLength = 0;
      if (children) {
        childrenLength = React.Children.count(children) || 1;
      }
      const nextPage =
        currentPage >= childrenLength ? childrenLength - 1 : currentPage;
      this.setState({ childrenLength }, () => {
        this.animateToPage(nextPage);
      });
    }
  }

  _setUpPages() {
    const { size } = this.state;
    const { children: propsChildren, isLooped, pageStyle } = this.props;
    const children = React.Children.toArray(propsChildren);
    const pages = [];

    if (children && children.length > 1) {
      // add all pages
      pages.push(...children);
      // We want to make infinite pages structure like this: 1-2-3-1-2
      // so we add first and second page again to the end
      if (isLooped) {
        pages.push(children[0]);
        pages.push(children[1]);
      }
    } else if (children) {
      pages.push(children[0]);
    } else {
      pages.push(
        <View>
          <Text>You are supposed to add children inside Carousel</Text>
        </View>,
      );
    }
    return pages.map((page, i) => (
      <View style={[{ ...size }, pageStyle]} key={`page${i}`}>
        {page}
      </View>
    ));
  }

  _setCurrentPage = (currentPage: number) => {
    this.setState({ currentPage }, () => {
      if (this.props.onAnimateNextPage) {
        // FIXME: called twice on ios with auto-scroll
        this.props.onAnimateNextPage(currentPage);
      }
    });
  };

  _onScrollEnd = (event: ScrollEvent) => {
    const offset = { ...event.nativeEvent.contentOffset };
    const page = this._calculateCurrentPage(offset.x);
    this._placeCritical(page);
    this._setCurrentPage(page);
  };

  _onScroll = (event: ScrollEvent) => {
    const currentOffset = event.nativeEvent.contentOffset.x;
    const direction = currentOffset > this.offset ? 'right' : 'left';
    this.offset = currentOffset;
    const nextPage = this._calculateNextPage(direction);
    if (this.nextPage !== nextPage) {
      this.nextPage = nextPage;
      if (this.props.onPageBeingChanged) {
        this.props.onPageBeingChanged(this.nextPage);
      }
    }
    if (this.props.onScroll) {
      this.props.onScroll(event);
    }
  };

  _onLayout = (event: LayoutChangeEvent) => {
    const { height, width } = event.nativeEvent.layout;
    this.setState({ size: { width, height } });
    this._placeCritical(this.state.currentPage as number);
  };

  _scrollTo = ({ offset, animated, nofix }: ScrollTo) => {
    if (this.scrollView) {
      this.scrollView.scrollTo({ y: 0, x: offset, animated });

      // Fix bug #50
      if (!nofix && Platform.OS === 'android' && !animated) {
        this.scrollView.scrollTo({ y: 0, x: offset, animated: true });
      }
    }
  };

  animateToPage = (page: number) => {
    const {
      currentPage,
      childrenLength,
      size: { width },
    } = this.state;
    const { isLooped } = this.props;
    const nextPage = this._normalizePageNumber(page);
    if (nextPage === currentPage) {
      // pass
    } else if (nextPage === 0) {
      if (isLooped) {
        // animate properly based on direction
        if (currentPage !== childrenLength - 1) {
          this._scrollTo({
            offset: (childrenLength + 2) * width,
            animated: false,
            nofix: true,
          });
        }
        this._scrollTo({ offset: childrenLength * width, animated: true });
      } else {
        this._scrollTo({ offset: 0, animated: true });
      }
    } else if (nextPage === 1) {
      // To properly animate from the first page we need to move view
      // to its original position first (not needed if not looped)
      if (currentPage === 0 && isLooped) {
        this._scrollTo({ offset: 0, animated: false, nofix: true });
      }
      this._scrollTo({ offset: width, animated: true });
    } else {
      // Last page is allowed to jump to the first through the "border"
      if (currentPage === 0 && nextPage !== childrenLength - 1) {
        this._scrollTo({ offset: 0, animated: false, nofix: true });
      }
      this._scrollTo({ offset: nextPage * width, animated: true });
    }
    this._setCurrentPage(nextPage);
  };

  _placeCritical = (page: number) => {
    const { isLooped } = this.props;
    const {
      childrenLength,
      size: { width },
    } = this.state;
    let offset = 0;
    // if page number is bigger then length - something is incorrect
    if (page < childrenLength) {
      if (page === 0 && isLooped) {
        // in "looped" scenario first page shold be placed after the last one
        offset = childrenLength * width;
      } else {
        offset = page * width;
      }
    }

    this._scrollTo({ offset, animated: false });
  };

  _normalizePageNumber = (page: number) => {
    const { childrenLength } = this.state;

    if (page === childrenLength) {
      return 0;
    } else if (page > childrenLength) {
      return 1;
    } else if (page < 0) {
      return childrenLength - 1;
    }
    return page;
  };

  _calculateCurrentPage = (offset: number) => {
    const { width } = this.state.size;
    const page = Math.round(offset / width);
    return this._normalizePageNumber(page);
  };

  _calculateNextPage = (direction: string) => {
    const { width } = this.state.size;
    const ratio = this.offset / width;
    const page = direction === 'right' ? Math.ceil(ratio) : Math.floor(ratio);
    return this._normalizePageNumber(page);
  };

  render() {
    const contents = this._setUpPages();

    const { size, childrenLength } = this.state;

    return (
      <View onLayout={this._onLayout} style={[this.props.style]}>
        <ScrollView
          ref={(c) => {
            this.scrollView = c;
          }}
          onMomentumScrollEnd={this._onScrollEnd}
          onScroll={this._onScroll}
          scrollEventThrottle={50}
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          contentInset={{ top: 0 }}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          horizontal
          pagingEnabled
          bounces={false}
          contentContainerStyle={[
            this.props.contentContainerStyle,
            {
              position: 'absolute',
              width:
                size.width *
                (childrenLength +
                  (childrenLength > 1 && this.props.isLooped ? 2 : 0)),
              height: size.height,
            },
          ]}
        >
          {contents}
        </ScrollView>
      </View>
    );
  }
}
