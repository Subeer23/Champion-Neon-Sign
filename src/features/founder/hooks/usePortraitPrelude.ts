import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

export const PORTRAIT_PRELUDE_MS = 3000;
/** Three seconds of foreground portrait time, once per presentation mount. */
export function usePortraitPrelude() {
  const [complete, setComplete] = useState(false);
  useEffect(() => {
    if (complete) return;
    let live = true;
    let remaining = PORTRAIT_PRELUDE_MS;
    let started = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const pause = () => {
      if (timer === null) return;
      clearTimeout(timer);
      timer = null;
      remaining = Math.max(0, remaining - (Date.now() - started));
    };
    const begin = () => {
      if (!live || timer !== null) return;
      started = Date.now();
      timer = setTimeout(() => {
        timer = null;
        if (live) setComplete(true);
      }, remaining);
    };
    const listener = AppState.addEventListener('change', state => {
      if (state === 'active') begin();
      else pause();
    });
    if (
      AppState.currentState !== 'background' &&
      AppState.currentState !== 'inactive'
    )
      begin();
    return () => {
      live = false;
      pause();
      listener.remove();
    };
  }, [complete]);
  return complete;
}
