import React, { useEffect, useRef, type PropsWithChildren } from 'react';
import { Animated, type StyleProp, type ViewStyle } from 'react-native';
import { useReducedMotion } from '../../shared/hooks/useReducedMotion';
export function FadeIn({
  children,
  style,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  const progress = useRef(new Animated.Value(0)).current;
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) {
      progress.setValue(1);
      return;
    }
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 240,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, reduced]);
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [8, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
