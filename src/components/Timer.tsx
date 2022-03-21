import dayjs from 'dayjs';
import { Text } from 'native-base';
import type { ColorType } from 'native-base/lib/typescript/components/types';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { timerAtom } from '../atoms/GlobalStateAtom';

interface Props {
  shouldTick: boolean;
  textColor?: ColorType;
}

export default function Timer({ shouldTick, textColor }: Props) {
  const [timerState, setTimerState] = useRecoilState(timerAtom);
  const [internalTimer, setInternalTimer] = useState<number>(timerState.milliseconds);

  const tickingInfo = useRef<{ wasTickingLastRender: boolean; startedTicking: number | null }>({
    wasTickingLastRender: shouldTick,
    startedTicking: shouldTick ? Date.now() : null,
  });

  useEffect(() => {
    let key: null | NodeJS.Timeout = null;

    if (shouldTick) {
      if (!tickingInfo.current.wasTickingLastRender) {
        tickingInfo.current.startedTicking = Date.now();
        tickingInfo.current.wasTickingLastRender = true;
      }

      key = setTimeout(() => {
        setInternalTimer((t) => t + 100);
      }, 100);
    } else {
      if (tickingInfo.current.wasTickingLastRender) {
        tickingInfo.current.wasTickingLastRender = false;
        const msDiff = dayjs(Date.now()).diff(tickingInfo.current.startedTicking, 'milliseconds');
        setTimerState((t) => {
          setInternalTimer(t.milliseconds + msDiff);
          return { ...t, milliseconds: t.milliseconds + msDiff };
        });
      }
    }

    return () => {
      key && clearTimeout(key);
    };
  });

  const mins = Math.floor(internalTimer / 1000 / 60);
  const secs = Math.floor(internalTimer / 1000) % 60;

  return (
    <Text color={textColor} fontSize={20} bold>
      {mins}:{secs < 10 ? `0${secs}` : secs}
    </Text>
  );
}
