import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandLogo } from '../../../design-system/components/BrandLogo';
import { FadeIn } from '../../../design-system/components/FadeIn';
import { AppText, Button } from '../../../design-system/components';
import { colors } from '../../../design-system/tokens/colors';
export function SplashScreen({
  error,
  onRetry,
}: {
  error?: string | null;
  onRetry?: () => void;
}) {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <FadeIn style={styles.center}>
        <BrandLogo large />
        <View style={styles.rule} />
        <AppText style={styles.caption}>
          VISUAL COMMUNICATION · SINCE 1989
        </AppText>
        {error && (
          <View style={styles.error}>
            <AppText accessibilityRole="alert" style={styles.white}>
              {error}
            </AppText>
            <Button label="Try again" onPress={onRetry} />
          </View>
        )}
      </FadeIn>
      <AppText style={styles.footer}>Ideas made visible.</AppText>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.dark, padding: 24 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24 },
  rule: { width: 36, height: 3, backgroundColor: colors.primary },
  caption: {
    color: colors.mutedOnDark,
    fontSize: 10,
    letterSpacing: 1.8,
    textAlign: 'center',
  },
  white: { color: 'white', textAlign: 'center' },
  footer: { color: colors.mutedOnDark, textAlign: 'center', paddingBottom: 24 },
  error: { gap: 16, maxWidth: 340 },
});
