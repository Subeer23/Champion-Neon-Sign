import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { AppText } from './AppText';
import { IconButton } from '../../shared/components/IconButton';
export function Header({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.surface,
        {
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.side}>
          {onBack && <IconButton label="Go back" onPress={onBack} />}
        </View>
        <AppText
          variant="heading"
          accessibilityRole="header"
          style={styles.title}
        >
          {title}
        </AppText>
        <View style={styles.side} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  surface: { backgroundColor: colors.background },
  row: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: 20,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  side: { width: 44 },
  title: { flex: 1, textAlign: 'center', fontSize: 16, lineHeight: 24 },
});
