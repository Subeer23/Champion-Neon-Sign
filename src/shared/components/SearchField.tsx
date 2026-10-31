import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { colors } from '../../design-system/tokens/colors';
export function SearchField({
  value,
  onChangeText,
  label,
}: {
  value: string;
  onChangeText: (text: string) => void;
  label: string;
}) {
  return (
    <TextInput
      accessibilityLabel={label}
      placeholder={label}
      value={value}
      onChangeText={onChangeText}
      autoCorrect={false}
      autoCapitalize="none"
      returnKeyType="search"
      clearButtonMode="while-editing"
      placeholderTextColor={colors.muted}
      style={styles.input}
    />
  );
}
const styles = StyleSheet.create({
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.text,
    backgroundColor: colors.surface,
    fontFamily: 'Manrope-Regular',
    fontSize: 15,
  },
});
