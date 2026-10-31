import React, { useState } from 'react';
import { Image, View, StyleSheet, type ImageProps } from 'react-native';
import { AppText } from './AppText';
import { colors } from '../tokens/colors';
export function BrandImage({
  accessibilityLabel,
  style,
  ...props
}: ImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <View style={[styles.fallback, style]}>
        <AppText muted>{accessibilityLabel ?? 'Image unavailable'}</AppText>
      </View>
    );
  }
  return (
    <Image
      {...props}
      accessibilityLabel={accessibilityLabel}
      accessible={Boolean(accessibilityLabel)}
      style={style}
      onError={() => setFailed(true)}
    />
  );
}
const styles = StyleSheet.create({
  fallback: {
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
