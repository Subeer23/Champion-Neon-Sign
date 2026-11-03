import type { FounderContent } from '../domain/FounderContent';
import React, { useState } from 'react';
import { BrandImage } from '../../../design-system/components/BrandImage';
import { getImage } from '../../../assets/images';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, Button, Card } from '../../../design-system/components';
import { colors } from '../../../design-system/tokens/colors';
import { founderContent } from '../data/founderContent';

export function FounderInitials() {
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel="Shabbir Merchant initials placeholder"
      style={styles.initials}
    >
      <AppText
        numberOfLines={1}
        maxFontSizeMultiplier={1.5}
        style={styles.monogram}
      >
        {founderContent.initials}
      </AppText>
    </View>
  );
}
export function FounderPortrait({ large = false }: { large?: boolean }) {
  const [failed, setFailed] = useState(false);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const portraitWidth = Math.max(
    1,
    Math.min(320, width - insets.left - insets.right - 40),
  );
  const portrait: FounderContent['portrait'] = founderContent.portrait;
  const source =
    portrait.kind === 'photo' ? getImage(portrait.imageId) : undefined;
  return (
    <View
      style={[
        styles.portrait,
        large
          ? [
              styles.largePortrait,
              { width: portraitWidth, height: (portraitWidth * 404) / 408 },
            ]
          : styles.smallPortrait,
      ]}
    >
      {failed || !source ? (
        <View style={styles.fallbackPortrait}>
          <FounderInitials />
        </View>
      ) : (
        <BrandImage
          source={source}
          accessibilityLabel={founderContent.name.text}
          resizeMode="cover"
          style={styles.photo}
          onError={() => setFailed(true)}
        />
      )}
    </View>
  );
}
export function FounderSpotlight({
  onOpen,
  about = false,
}: {
  onOpen: () => void;
  about?: boolean;
}) {
  return (
    <Card>
      <AppText variant="caption" style={styles.accent}>
        {about ? 'FOUNDER & COMPANY HISTORY' : 'FOUNDER SPOTLIGHT'}
      </AppText>
      <FounderPortrait />
      <AppText variant="heading">{founderContent.name.text}</AppText>
      <AppText variant="label" style={styles.accent}>
        {founderContent.designation.text}
      </AppText>
      <AppText muted>{founderContent.introduction.text}</AppText>
      <Button
        label="Explore Founder Journey"
        variant="secondary"
        onPress={onOpen}
      />
    </Card>
  );
}
const styles = StyleSheet.create({
  portrait: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  fallbackPortrait: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  smallPortrait: { width: 96, height: 96 },
  largePortrait: {
    alignSelf: 'center',
  },
  // Clip the narrow white edge embedded in the supplied photo; retain the original asset.
  photo: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
    transform: [{ scale: 1.04 }],
  },
  accent: { color: colors.accentOnDark },
  initials: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: colors.primarySubtle,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogram: {
    fontFamily: 'Manrope-Bold',
    fontSize: 28,
    lineHeight: 38,
    includeFontPadding: false,
    textAlign: 'center',
    letterSpacing: 1,
    color: colors.text,
  },
});
