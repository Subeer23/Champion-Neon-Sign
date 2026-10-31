import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { StyleSheet } from 'react-native';
import { colors } from '../../../design-system/tokens/colors';
/** Quiet architectural framing; decorative and excluded from accessibility. */
export function SplashArtwork() {
  return (
    <Svg
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={StyleSheet.absoluteFill}
      width="100%"
      height="100%"
      viewBox="0 0 400 800"
      preserveAspectRatio="xMidYMid slice"
    >
      <Path
        d="M-60 240L160 20H360V150L270 240 M-60 262L168 34H346V144L258 232 M288 0V98L220 166"
        fill="none"
        stroke={colors.onDark}
        strokeOpacity={0.055}
        strokeWidth={1}
      />
      <Path
        d="M0 650H110L228 768H430 M0 674H100L226 800 M330 620V748H400"
        fill="none"
        stroke={colors.onDark}
        strokeOpacity={0.04}
        strokeWidth={1}
      />
      <Path
        d="M288 70V98L264 122"
        fill="none"
        stroke={colors.primary}
        strokeOpacity={0.6}
        strokeWidth={1.5}
      />
      <Rect
        x={20}
        y={320}
        width={2}
        height={96}
        fill={colors.primary}
        opacity={0.15}
      />
      <Rect
        x={378}
        y={358}
        width={2}
        height={96}
        fill={colors.primary}
        opacity={0.1}
      />
    </Svg>
  );
}
