import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewProps,
} from 'react-native';
import { useReducedMotion } from '../hooks/useReducedMotion';

type Entry = { top: number; height: number; reveal: () => void };
type RevealContextValue = {
  staticContent: boolean;
  register: (id: string, entry: Entry) => void;
  unregister: (id: string) => void;
};
const Context = createContext<RevealContextValue | null>(null);

/** Measures direct content children; scrolling changes refs, never React state. */
export function RevealScrollView({
  children,
  onLayout,
  onScroll,
  ...props
}: ScrollViewProps) {
  const reducedMotion = useReducedMotion();
  const [screenReader, setScreenReader] = useState(true);
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isScreenReaderEnabled()
      .then(value => {
        if (active) setScreenReader(value);
      })
      .catch(() => {
        if (active) setScreenReader(true);
      });
    const subscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setScreenReader,
    );
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);
  const entries = useRef(new Map<string, Entry>());
  const viewport = useRef({ top: 0, height: 0 });
  const check = useCallback(() => {
    const { top, height } = viewport.current;
    if (height <= 0) return;
    entries.current.forEach((entry, id) => {
      if (entry.top < top + height - 24 && entry.top + entry.height > top) {
        entries.current.delete(id);
        entry.reveal();
      }
    });
  }, []);
  const register = useCallback(
    (id: string, entry: Entry) => {
      entries.current.set(id, entry);
      check();
    },
    [check],
  );
  const unregister = useCallback((id: string) => {
    entries.current.delete(id);
  }, []);
  const layout = useCallback(
    (event: LayoutChangeEvent) => {
      viewport.current.height = event.nativeEvent.layout.height;
      check();
      onLayout?.(event);
    },
    [check, onLayout],
  );
  const scroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      viewport.current.top = event.nativeEvent.contentOffset.y;
      viewport.current.height = event.nativeEvent.layoutMeasurement.height;
      check();
      onScroll?.(event);
    },
    [check, onScroll],
  );
  const value = useMemo(
    () => ({
      staticContent: reducedMotion || screenReader,
      register,
      unregister,
    }),
    [reducedMotion, screenReader, register, unregister],
  );
  return (
    <Context.Provider value={value}>
      <ScrollView
        {...props}
        onLayout={layout}
        onScroll={scroll}
        scrollEventThrottle={16}
      >
        {children}
      </ScrollView>
    </Context.Provider>
  );
}

/** Reveal once when this direct scroll-content block first enters the viewport. */
export function ScrollReveal({ children }: PropsWithChildren) {
  const context = useContext(Context);
  const id = useId();
  const progress = useRef(new Animated.Value(0)).current;
  const revealed = useRef(false);
  const animation = useRef<Animated.CompositeAnimation | null>(null);
  const staticContent = context?.staticContent ?? true;
  const reveal = useCallback(() => {
    if (revealed.current) return;
    revealed.current = true;
    if (staticContent) {
      progress.setValue(1);
      return;
    }
    animation.current = Animated.timing(progress, {
      toValue: 1,
      duration: 380,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.current.start();
  }, [progress, staticContent]);
  const register = context?.register;
  const unregister = context?.unregister;
  const measured = useRef<{ y: number; height: number } | null>(null);
  const layout = useCallback(
    (event: LayoutChangeEvent) => {
      measured.current = event.nativeEvent.layout;
      if (!revealed.current)
        register?.(id, {
          top: event.nativeEvent.layout.y,
          height: event.nativeEvent.layout.height,
          reveal,
        });
    },
    [id, register, reveal],
  );
  useEffect(() => {
    if (staticContent && revealed.current) {
      animation.current?.stop();
      progress.setValue(1);
    }
    if (measured.current && !revealed.current)
      register?.(id, {
        top: measured.current.y,
        height: measured.current.height,
        reveal,
      });
    return () => {
      unregister?.(id);
    };
  }, [id, progress, register, unregister, reveal, staticContent]);
  useEffect(
    () => () => {
      animation.current?.stop();
    },
    [],
  );
  const motionStyle = useMemo(
    () => ({
      opacity: progress,
      transform: [
        {
          translateY: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0],
          }),
        },
      ],
    }),
    [progress],
  );
  if (!context) return <View>{children}</View>;
  return (
    <Animated.View
      onLayout={layout}
      style={staticContent ? styles.visible : motionStyle}
    >
      {children}
    </Animated.View>
  );
}
const styles = StyleSheet.create({ visible: { opacity: 1 } });
