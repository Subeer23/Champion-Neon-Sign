import React, { memo, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { BrandImage } from '../../../design-system/components/BrandImage';
import { getImage } from '../../../assets/images';
import type { FounderContent } from '../domain/FounderContent';
import { founderContent } from '../data/founderContent';
import { FounderInitials } from './FounderSpotlight';

/** A single stationary portrait behind the entire presentation, never inside its scroll content. */
export const FounderCinematicBackground = memo(
  function CinematicPortraitBackground() {
    const { width, height } = useWindowDimensions();
    const photoWidth = Math.min(480, width, height);
    const [failed, setFailed] = useState(false);
    const portrait: FounderContent['portrait'] = founderContent.portrait;
    const source =
      portrait.kind === 'photo' ? getImage(portrait.imageId) : undefined;
    return (
      <View
        testID="founder-cinematic-background"
        pointerEvents="none"
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.background}
      >
        {source && !failed ? (
          <View
            style={[
              styles.photoFrame,
              { width: photoWidth, height: (photoWidth * 404) / 408 },
            ]}
          >
            <BrandImage
              source={source}
              resizeMode="cover"
              style={styles.photo}
              onError={() => setFailed(true)}
            />
          </View>
        ) : (
          <View style={styles.fallback}>
            <FounderInitials />
          </View>
        )}
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient
              id="founderPortraitShade"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <Stop offset="0" stopColor="#101010" stopOpacity="0.92" />
              <Stop offset="0.25" stopColor="#101010" stopOpacity="0.32" />
              <Stop offset="0.5" stopColor="#101010" stopOpacity="0.14" />
              <Stop offset="0.78" stopColor="#101010" stopOpacity="0.32" />
              <Stop offset="1" stopColor="#101010" stopOpacity="0.94" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#founderPortraitShade)" />
        </Svg>
      </View>
    );
  },
);
const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#272E3A',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoFrame: { overflow: 'hidden' },
  photo: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
    transform: [{ scale: 1.04 }],
  },
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
