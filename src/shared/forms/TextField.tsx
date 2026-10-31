import React from 'react';
import { TextInput, View, StyleSheet, type TextInputProps } from 'react-native';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { AppText } from '../../design-system/components';
import { colors } from '../../design-system/tokens/colors';
import { radii, spacing } from '../../design-system/tokens/spacing';
import { typography } from '../../design-system/tokens/typography';
type Props<T extends FieldValues> = Omit<
  TextInputProps,
  'value' | 'onChangeText' | 'onBlur'
> & { control: Control<T>; name: FieldPath<T>; label: string };
/** Form primitive only. Full quotation forms are intentionally deferred. */
export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  ...props
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <View style={styles.container}>
          <AppText variant="label">{label}</AppText>
          <TextInput
            {...props}
            ref={field.ref}
            accessibilityLabel={label}
            value={typeof field.value === 'string' ? field.value : ''}
            onBlur={field.onBlur}
            onChangeText={field.onChange}
            style={[styles.input, props.style]}
          />
          {fieldState.error && (
            <AppText accessibilityRole="alert" variant="caption">
              {fieldState.error.message}
            </AppText>
          )}
        </View>
      )}
    />
  );
}
const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  input: {
    ...typography.body,
    minHeight: 48,
    color: colors.text,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    padding: spacing.md,
  },
});
