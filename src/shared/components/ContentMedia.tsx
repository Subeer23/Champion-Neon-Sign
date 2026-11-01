import React from 'react';
import Svg, { G, Path } from 'react-native-svg';
import { solutionIcons } from '../../assets/images/solutionIcons';
import { Image, StyleSheet, View } from 'react-native';
import { getImage } from '../../assets/images';
import { BrandImage } from '../../design-system/components/BrandImage';
import { AppText } from '../../design-system/components';
import { colors } from '../../design-system/tokens/colors';
export function ContentMedia({
  imageId,
  title,
  detail = false,
  height,
  resizeMode = 'contain',
}: {
  imageId?: string;
  title: string;
  detail?: boolean;
  height?: number;
  resizeMode?: 'cover' | 'contain';
}) {
  const image = getImage(imageId);
  const dimensions = image ? Image.resolveAssetSource(image) : undefined;
  const aspectRatio =
    detail && dimensions?.width && dimensions.height
      ? Math.max(0.8, dimensions.width / dimensions.height)
      : 1.6;
  const icon = solutionIcons[title.toUpperCase()];
  return image ? (
    <View style={styles.frame}>
      <View style={[styles.viewport, height ? { height } : { aspectRatio }]}>
        <BrandImage
          source={image}
          accessibilityLabel={title}
          style={styles.photo}
          resizeMode={resizeMode}
        />
      </View>
      {imageId === 'solution-signage' && (
        <AppText variant="caption" muted style={styles.note}>
          Official website signage mockup
        </AppText>
      )}
    </View>
  ) : (
    <View style={[styles.image, styles.placeholder]}>
      <>
        {icon && (
          <Svg
            width={52}
            height={52}
            viewBox={icon.viewBox}
            accessibilityLabel={`${title} official website icon`}
            accessible
          >
            <G transform={icon.transform}>
              {icon.paths.map((d, index) => (
                <Path key={index} d={d} fill={colors.accentOnDark} />
              ))}
            </G>
          </Svg>
        )}
      </>
      <AppText style={styles.eyebrow}>CHAMPION GROUP / SOLUTIONS</AppText>
      <AppText variant="heading" style={styles.title}>
        {title}
      </AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  viewport: { width: '100%', overflow: 'hidden' },
  photo: { ...StyleSheet.absoluteFill, width: '100%', height: '100%' },
  frame: {
    width: '100%',
    minWidth: 0,
    flexShrink: 0,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.dark,
  },
  note: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.surface,
  },
  image: { width: '100%', aspectRatio: 1.6 },
  placeholder: {
    backgroundColor: colors.dark,
    justifyContent: 'center',
    padding: 20,
    gap: 8,
    minHeight: 180,
    borderRadius: 16,
  },
  eyebrow: { fontSize: 10, color: colors.accentOnDark, letterSpacing: 1 },
  title: { color: colors.onDark },
});
