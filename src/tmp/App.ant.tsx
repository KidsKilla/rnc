import React from 'react';
import { StyleSheet, Pressable, View, Text, Image } from 'react-native';
import { Carousel, Pagination } from '@ant-design/react-native';
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
          infinite
          selectedIndex={currentImageIndex}
          dots={false}
          // onScroll={(e) => console.log('onScroll', e.nativeEvent)}
          afterChange={setImageIndex}
        >
          {carouselUtils.allItems.map((image) => (
            <View key={image.toString()} style={styles.containerHorizontal}>
              <Image
                style={styles.img}
                source={image}
                resizeMethod="scale"
                resizeMode="contain"
              />
            </View>
          ))}
        </Carousel>

        <View>
          <Pagination
            total={subset.length}
            current={subset.index}
            styles={{
              indicatorStyle: {
                backgroundColor: 'blue',
              },
              pointStyle: {
                backgroundColor: 'gray',
              },
              pointActiveStyle: {
                backgroundColor: 'red',
              },
            }}
          />
        </View>
      </View>
      <Text>after</Text>
    </View>
  );
}
