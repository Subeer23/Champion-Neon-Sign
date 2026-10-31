import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { AppText } from './AppText';
import { Button } from './Button';
export function Header({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.surface}>
      <View style={styles.row}>
        {onBack && (
          <Button
            label="Back"
            accessibilityLabel="Go back"
            variant="secondary"
            onPress={onBack}
          />
        )}
        <AppText
          variant="heading"
          accessibilityRole="header"
          style={styles.title}
        >
          {title}
        </AppText>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  surface: { backgroundColor: colors.surface },
  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { flex: 1 },
});
