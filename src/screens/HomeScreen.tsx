import React from 'react';

import { Button, Heading, VStack, SimpleGrid, Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Colors from '../data/Colours.json';
import { StyleSheet } from 'react-native';
import contrastColor from 'font-color-contrast';

interface Props {
  navigation: any;
}

export default function HomeScreen({ navigation }: Props) {
  function startQuiz(quizType: 'addition' | 'subtraction' | 'multiplication' | 'division') {
    navigation.navigate('Quiz', { quizType });
  }

  return (
    <VStack alignItems="center" justifyContent="center" style={styles.root} space={16}>
      <Heading fontSize={'3xl'} color={contrastColor(Colors.pastelBlue)}>
        Start learning!
      </Heading>

      <SimpleGrid columns={2} space={10} alignItems="center" justifyContent="center">
        <Button style={styles.add} onPress={() => startQuiz('addition')}>
          <VStack alignItems="center" space={2}>
            <Icon color={contrastColor(Colors.addition)} name="plus" size={24} />
            <Text fontSize={'xl'} color={contrastColor(Colors.addition)}>
              Addition
            </Text>
          </VStack>
        </Button>

        <Button style={styles.subtract} onPress={() => startQuiz('subtraction')}>
          <VStack alignItems="center" space={2}>
            <Icon color={contrastColor(Colors.subtraction)} name="minus" size={24} />
            <Text fontSize={'xl'} color={contrastColor(Colors.subtraction)}>
              Subtraction
            </Text>
          </VStack>
        </Button>

        <Button style={styles.mult} onPress={() => startQuiz('multiplication')}>
          <VStack alignItems="center" space={2}>
            <Icon color={contrastColor(Colors.multiplication)} name="times" size={24} />
            <Text fontSize={'xl'} color={contrastColor(Colors.multiplication)}>
              Multiplication
            </Text>
          </VStack>
        </Button>

        <Button style={styles.div} onPress={() => startQuiz('division')}>
          <VStack alignItems="center" space={2}>
            <Icon color={contrastColor(Colors.division)} name="divide" size={24} />
            <Text fontSize={'xl'} color={contrastColor(Colors.division)}>
              Division
            </Text>
          </VStack>
        </Button>
      </SimpleGrid>
    </VStack>
  );
}

const buttonStyles = {
  width: 150,
  height: 150,
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.pastelBlue,
    flex: 1,
  },
  heading: { color: '#000' },
  add: {
    ...buttonStyles,
    backgroundColor: Colors.addition,
  },
  subtract: {
    ...buttonStyles,
    backgroundColor: Colors.subtraction,
  },
  mult: {
    ...buttonStyles,
    backgroundColor: Colors.multiplication,
  },
  div: {
    ...buttonStyles,
    backgroundColor: Colors.division,
  },
});
