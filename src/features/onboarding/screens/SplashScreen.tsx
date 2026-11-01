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
  return Math.max(0, Math.min(420, availableWidth - 48));
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
        duration: 360,
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
            { minHeight: Math.max(0, height - insets.top - insets.bottom) },
          ]}
        >
          <View style={styles.masthead}>
            <View style={styles.rule} />
            <AppText style={styles.eyebrow}>VISUAL COMMUNICATION</AppText>
            <AppText style={styles.since}>SINCE 1989</AppText>
          </View>
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
            <View style={styles.signature}>
              <View style={styles.accent} />
              <AppText style={styles.eyebrow}>CHAMPION GROUP · UAE</AppText>
            </View>
            <AppText
              accessibilityRole="header"
              style={[
                styles.tagline,
                width - insets.left - insets.right < 360 &&
                  styles.compactTagline,
              ]}
            >
              Elevate Your Brand{'\n'}With Champion.
            </AppText>
            <AppText style={styles.statement}>
              Quality Visual Communication Solutions
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
  screen: { flex: 1, backgroundColor: '#101012' },
  safe: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  masthead: { width: '100%', maxWidth: 520, gap: 6 },
  rule: { height: 1, backgroundColor: '#FFFFFF30', marginBottom: 12 },
  eyebrow: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 1.8,
    color: '#EEEEEE',
  },
  since: {
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 1.6,
    color: colors.mutedOnDark,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    minHeight: 220,
  },
  accent: { width: 28, height: 2, backgroundColor: colors.primary },
  signature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  lower: { gap: 16, width: '100%', maxWidth: 520 },
  tagline: {
    fontFamily: 'Manrope-Bold',
    fontSize: 32,
    lineHeight: 41,
    letterSpacing: -0.7,
    color: colors.onDark,
  },
  compactTagline: { fontSize: 28, lineHeight: 36 },
  statement: {
    fontFamily: 'Manrope-Regular',
    fontSize: 12,
    lineHeight: 20,
    color: colors.mutedOnDark,
  },
  error: { gap: 16, width: '100%', maxWidth: 520, paddingTop: 24 },
  errorText: { color: colors.onDark },
});
