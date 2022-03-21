import React, { useState } from 'react';

import { Button, Heading, VStack, Text, HStack, View, Input } from 'native-base';
import { StyleSheet } from 'react-native';
import { colord } from 'colord';
import fontColorContrast from 'font-color-contrast';
import { StackActions } from '@react-navigation/routers';
import Sound from 'react-native-sound';

import createQuiz from '../helpers/createQuiz';
import ProgressBar from '../components/ProgressBar';
import Colors from '../data/Colours.json';
import getPraiseMessage from '../helpers/getPraiseMessage';
import Timer from '../components/Timer';

interface IProps {
  route: { params: { quizType: 'addition' | 'subtraction' | 'multiplication' | 'division' } };
  navigation: any;
}

export type QuizScreenProps = Omit<IProps, 'navigation'>;

export interface Quiz {
  quizType: 'addition' | 'subtraction' | 'multiplication' | 'division';
  questions: Question[];
  responses: QuestionResponse[];
}

export interface Question {
  operand1: number;
  operand2: number;
  operator: '+' | '-' | '×' | '÷';
  answer: number;
}

export interface QuestionResponse {
  hasResponded: boolean;
  answer?: number;
  correct?: boolean;
}

export default function QuizScreen({
  navigation,
  route: {
    params: { quizType },
  },
}: IProps) {
  // Prevent going back without warning the user
  // React.useLayoutEffect(() => {
  //   if (navigation.canGoBack()) {
  //     navigation.setOptions({
  //       headerLeft: () => (
  //         <IconButton
  //           icon={<Icon name="arrow-left" size={24} />}
  //           onPress={() => {
  //             Alert.alert('Discard changes?', "Ending the quiz will make you lose all progress you've made so far!", [
  //               { text: 'Finish the quiz', style: 'cancel', onPress: () => {} },
  //               {
  //                 text: 'Lose my progress',
  //                 style: 'destructive',
  //                 // If the user confirmed, then we dispatch the action we blocked earlier
  //                 // This will continue the action that had triggered the removal of the screen
  //                 onPress: () => navigation.goBack(),
  //               },
  //             ]);
  //           }}
  //           title="Back"
  //           color="#fff"
  //         />
  //       ),
  //     });
  //   }
  // }, [navigation]);

  const [quizDetails, setQuizDetails] = useState<Quiz>(() => {
    const questions = createQuiz(quizType);

    return {
      quizType,
      questions,
      responses: questions.map(() => ({ hasResponded: false })),
    };
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [praiseMessage, setPraiseMessage] = useState<string | null>(null);

  const thisQuestion = quizDetails.questions[currentQuestion];
  const thisResponse = quizDetails.responses[currentQuestion];
  const answerSubmitted = thisResponse.hasResponded && !praiseMessage;

  function isAnswerValid(): boolean {
    if (answer === '') {
      return false;
    }

    if (!answer.match(/^-?[\d]*(\.[\d]+)?$/)) {
      return false;
    }

    return true;
  }

  const bgColor = colord(Colors[quizType]).desaturate(0.6).toRgbString();
  const bgTextColor = fontColorContrast(bgColor);
  const fgColor = Colors[quizType];
  const fgTextColor = fontColorContrast(fgColor);

  function handleAnswerSubmit() {
    if (!isAnswerValid()) return;

    const answerNum = parseFloat(answer);
    const correct = thisQuestion.answer === answerNum;

    setQuizDetails((state) => {
      const newState = { ...state };

      newState.responses[currentQuestion].answer = answerNum;
      newState.responses[currentQuestion].correct = correct;
      newState.responses[currentQuestion].hasResponded = true;

      return newState;
    });

    const sound = new Sound(correct ? 'correct.mp3' : 'incorrect.mp3', Sound.MAIN_BUNDLE, (err) => {
      if (err) {
        console.log(err);
        return;
      }

      sound.play();
    });
  }

  function handleNextQuestionPress() {
    if (!answerSubmitted) return;

    setAnswer('');

    const praise = getPraiseMessage(quizDetails);

    if (praise) {
      setPraiseMessage(praise);
      return;
    }

    goToNextQuestion();
  }

  function handlePraiseContinuePress() {
    setPraiseMessage(null);
    goToNextQuestion();
  }

  function goToNextQuestion() {
    if (currentQuestion + 1 === quizDetails.questions.length) {
      navigation.dispatch(StackActions.replace('Results', { quizDetails }));
    } else {
      setCurrentQuestion((state) => state + 1);
    }
  }

  return (
    <VStack backgroundColor={bgColor} style={styles.root}>
      <HStack space={4} padding={2}>
        <Timer shouldTick={!answerSubmitted && !praiseMessage} textColor={bgTextColor} />
        <ProgressBar value={currentQuestion + 1} max={quizDetails.questions.length + 1} />
        <Text color={bgTextColor} fontSize={20} bold>
          {currentQuestion + 1}/{quizDetails.questions.length}
        </Text>
      </HStack>

      <View flex={1} />

      {praiseMessage && (
        <View backgroundColor={fgColor} width="85%" mx="auto" p={8}>
          <Heading bold fontSize={'2xl'} color={fgTextColor} textAlign="center">
            {praiseMessage}
          </Heading>

          <Button onPress={handlePraiseContinuePress} mt={8} size="lg" _text={{ fontSize: 22 }} colorScheme="secondary">
            Continue
          </Button>
        </View>
      )}

      {!praiseMessage && (
        <>
          <View key="question" backgroundColor={fgColor} width="85%" mx="auto" py={8}>
            <Heading fontSize={'4xl'} color={fgTextColor} textAlign="center" mb={4}>
              What is...
            </Heading>
            <Heading fontSize={'4xl'} color={fgTextColor} textAlign="center">
              {thisQuestion.operand1} {thisQuestion.operator} {thisQuestion.operand2}
            </Heading>
          </View>
          <View key="response" width="50%" mx="auto" mt={16}>
            <Input
              background="#fff"
              fontSize={32}
              keyboardType="number-pad"
              value={answer}
              textAlign="center"
              onChangeText={(text) => setAnswer(text)}
              isDisabled={answerSubmitted}
            />

            <Button
              onPress={handleAnswerSubmit}
              mt={4}
              size="lg"
              _text={{ fontSize: 22 }}
              disabled={answerSubmitted || !isAnswerValid()}
              colorScheme={!isAnswerValid() ? 'gray' : answerSubmitted ? (thisResponse.correct ? 'green' : 'red') : 'secondary'}
            >
              {!answerSubmitted && 'Check answer'}
              {answerSubmitted ? (thisResponse.correct ? 'Correct!' : 'Incorrect') : null}
            </Button>
          </View>
        </>
      )}

      <View flex={1} />

      {answerSubmitted && (
        <View width="100%" px={6} py={4} style={{ backgroundColor: thisResponse.correct ? 'green' : 'red' }}>
          <VStack space={2}>
            <Text color={fontColorContrast(thisResponse.correct ? 'green' : 'red')} fontSize={18}>
              {thisResponse.correct ? 'Well done!' : `Uh oh, the correct answer was ${thisQuestion.answer}.`}
            </Text>
            <Button borderWidth={1} colorScheme={thisResponse.correct ? 'green' : 'red'} onPress={handleNextQuestionPress}>
              Continue
            </Button>
          </VStack>
        </View>
      )}
    </VStack>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
