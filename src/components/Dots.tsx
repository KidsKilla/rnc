import React from 'react';
import { View, StyleSheet } from 'react-native';

export const Dots = (props: {
  length: number | undefined;
  index: number | undefined;
  color?: string;
}) => (
  <View style={styles.container}>
    <View style={styles.wrapper}>
      {new Array(props.length).fill(undefined).map((_, i) => {
        const isCurrent = i === props.index;
        return (
          <View
            key={`${i}`}
            style={[
              isCurrent ? styles.activeDot : styles.inactiveDot,
              props.color ? { backgroundColor: props.color } : undefined,
            ]}
          />
        );
      })}
    </View>
  </View>
);

const styles = StyleSheet.create({
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: -4,
    margin: 4,
    backgroundColor: '#000',
  },
  inactiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: -3,
    margin: 4,
    opacity: 0.5,
    backgroundColor: '#000',
  },
  wrapper: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginTop: 4,
  },
  container: {
    height: 8,
  },
});
