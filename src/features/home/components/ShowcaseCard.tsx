import React from 'react';
import {
  Pressable,
  View,
  StyleSheet,
  type ImageSourcePropType,
} from 'react-native';
import { BrandImage } from '../../../design-system/components/BrandImage';
import { AppText } from '../../../design-system/components';
import { colors } from '../../../design-system/tokens/colors';
export function ShowcaseCard({
  title,
  subtitle,
  image,
  onPress,
  compact = false,
}: {
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
  onPress: () => void;
  compact?: boolean;
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
        style={[styles.image, compact && styles.compact]}
      />
      <View style={styles.body}>
        <View style={styles.copy}>
          <AppText variant="heading">{title}</AppText>
          <AppText variant="caption" muted>
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
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.8 },
  image: { width: '100%', height: 210 },
  compact: { height: 140 },
  body: { padding: 18, gap: 12, flexDirection: 'row', alignItems: 'center' },
  copy: { flex: 1, gap: 4 },
  arrow: { color: colors.primary, fontSize: 26 },
});
