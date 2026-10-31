import React, { useEffect, useRef } from 'react';
import {
  Animated,
  AccessibilityInfo,
  StyleSheet,
  View,
  StatusBar,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { BrandLogo } from '../../../design-system/components/BrandLogo';
import { AppText, Button } from '../../../design-system/components';
import { colors } from '../../../design-system/tokens/colors';
import { SplashArtwork } from '../components/SplashArtwork';
export function splashLogoWidth(availableWidth: number) {
  return Math.max(0, Math.min(320, availableWidth - 48));
}
export function SplashScreen({
  error,
  onRetry,
}: {
  error?: string | null;
  onRetry?: () => void;
}) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const logoWidth = splashLogoWidth(width - insets.left - insets.right);
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let active = true;
    let animation: Animated.CompositeAnimation | undefined;
    // Resolve accessibility preference before starting any motion.
    const apply = (reduced: boolean) => {
      if (!active) return;
      animation?.stop();
      if (reduced) {
        progress.setValue(1);
        return;
      }
      animation = Animated.timing(progress, {
        toValue: 1,
        duration: 620,
        useNativeDriver: true,
      });
      animation.start();
    };
    AccessibilityInfo.isReduceMotionEnabled()
      .then(apply)
      .catch(() => apply(true));
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      apply,
    );
    return () => {
      active = false;
      animation?.stop();
      subscription.remove();
    };
  }, [progress]);
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { opacity: progress }]}
      >
        <SplashArtwork />
      </Animated.View>
      <SafeAreaView
        style={styles.safe}
        edges={['top', 'bottom', 'left', 'right']}
      >
        <ScrollView
          bounces={false}
          contentInsetAdjustmentBehavior="never"
          contentContainerStyle={[
            styles.content,
            { minHeight: Math.max(0, height - insets.top - insets.bottom) },
          ]}
        >
          <View
            style={styles.upper}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <View style={styles.marker} />
          </View>
          <View style={styles.center}>
            <Animated.View
              style={{
                opacity: progress.interpolate({
                  inputRange: [0, 0.75, 1],
                  outputRange: [0, 1, 1],
                }),
                transform: [
                  {
                    scale: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.98, 1],
                    }),
                  },
                ],
              }}
            >
              <BrandLogo
                style={{ width: logoWidth, height: (logoWidth * 380) / 900 }}
              />
            </Animated.View>
            <Animated.View
              style={[
                styles.accent,
                {
                  opacity: progress,
                  transform: [
                    {
                      scaleX: progress.interpolate({
                        inputRange: [0, 0.25, 1],
                        outputRange: [0.15, 0.15, 1],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>
          <Animated.View
            style={[
              styles.lower,
              {
                opacity: progress.interpolate({
                  inputRange: [0, 0.4, 1],
                  outputRange: [0, 0, 1],
                }),
              },
            ]}
          >
            <AppText style={styles.tagline}>VISION. CRAFT. IMPACT.</AppText>
            <AppText style={styles.statement}>
              Signage • Branding • Digital Experiences
            </AppText>
          </Animated.View>
          {error && (
            <View style={styles.error}>
              <AppText accessibilityRole="alert" style={styles.errorText}>
                {error}
              </AppText>
              <Button label="Try again" onPress={onRetry} />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.dark },
  safe: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: 'center',
  },
  upper: {
    flex: 1,
    minHeight: 32,
    width: '100%',
    maxWidth: 320,
    justifyContent: 'flex-start',
  },
  marker: { width: 24, height: 1, backgroundColor: colors.borderDark },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    paddingVertical: 24,
  },
  accent: { width: 48, height: 2, backgroundColor: colors.primary },
  lower: {
    flex: 1,
    minHeight: 116,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    paddingTop: 32,
    paddingBottom: 16,
    width: '100%',
    maxWidth: 440,
  },
  tagline: {
    fontFamily: 'Manrope-Bold',
    fontSize: 12,
    lineHeight: 20,
    letterSpacing: 2.4,
    color: colors.onDark,
    textAlign: 'center',
  },
  statement: {
    fontFamily: 'Manrope-Regular',
    fontSize: 12,
    lineHeight: 20,
    color: colors.mutedOnDark,
    textAlign: 'center',
  },
  error: { gap: 16, width: '100%', maxWidth: 340, paddingVertical: 16 },
  errorText: { color: colors.onDark, textAlign: 'center' },
});
