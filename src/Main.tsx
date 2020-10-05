import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';

import { DISHES } from './data/dishes';
import { createSubsetsManager } from './util/subsets';
import { getTransitColor, toRGB } from './util/color';
import { Titles } from './components/Titles';
import { Carousel3 } from './components/Carousel3';
import { DotsFade } from './components/DotsFade';

type OnScroll = NonNullable<Carousel3.Props['onScroll']>;
type OnChangePage = NonNullable<Carousel3.Props['onChangePage']>;
type OnPress = Titles.Props['onPress'];

export const Main = () => {
  const subsetsManager = React.useMemo(() => createSubsetsManager(DISHES), [
    DISHES,
  ]);
  const { allItems } = subsetsManager;
  const getItemColor = (index: number) => allItems[index].color;

  const [currentItemIndex, setCurrentItemIndex] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [nextIndex, setNextIndex] = React.useState<number>();

  // subsets
  const currentSubset = subsetsManager.getSubsetByIndex(currentItemIndex);
  const nextSubset =
    nextIndex != null ? subsetsManager.getSubsetByIndex(nextIndex) : null;
  // colors
  const currentItemColor = getItemColor(currentItemIndex);
  const transitColor =
    nextIndex != null
      ? getTransitColor(
          getItemColor(currentItemIndex),
          getItemColor(nextIndex),
          progress,
        )
      : currentItemColor;

  const ref = React.useRef<Carousel3.API>(null);
  const onScroll = React.useCallback<OnScroll>((e) => {
    setProgress(e.progress);
    setNextIndex(e.nextIndex);
  }, []);
  const onChangePage = React.useCallback<OnChangePage>((index) => {
    setCurrentItemIndex(index);
    setNextIndex(undefined);
  }, []);
  const onKeyPress = React.useCallback<OnPress>((key) => {
    const index = subsetsManager.getStartIndexByKey(key);
    ref.current?.animateToPage(index);
  }, []);
  console.log('🔘 Main', progress, nextIndex, toRGB(transitColor));
  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.contentWrapper}>
        <View
          style={[
            styles.titles,
            {
              backgroundColor: toRGB(transitColor),
            },
          ]}
        >
          <Titles
            keys={subsetsManager.keys}
            currentKey={currentSubset.key}
            onPress={onKeyPress}
          />
        </View>

        <View>
          <View
            style={[
              styles.colorStripe,
              {
                backgroundColor: toRGB(transitColor),
              },
            ]}
          />

          <Carousel3
            ref={ref}
            onScroll={onScroll}
            onChangePage={onChangePage}
            isLooped={true}
            // style={{ width: 300, height: 300 }}
            style={{ minHeight: 200 }}
          >
            {allItems.map((item) => (
              <View key={item.id} style={styles.item}>
                <Image
                  style={styles.img}
                  source={item.imageSrc}
                  resizeMethod="scale"
                  resizeMode="contain"
                />
              </View>
            ))}
          </Carousel3>
        </View>

        <DotsFade
          transitionOffset={
            nextSubset && currentSubset.key !== nextSubset.key ? progress : 0
          }
          length={currentSubset.length}
          index={currentSubset.index}
          nextLength={nextSubset?.length}
          nextIndex={nextSubset?.index}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: '#fff',
    color: '#000',
    margin: 0,
    marginTop: 100,
    justifyContent: 'flex-start',
    flex: 1,
  },
  contentWrapper: {
    justifyContent: 'flex-start',
    flex: 1,
  },
  titles: {
    padding: 10,
  },
  img: {
    width: 200,
    height: 200,
  },
  colorStripe: {
    position: 'absolute',
    right: 0,
    left: 0,
    borderColor: '#000',
    height: 140,
  },
  item: {
    alignSelf: 'center',
  },
});
