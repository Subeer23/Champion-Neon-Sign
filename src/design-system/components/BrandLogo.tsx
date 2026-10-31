import React from 'react';
import { StyleSheet } from 'react-native';
import { images } from '../../assets/images';
import { BrandImage } from './BrandImage';
export function BrandLogo({ large = false }: { large?: boolean }) {
  return (
    <BrandImage
      source={images.logo}
      accessibilityLabel="Champion Group"
      resizeMode="contain"
      style={large ? styles.large : styles.logo}
    />
  );
}
const styles = StyleSheet.create({
  logo: { width: 144, height: 58 },
  large: { width: 264, height: 108 },
});
