import React from 'react';
import { StyleSheet, type ImageStyle, type StyleProp } from 'react-native';
import { images } from '../../assets/images';
import { BrandImage } from './BrandImage';
export function BrandLogo({
  large = false,
  style,
}: {
  large?: boolean;
  style?: StyleProp<ImageStyle>;
}) {
  return (
    <BrandImage
      source={images.logo}
      accessibilityLabel="Champion Group"
      resizeMode="contain"
      style={[large ? styles.large : styles.logo, style]}
    />
  );
}
const styles = StyleSheet.create({
  logo: { width: 144, height: 58 },
  large: { width: 264, height: 108 },
});
