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
        styles.absoluteCenter,
        {
          opacity: 1 - props.transitionOffset,
        },
      ]}
    >
      <Dots length={props.length} index={props.index} />
    </View>
    {props.transitionOffset > 0 && (
      <View
        style={[
          styles.absoluteCenter,
          {
            opacity: props.transitionOffset,
          },
        ]}
      >
        <Dots length={props.nextLength} index={props.nextIndex} />
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  absoluteCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
