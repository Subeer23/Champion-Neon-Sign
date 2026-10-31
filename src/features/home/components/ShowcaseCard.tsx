import React from 'react';
import {
  Pressable,
  View,
  StyleSheet,
  type ImageSourcePropType,
} from 'react-native';
import { BrandImage } from '../../../design-system/components/BrandImage';
import { AppText } from '../../../design-system/components';
import { radii, spacing } from '../../../design-system/tokens/spacing';
import { colors } from '../../../design-system/tokens/colors';
export function ShowcaseCard({
  title,
  subtitle,
  image,
  onPress,
}: {
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Explore ${title}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <BrandImage
        source={image}
        accessibilityLabel={title}
        resizeMode="cover"
        style={styles.image}
      />
      <View style={styles.body}>
        <View style={styles.copy}>
          <AppText variant="heading" style={styles.title}>
            {title}
          </AppText>
          <AppText muted style={styles.description}>
            {subtitle}
          </AppText>
        </View>
        <AppText style={styles.arrow} accessible={false}>
          ↗
        </AppText>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    flex: 1,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.88, borderColor: colors.primary },
  image: { width: '100%', aspectRatio: 16 / 10 },
  title: { fontSize: 19, lineHeight: 27 },
  description: { fontSize: 14, lineHeight: 22 },
  body: {
    padding: spacing.md,
    gap: spacing.sm,
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  copy: { flex: 1, gap: spacing.sm },
  arrow: { color: colors.primary, fontSize: 24, lineHeight: 27 },
});
