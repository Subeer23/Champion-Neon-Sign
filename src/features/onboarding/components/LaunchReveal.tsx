import React, { useEffect, useRef, type PropsWithChildren } from 'react';
import { AccessibilityInfo, Animated, StyleSheet } from 'react-native';
/** Reveal the ready screen immediately; never hold startup for an animation. */
export function LaunchReveal({ children }: PropsWithChildren) {
  const opacity = useRef(new Animated.Value(0.94)).current;
  useEffect(() => {
    let active = true;
    let animation: Animated.CompositeAnimation | undefined;
    const reveal = (reduced: boolean) => {
      if (!active) return;
      animation?.stop();
      if (reduced) {
        opacity.setValue(1);
      } else {
        animation = Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        });
        animation.start();
      }
    };
    AccessibilityInfo.isReduceMotionEnabled()
      .then(reveal)
      .catch(() => reveal(true));
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      reveal,
    );
    return () => {
      active = false;
      animation?.stop();
      subscription.remove();
    };
  }, [opacity]);
  return (
    <Animated.View style={[styles.content, { opacity }]}>
      {children}
    </Animated.View>
  );
}
const styles = StyleSheet.create({ content: { flex: 1 } });
