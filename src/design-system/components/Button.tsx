import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
} from 'react-native';
import { colors } from '../tokens/colors';
import { radii, spacing } from '../tokens/spacing';
import { AppText } from './AppText';
interface Props extends Omit<PressableProps, 'children' | 'style'> {
  label: string;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}
export function Button({
  label,
  variant = 'primary',
  loading = false,
  disabled,
  ...props
}: Props) {
  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        (pressed || disabled || loading) && styles.dimmed,
      ]}
    >
      {loading && (
        <ActivityIndicator
          color={variant === 'primary' ? colors.onPrimary : colors.primary}
        />
      )}
      <AppText
        variant="label"
        style={
          variant === 'primary' ? styles.primaryText : styles.secondaryText
        }
      >
        {label}
      </AppText>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  primary: { backgroundColor: colors.primary },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  primaryText: { color: colors.onPrimary },
  secondaryText: { color: colors.dark },
  dimmed: { opacity: 0.65 },
});
