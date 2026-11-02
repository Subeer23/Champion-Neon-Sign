import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { AppText } from '../../../design-system/components';
import { colors } from '../../../design-system/tokens/colors';
import { FormInput } from '../../auth/components/AuthPrimitives';
import { solutionFixtures } from '../../../mocks/fixtures/solutions';
import type { QuoteFormData } from '../domain/Quote';

export const QuoteField = memo(function QuoteFieldView({
  field,
  label,
  value,
  editable,
  multiline,
  onChange,
}: {
  field: keyof QuoteFormData;
  label: string;
  value: string;
  editable: boolean;
  multiline: boolean;
  onChange: (field: keyof QuoteFormData, value: string) => void;
}) {
  const change = useCallback(
    (text: string) => onChange(field, text),
    [field, onChange],
  );
  return (
    <FormInput
      label={label}
      value={value}
      editable={editable}
      onChangeText={change}
      maxLength={3000}
      multiline={multiline}
      keyboardType={
        field === 'email'
          ? 'email-address'
          : field === 'phone'
          ? 'phone-pad'
          : 'default'
      }
    />
  );
});
const SolutionChoice = memo(function SolutionChoiceView({
  id,
  title,
  selected,
  disabled,
  onSelect,
}: {
  id: string;
  title: string;
  selected: boolean;
  disabled: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={title}
      accessibilityState={{ checked: selected, disabled }}
      disabled={disabled}
      onPress={() => onSelect(id)}
      style={[styles.choice, selected && styles.selected]}
    >
      <AppText variant="heading">{title}</AppText>
      <AppText muted>{selected ? 'Selected •' : 'Tap to select'}</AppText>
    </Pressable>
  );
});
export const SolutionChoices = memo(function SolutionChoicesView({
  selectedId,
  disabled,
  onSelect,
}: {
  selectedId: string;
  disabled: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      {solutionFixtures.map(solution => (
        <SolutionChoice
          key={solution.id}
          id={solution.id}
          title={solution.title}
          selected={selectedId === solution.id}
          disabled={disabled}
          onSelect={onSelect}
        />
      ))}
    </>
  );
});
const styles = StyleSheet.create({
  choice: {
    padding: 18,
    gap: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySubtle,
  },
});
