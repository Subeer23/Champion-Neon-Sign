import React, { useState } from 'react';
import { Image, View, StyleSheet, type ImageProps } from 'react-native';
import { AppText } from './AppText';
import { colors } from '../tokens/colors';
export function BrandImage(props: ImageProps) {
  // Remount failure state only when the image source changes (e.g. onboarding).
  return <ImageContent key={JSON.stringify(props.source)} {...props} />;
}
function ImageContent({
  accessibilityLabel,
  style,
  onError,
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
      onError={event => {
        setFailed(true);
        onError?.(event);
      }}
      resizeMethod="resize"
      fadeDuration={0}
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
