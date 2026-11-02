import { usePressGuard } from '../../../shared/hooks/usePressGuard';
import { SolutionIcon } from '../../../shared/components/SolutionIcon';
import React from 'react';
import { Pressable, View, StyleSheet, useWindowDimensions } from 'react-native';
import { ContentMedia } from '../../../shared/components/ContentMedia';
import { AppText } from '../../../design-system/components';
import { radii, spacing } from '../../../design-system/tokens/spacing';
import { colors } from '../../../design-system/tokens/colors';
export function ShowcaseCard({
  title,
  subtitle,
  imageId,
  onPress,
  compact = false,
  mediaHeight,
}: {
  title: string;
  subtitle: string;
  imageId?: string;
  onPress: () => void;
  compact?: boolean;
  mediaHeight?: number;
}) {
  const guardedPress = usePressGuard(onPress);
  const { fontScale } = useWindowDimensions();
  const expanded = fontScale > 1.3;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Explore ${title}`}
      accessibilityHint={compact ? undefined : subtitle}
      onPress={guardedPress}
      style={({ pressed }) => [
        styles.card,
        compact && styles.compact,
        pressed && styles.pressed,
      ]}
    >
      {compact ? (
        <SolutionIcon title={title} />
      ) : (
        <ContentMedia imageId={imageId} title={title} height={mediaHeight} />
      )}
      <View style={[styles.body, compact && styles.compactBody]}>
        <View style={styles.copy}>
          <AppText
            variant="heading"
            numberOfLines={expanded ? undefined : 2}
            style={[
              styles.title,
              !compact && { minHeight: 44 * fontScale },
              compact && styles.compactTitle,
            ]}
          >
            {title}
          </AppText>
          {!compact && (
            <AppText
              muted
              numberOfLines={expanded ? undefined : 2}
              style={[styles.description, { minHeight: 38 * fontScale }]}
            >
              {subtitle}
            </AppText>
          )}
        </View>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  compact: { padding: 12, gap: 10, alignItems: 'center', minHeight: 108 },
  compactBody: { padding: 0 },
  compactTitle: { fontSize: 12, lineHeight: 18, textAlign: 'center' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    flex: 1,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.88, borderColor: colors.primary },
  title: { fontSize: 16, lineHeight: 22 },
  description: { fontSize: 12, lineHeight: 19 },
  body: {
    padding: 12,
    gap: spacing.sm,
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  copy: { flex: 1, gap: spacing.sm },
});
