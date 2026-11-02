import { useCallback, useEffect, useRef } from 'react';

/** Ref lock covers the interval before navigation/disabled state reaches the UI. */
export function usePressGuard<T extends unknown[]>(
  onPress?: (...args: T) => void,
) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );
  return useCallback(
    (...args: T) => {
      if (!onPress || timer.current !== null) return;
      timer.current = setTimeout(() => {
        timer.current = null;
      }, 350);
      onPress(...args);
    },
    [onPress],
  );
}
