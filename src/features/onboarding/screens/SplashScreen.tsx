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
  return Math.max(0, Math.min(320, availableWidth * 0.7, availableWidth - 48));
}
export function SplashScreen({
  error,
  onRetry,
  onEntranceComplete,
  onClearDemoData,
}: {
  error?: string | null;
  onRetry?: () => void;
  onEntranceComplete?: () => void;
  onClearDemoData?: () => void;
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
        onEntranceComplete?.();
        return;
      }
      animation = Animated.timing(progress, {
        toValue: 1,
        duration: 360,
        useNativeDriver: true,
      });
      animation.start(({ finished }) => {
        if (active && finished) onEntranceComplete?.();
      });
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
  }, [progress, onEntranceComplete]);
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0.72, 1],
            }),
          },
        ]}
      >
        <SplashArtwork />
      </Animated.View>
      <SafeAreaView
        style={styles.safe}
        edges={['top', 'bottom', 'left', 'right']}
      >
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="never"
          contentContainerStyle={[
            styles.content,
            {
              minHeight: Math.max(0, height - insets.top - insets.bottom),
              paddingTop: Math.max(
                48,
                (height - insets.top - insets.bottom) * 0.23,
              ),
            },
          ]}
        >
          <View style={styles.center}>
            <Animated.View
              testID="splash-logo-entrance"
              style={{
                opacity: progress.interpolate({
                  inputRange: [0, 0.75, 1],
                  outputRange: [0.85, 1, 1],
                }),
                transform: [
                  {
                    scale: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.99, 1],
                    }),
                  },
                ],
              }}
            >
              <BrandLogo
                style={{ width: logoWidth, height: (logoWidth * 380) / 900 }}
              />
            </Animated.View>
          </View>
          <Animated.View
            style={[
              styles.lower,
              {
                opacity: progress.interpolate({
                  inputRange: [0, 0.4, 1],
                  outputRange: [0.8, 0.8, 1],
                }),
              },
            ]}
          >
            <AppText
              accessibilityRole="header"
              style={[
                styles.tagline,
                width - insets.left - insets.right < 360 &&
                  styles.compactTagline,
              ]}
            >
              Elevate Your Brand
            </AppText>
            <AppText style={styles.statement}>With Champion.</AppText>
          </Animated.View>
          <View style={styles.accent} />
          {error && (
            <View style={styles.error}>
              <AppText accessibilityRole="alert" style={styles.errorText}>
                {error}
              </AppText>
              <Button label="Try again" onPress={onRetry} />
              {onClearDemoData && (
                <Button
                  label="Clear damaged demo data"
                  variant="secondary"
                  onPress={onClearDemoData}
                />
              )}
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
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 28,
  },
  accent: {
    width: 96,
    height: 2,
    backgroundColor: colors.primary,
    marginTop: 'auto',
    marginBottom: 18,
  },
  lower: { gap: 4, width: '100%', maxWidth: 520, paddingBottom: 40 },
  tagline: {
    fontFamily: 'Manrope-Bold',
    fontSize: 15,
    lineHeight: 22,
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: 1.2,
    color: colors.primaryStrong,
  },
  compactTagline: { fontSize: 13, lineHeight: 20 },
  statement: {
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    textAlign: 'center',
    color: colors.mutedOnDark,
  },
  error: { gap: 16, width: '100%', maxWidth: 520, paddingTop: 24 },
  errorText: { color: colors.onDark },
});
