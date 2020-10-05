import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Dots } from './Dots';

export const DotsFade = (props: {
  transitionOffset: number;
  length: number;
  index: number;
  nextLength?: number;
  nextIndex?: number;
}) => (
  <View>
    <View
      style={[
        styles.dots,
        {
          opacity: 1 - props.transitionOffset,
        },
      ]}
    >
      <Dots length={props.length} index={props.index} color={'red'} />
    </View>
    {props.transitionOffset > 0 && (
      <View
        style={[
          styles.dots,
          {
            opacity: props.transitionOffset,
          },
        ]}
      >
        <Dots length={props.nextLength} index={props.nextIndex} color={'red'} />
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  dots: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
