import { useState, useEffect, useCallback } from 'react';

export interface TimeResult {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  totalMinutes: number;
  totalHours: number;
  operation: string;
  isValid: boolean;
}

export interface TimeErrors {
  hours1?: string;
  minutes1?: string;
  seconds1?: string;
  hours2?: string;
  minutes2?: string;
  seconds2?: string;
}

export const formatTimeComponent = (value: number): string => {
  return value.toString().padStart(2, '0');
};

export const formatTime = (hours: number, minutes: number, seconds: number): string => {
  return `${formatTimeComponent(hours)}:${formatTimeComponent(minutes)}:${formatTimeComponent(seconds)}`;
};

const timeToSeconds = (hours: number, minutes: number, seconds: number): number => {
  return hours * 3600 + minutes * 60 + seconds;
};

const secondsToTime = (totalSeconds: number): { hours: number; minutes: number; seconds: number } => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
};

const addTimes = (
  h1: number, m1: number, s1: number,
  h2: number, m2: number, s2: number
): TimeResult => {
  const resultSeconds = timeToSeconds(h1, m1, s1) + timeToSeconds(h2, m2, s2);
  const { hours, minutes, seconds } = secondsToTime(resultSeconds);
  return {
    hours, minutes, seconds,
    totalSeconds: resultSeconds,
    totalMinutes: Math.floor(resultSeconds / 60),
    totalHours: Math.floor(resultSeconds / 3600),
    operation: 'add',
    isValid: true
  };
};

const subtractTimes = (
  h1: number, m1: number, s1: number,
  h2: number, m2: number, s2: number
): TimeResult => {
  const resultSeconds = Math.abs(timeToSeconds(h1, m1, s1) - timeToSeconds(h2, m2, s2));
  const { hours, minutes, seconds } = secondsToTime(resultSeconds);
  return {
    hours, minutes, seconds,
    totalSeconds: resultSeconds,
    totalMinutes: Math.floor(resultSeconds / 60),
    totalHours: Math.floor(resultSeconds / 3600),
    operation: 'subtract',
    isValid: true
  };
};

interface UseTimeCalculatorOptions {
  errorMessages: {
    hours: string;
    minutes: string;
    seconds: string;
  };
}

export function useTimeCalculator({ errorMessages }: UseTimeCalculatorOptions) {
  const [operation, setOperation] = useState<string>('add');
  const [hours1, setHours1] = useState<string>('2');
  const [minutes1, setMinutes1] = useState<string>('30');
  const [seconds1, setSeconds1] = useState<string>('45');
  const [hours2, setHours2] = useState<string>('1');
  const [minutes2, setMinutes2] = useState<string>('15');
  const [seconds2, setSeconds2] = useState<string>('30');
  const [result, setResult] = useState<TimeResult | null>(null);
  const [errors, setErrors] = useState<TimeErrors>({});

  const validateInputs = useCallback((): boolean => {
    const newErrors: TimeErrors = {};
    const vals = [
      { v: hours1, key: 'hours1' as const, max: 999, msg: errorMessages.hours },
      { v: minutes1, key: 'minutes1' as const, max: 59, msg: errorMessages.minutes },
      { v: seconds1, key: 'seconds1' as const, max: 59, msg: errorMessages.seconds },
      { v: hours2, key: 'hours2' as const, max: 999, msg: errorMessages.hours },
      { v: minutes2, key: 'minutes2' as const, max: 59, msg: errorMessages.minutes },
      { v: seconds2, key: 'seconds2' as const, max: 59, msg: errorMessages.seconds },
    ];
    for (const { v, key, max, msg } of vals) {
      const num = parseInt(v);
      if (!v || isNaN(num) || num < 0 || num > max) {
        newErrors[key] = msg;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [hours1, minutes1, seconds1, hours2, minutes2, seconds2, errorMessages]);

  useEffect(() => {
    if (validateInputs()) {
      const h1 = parseInt(hours1), m1 = parseInt(minutes1), s1 = parseInt(seconds1);
      const h2 = parseInt(hours2), m2 = parseInt(minutes2), s2 = parseInt(seconds2);
      setResult(operation === 'add'
        ? addTimes(h1, m1, s1, h2, m2, s2)
        : subtractTimes(h1, m1, s1, h2, m2, s2)
      );
    } else {
      setResult(null);
    }
  }, [hours1, minutes1, seconds1, hours2, minutes2, seconds2, operation, validateInputs]);

  const time1Formatted = formatTime(
    parseInt(hours1 || '0'), parseInt(minutes1 || '0'), parseInt(seconds1 || '0')
  );
  const time2Formatted = formatTime(
    parseInt(hours2 || '0'), parseInt(minutes2 || '0'), parseInt(seconds2 || '0')
  );

  return {
    operation, setOperation,
    hours1, setHours1, minutes1, setMinutes1, seconds1, setSeconds1,
    hours2, setHours2, minutes2, setMinutes2, seconds2, setSeconds2,
    result, errors,
    time1Formatted, time2Formatted,
  };
}
