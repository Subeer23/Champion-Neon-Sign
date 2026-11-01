import React from 'react';
import { StyleSheet, View, type ImageSourcePropType } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { BrandImage } from '../../design-system/components/BrandImage';
import { colors } from '../../design-system/tokens/colors';
export function CinematicBackdrop({
  source,
  overlay = true,
}: {
  source: ImageSourcePropType;
  overlay?: boolean;
}) {
  return (
    <View
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={StyleSheet.absoluteFill}
    >
      <BrandImage source={source} resizeMode="cover" style={styles.image} />
      {overlay && (
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="cinema" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0" stopColor={colors.dark} stopOpacity="0.96" />
              <Stop offset="0.35" stopColor={colors.dark} stopOpacity="0.74" />
              <Stop offset="0.68" stopColor={colors.dark} stopOpacity="0.30" />
              <Stop offset="1" stopColor={colors.dark} stopOpacity="0.98" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#cinema)" />
        </Svg>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: { ...StyleSheet.absoluteFill, width: '100%', height: '100%' },
});
