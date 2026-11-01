import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { ContentMedia } from '../../../shared/components/ContentMedia';
import { AppText } from '../../../design-system/components';
import { radii, spacing } from '../../../design-system/tokens/spacing';
import { colors } from '../../../design-system/tokens/colors';
export function ShowcaseCard({
  title,
  subtitle,
  imageId,
  onPress,
}: {
  title: string;
  subtitle: string;
  imageId?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Explore ${title}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <ContentMedia imageId={imageId} title={title} />
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
