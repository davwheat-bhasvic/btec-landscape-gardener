import type { Question } from '../screens/QuizScreen';

const QuestionCount = 10;

function calcAnswer(op1: number, op2: number, type: 'addition' | 'subtraction' | 'multiplication') {
  switch (type) {
    case 'addition':
      return op1 + op2;
    case 'subtraction':
      return op1 - op2;
    case 'multiplication':
      return op1 * op2;
  }
}

export default function createQuiz(quizType: 'addition' | 'subtraction' | 'multiplication' | 'division'): Question[] {
  const arr: Question[] = [];

  if (quizType === 'division') {
    for (let i = 0; i < QuestionCount; i++) {
      const mult1 = Math.floor(Math.random() * 12) + 1;
      const mult2 = Math.floor(Math.random() * 12) + 1;
      const multAns = mult1 * mult2;

      arr.push({
        operand1: multAns,
        operand2: mult1,
        answer: mult2,
        operator: '÷',
      });
    }

    return arr;
  }

  const max = ['addition', 'subtraction'].includes(quizType) ? 30 : 12;

  for (let i = 0; i < QuestionCount; i++) {
    const num1 = Math.floor(Math.random() * max) + 1;
    const num2 = Math.floor(Math.random() * max) + 1;
    arr.push({
      operand1: num1,
      operand2: num2,
      operator: quizType === 'addition' ? '+' : quizType === 'subtraction' ? '-' : '×',
      answer: calcAnswer(num1, num2, quizType),
    });
  }

  return arr;
}
