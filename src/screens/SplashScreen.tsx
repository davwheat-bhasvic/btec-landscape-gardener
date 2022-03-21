import React from 'react';

import { Button, Heading, useToken, VStack } from 'native-base';
import { StyleSheet } from 'react-native';
import Colors from '../data/Colours.json';
import contrastColor from 'font-color-contrast';

import { StackActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface Props {
  navigation: any;
}

export default function SplashScreen({ navigation }: Props) {
  const [primaryColor] = useToken('colors', ['primary']);

  return (
    <VStack alignItems="center" justifyContent="center" style={styles.root} space={16}>
      <Heading style={styles.heading} fontSize={'5xl'}>
        MathsApp
      </Heading>
      <Button
        leftIcon={<Icon size={24} color={contrastColor(primaryColor)} name="play" />}
        size={200}
        _text={{ fontSize: 24 }}
        onPress={() => {
          navigation.dispatch(StackActions.replace('Home'));
        }}
      >
        PLAY
      </Button>
    </VStack>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.pastelBlue,
    flex: 1,
  },
  heading: {
    color: contrastColor(Colors.pastelBlue),
  },
});
