import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { images } from '../../../assets/images';
import { BrandImage } from '../../../design-system/components/BrandImage';
/** Continuous full-screen official photograph with a translucent readability overlay. */
export function SplashArtwork() {
  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <BrandImage
        source={images['events-hero']}
        resizeMode="cover"
        style={styles.photo}
      />
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="splashShade" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0" stopColor="#080A0D" stopOpacity="0.35" />
            <Stop offset="0.43" stopColor="#080A0D" stopOpacity="0.55" />
            <Stop offset="0.61" stopColor="#080A0D" stopOpacity="0.45" />
            <Stop offset="0.78" stopColor="#080A0D" stopOpacity="0.30" />
            <Stop offset="1" stopColor="#080A0D" stopOpacity="0.55" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#splashShade)" />
      </Svg>
    </View>
  );
}
const styles = StyleSheet.create({
  photo: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
});
