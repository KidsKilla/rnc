import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';

export const Titles: React.FC<Titles.Props> = (props) => {
  return (
    <View style={styles.container}>
      {props.keys.map((key) => (
        <TouchableOpacity
          key={key}
          onPress={() => props.onPress(key)}
          style={styles.titleItem}
        >
          <View>
            <Text
              style={[
                key === props.currentKey
                  ? styles.activeItem
                  : styles.inactiveItem,
              ]}
            >
              {key}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export namespace Titles {
  export interface Props {
    keys: string[];
    currentKey: string;
    onPress: (key: string) => void;
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  titleItem: {
    marginRight: 5,
  },
  inactiveItem: {
    opacity: 0.8,
  },
  activeItem: {
    opacity: 1,
  },
});
