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
  compact?: boolean;
  round?: boolean;
}
export function Button({
  label,
  variant = 'primary',
  loading = false,
  compact = false,
  round = false,
  disabled,
  ...props
}: Props) {
  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel ?? label}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        compact && styles.compact,
        round && styles.round,
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
        {round ? '→' : label}
      </AppText>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  round: { width: 52, height: 52, borderRadius: 26, paddingHorizontal: 0 },
  compact: { minHeight: 44, paddingHorizontal: 12, paddingVertical: 8 },
  primary: { backgroundColor: colors.primary },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  primaryText: { color: colors.onPrimary, textAlign: 'center', flexShrink: 1 },
  secondaryText: { color: colors.text, textAlign: 'center', flexShrink: 1 },
  dimmed: { opacity: 0.65 },
});
