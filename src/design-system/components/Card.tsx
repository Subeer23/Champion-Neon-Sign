import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import { colors } from '../tokens/colors';
import { radii, spacing } from '../tokens/spacing';
export function Card({ style, ...props }: ViewProps) {
  return <View {...props} style={[styles.card, style]} />;
}
const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
