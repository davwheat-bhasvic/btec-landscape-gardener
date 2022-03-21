import type { Quiz } from '../screens/QuizScreen';

function choose<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function getPraiseMessage(quiz: Quiz): string | null {
  const totalQuestions = quiz.questions.length;
  const answeredSoFar = quiz.responses.filter((r) => r.hasResponded).length;
  const answeredCorrectly = quiz.responses.filter((r) => r.correct).length;
  const correctStreak = quiz.responses
    .filter((r) => r.hasResponded)
    .reduce((acc, r) => {
      return r.correct ? acc + 1 : 0;
    }, 0);
  const incorrectStreak = quiz.responses
    .filter((r) => r.hasResponded)
    .reduce((acc, r) => {
      return !r.correct ? acc + 1 : 0;
    }, 0);

  // Order by scenario specificity to give as specific feedback as possible

  if (incorrectStreak === 3) {
    return choose(["Don't worry, you can do it! Keep trying!"]);
  }

  if (answeredSoFar === answeredCorrectly && answeredSoFar === Math.ceil(0.8 * totalQuestions)) {
    return choose(["Just a few more to go! Don't lose your perfect streak now!", "Almost there! Don't lose your answer streak now!"]);
  }

  if (correctStreak === 6) {
    return choose(["Woah, six in a row! You're amazing at this!", "You're a maths wizard!"]);
  }

  if (correctStreak === 3) {
    return choose(["You're on a roll! Keep it up!", 'Three in a row! Keep it up!', "You're working really hard! Keep going!"]);
  }

  if (answeredSoFar === Math.ceil(totalQuestions / 2)) {
    return "You're half-way there! Keep going!";
  }

  return null;
}
