import { useEffect, useRef, useState } from 'react';
/** Work may finish after leaving a screen: check isActive before UI/navigation.
 * Passwords remain in screen/repository calls, never Redux actions. */
export function useAsyncAction() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lock = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  async function run(work: (isActive: () => boolean) => Promise<void>) {
    if (lock.current || !mounted.current) return;
    lock.current = true;
    setBusy(true);
    setError(null);
    try {
      await work(() => mounted.current);
    } catch (e) {
      if (mounted.current)
        setError(
          e instanceof Error
            ? e.message
            : 'Unable to complete this demo action. Please retry.',
        );
    } finally {
      lock.current = false;
      if (mounted.current) setBusy(false);
    }
  }
  return { busy, error, run };
}
