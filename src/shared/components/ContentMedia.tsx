import React from 'react';
import Svg, { G, Path } from 'react-native-svg';
import { solutionIcons } from '../../assets/images/solutionIcons';
import { StyleSheet, View } from 'react-native';
import { getImage } from '../../assets/images';
import { BrandImage } from '../../design-system/components/BrandImage';
import { AppText } from '../../design-system/components';
import { colors } from '../../design-system/tokens/colors';
export function ContentMedia({
  imageId,
  title,
}: {
  imageId?: string;
  title: string;
}) {
  const image = getImage(imageId);
  const icon = solutionIcons[title.toUpperCase()];
  return image ? (
    <View>
      <BrandImage
        source={image}
        accessibilityLabel={title}
        style={styles.image}
        resizeMode="cover"
      />
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
      <AppText variant="caption" style={styles.muted}>
        {icon
          ? 'Original website service icon'
          : 'Dedicated imagery not published'}
      </AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  note: { paddingHorizontal: 12, paddingVertical: 8 },
  image: { width: '100%', aspectRatio: 1.6 },
  placeholder: {
    backgroundColor: colors.dark,
    justifyContent: 'center',
    padding: 20,
    gap: 8,
    minHeight: 220,
  },
  eyebrow: { fontSize: 10, color: colors.accentOnDark, letterSpacing: 1 },
  title: { color: colors.onDark },
  muted: { color: colors.mutedOnDark },
});
