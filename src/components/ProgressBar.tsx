import React from 'react';
import { StyleSheet, View } from 'react-native';

interface IProps {
  value: number;
  max: number;
}

export default function ProgressBar({ value, max }: IProps) {
  return (
    <View style={styles.outer}>
      <View style={StyleSheet.flatten([styles.inner, { width: `${(value / max) * 100}%` }])} />
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderWidth: 2,
    borderColor: '#000',
    borderStyle: 'solid',
    borderRadius: 8,
    flexGrow: 1,
    display: 'flex',
    padding: 2,
    height: 32,
    width: 100,
  },
  inner: {
    height: '100%',
    backgroundColor: '#33aa22',
    borderRadius: 5,
  },
});
