import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import { BrandImage } from '../../../design-system/components/BrandImage';
import { images } from '../../../assets/images';
/** Official exhibition photography; gradients keep the original logo readable. */
export function SplashArtwork() {
  const { width, height } = useWindowDimensions();
  const photoHeight = Math.min(height * 0.62, width * 0.75);
  return (
    <View
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={StyleSheet.absoluteFill}
    >
      <View
        style={[
          styles.photograph,
          { top: height * 0.45 - photoHeight / 2, height: photoHeight },
        ]}
      >
        <BrandImage
          source={images.exhibition}
          resizeMode="contain"
          style={StyleSheet.absoluteFill}
        />
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="photoEdges" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#101012" />
              <Stop offset="0.18" stopColor="#101012" stopOpacity="0" />
              <Stop offset="0.82" stopColor="#101012" stopOpacity="0" />
              <Stop offset="1" stopColor="#101012" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#photoEdges)" />
        </Svg>
      </View>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="campaignShade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#101012" stopOpacity="0.94" />
            <Stop offset="0.25" stopColor="#101012" stopOpacity="0.42" />
            <Stop offset="0.45" stopColor="#101012" stopOpacity="0.74" />
            <Stop offset="0.64" stopColor="#101012" stopOpacity="0.30" />
            <Stop offset="0.82" stopColor="#101012" stopOpacity="0.93" />
            <Stop offset="1" stopColor="#101012" />
          </LinearGradient>
          <RadialGradient id="campaignLight" cx="1" cy="0.48" rx="0.8" ry="0.5">
            <Stop offset="0" stopColor="#D71D24" stopOpacity="0.24" />
            <Stop offset="1" stopColor="#D71D24" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#campaignShade)" />
        <Rect width="100%" height="100%" fill="url(#campaignLight)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  photograph: {
    position: 'absolute',
    width: '100%',
  },
});
