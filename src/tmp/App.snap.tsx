import React from 'react';
import { StyleSheet, Pressable, View, Text, Image } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { DISHES } from '../data/dishes';
import { createSubsetsManager } from '../util/subsets';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    backfaceVisibility: 'visible',
    color: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerHorizontal: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    width: '100%',
  },
  img: {
    width: 300,
    height: 200,
  },
  pane: {
    backgroundColor: 'blue',
    height: 200,
  },
  paginator: {
    marginVertical: 20,
    height: 20,
  },
  center: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export function App() {
  const carousel = React.useRef<Carousel<unknown>>(null);
  const [currentImageIndex, setImageIndex] = React.useState(0);
  const carouselUtils = React.useMemo(() => createSubsetsManager(DISHES), [
    DISHES,
  ]);

  const subset = carouselUtils.getSubsetByIndex(currentImageIndex);
  console.log('subset', currentImageIndex, subset);

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        {carouselUtils.keys.map((key) => (
          <Pressable
            key={key}
            onPress={() => {
              const index = carouselUtils.getStartIndexByKey(key);
              const { current } = carousel;
              if (current) {
                current.snapToItem(index);
              }
              setImageIndex(index);
            }}
          >
            <View>
              <Text>{key}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.pane}>
        <Carousel
          ref={carousel}
          windowSize={1}
          data={carouselUtils.allItems}
          renderItem={({ item: image }) => (
            <View key={image.toString()} style={styles.containerHorizontal}>
              <Image
                style={styles.img}
                source={image}
                resizeMethod="scale"
                resizeMode="contain"
              />
            </View>
          )}
          pagingEnabled={false}
          onSnapToItem={setImageIndex}
          // onScroll={(e) => console.log('onScroll', e.nativeEvent)}
        />

        <View>
          <Pagination
            dotsLength={subset.length}
            activeDotIndex={subset.index}
          />
        </View>
      </View>
      <Text>after</Text>
    </View>
  );
}
