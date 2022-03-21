import React, { useEffect, useState } from 'react';

import { Button, Heading, VStack, Text } from 'native-base';
import { useRecoilState } from 'recoil';
import { recordsAtom, timerAtom } from '../atoms/GlobalStateAtom';
import Colors from '../data/Colours.json';
import { StyleSheet } from 'react-native';
import { colord } from 'colord';
import fontColorContrast from 'font-color-contrast';
import { Quiz } from './QuizScreen';
import { StackActions } from '@react-navigation/routers';

import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';

dayjs.extend(dayjsDuration);

interface IProps {
  route: { params: { quizDetails: Quiz } };
  navigation: any;
}

export type ResultsScreenProps = Omit<IProps, 'navigation'>;

export default function ResultsScreen({
  navigation,
  route: {
    params: { quizDetails },
  },
}: IProps) {
  const quizType = quizDetails.quizType;

  const bgColor = colord(Colors[quizType]).desaturate(0.6).toRgbString();
  const bgTextColor = fontColorContrast(bgColor);
  const fgColor = Colors[quizType];
  const fgTextColor = fontColorContrast(fgColor);

  const [timerState, setTimerState] = useRecoilState(timerAtom);
  const [recordsState, setRecordsState] = useRecoilState(recordsAtom);
  const [newRecord, setNewRecord] = useState(false);

  const correctCount = quizDetails.responses.reduce((acc, curr) => {
    return curr.correct ? acc + 1 : acc;
  }, 0);

  const totalCount = quizDetails.questions.length;

  const mins = Math.floor(timerState.milliseconds / 1000 / 60);
  const secs = Math.floor(timerState.milliseconds / 1000) % 60;

  const hasRecordTime = recordsState[quizType] !== null;
  const recordMins = hasRecordTime ? Math.floor(recordsState[quizType]! / 1000 / 60) : null;
  const recordSecs = hasRecordTime ? Math.floor(recordsState[quizType]! / 1000) % 60 : null;

  let label = null;

  if (correctCount === totalCount || newRecord) {
    if (newRecord || !hasRecordTime || (hasRecordTime && timerState.milliseconds < recordsState[quizType]!)) {
      label = (
        <Text bold fontSize={'xl'} color={fgTextColor} textAlign="center">
          You set a new record time for this quiz!
        </Text>
      );
    } else {
      label = (
        <Text fontSize={'xl'} color={fgTextColor} textAlign="center">
          You were slower than your previous record time of {recordMins}m {recordSecs}s.
        </Text>
      );
    }
  } else {
    label = (
      <Text fontSize={'xl'} color={fgTextColor} textAlign="center">
        You didn't set a new time record because you didn't get all questions correct.
      </Text>
    );
  }

  useEffect(() => {
    if (!newRecord && correctCount === totalCount && (!hasRecordTime || (hasRecordTime && timerState.milliseconds < recordsState[quizType]!))) {
      setRecordsState((s) => ({ ...s, [quizType]: timerState.milliseconds }));
      setNewRecord(true);
    }
  }, [newRecord, hasRecordTime, recordsState, timerState, quizType, correctCount, totalCount, setRecordsState, setNewRecord]);

  return (
    <VStack backgroundColor={bgColor} style={styles.root} justifyContent="center" alignItems="center" space={16}>
      <VStack backgroundColor={fgColor} width="92.5%" mx="auto" py={8} px={4} space={4}>
        <Heading fontSize={'4xl'} color={fgTextColor} textAlign="center">
          Results
        </Heading>

        <Text fontSize={'xl'} color={fgTextColor} textAlign="center">
          You got {correctCount} out of {totalCount} question{totalCount !== 1 ? 's' : null} correct.
        </Text>

        <Text fontSize={'xl'} color={fgTextColor} textAlign="center">
          That quiz lasted {mins}m {secs}s.
        </Text>

        {label}

        <Text bold fontSize={'xl'} color={fgTextColor} textAlign="center">
          Great effort!
        </Text>
      </VStack>
      <Button
        width="85%"
        mx="auto"
        size="lg"
        _text={{ fontSize: 22 }}
        onPress={() => {
          setTimerState({ milliseconds: 0 });
          navigation.dispatch(StackActions.replace('Home'));
        }}
      >
        Go to home
      </Button>
    </VStack>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
