import { atom } from 'recoil';
import { persistentAtom } from 'recoil-persistence/react-native';

interface IState {
  milliseconds: number;
}

interface IRecordsState {
  addition: number | null;
  subtraction: number | null;
  multiplication: number | null;
  division: number | null;
}

const timerAtom = atom<IState>({
  key: 'timerState',
  default: {
    milliseconds: 0,
  },
  dangerouslyAllowMutability: true,
});

const recordsAtom = persistentAtom<IRecordsState>({
  key: 'recordsState',
  default: {
    addition: null,
    subtraction: null,
    multiplication: null,
    division: null,
  },
  dangerouslyAllowMutability: true,
});

export { timerAtom, recordsAtom };
