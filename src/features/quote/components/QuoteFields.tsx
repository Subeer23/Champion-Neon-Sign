import type { IconName } from '../../../shared/components/LineIcon';
import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { AppText } from '../../../design-system/components';
import { colors } from '../../../design-system/tokens/colors';
import { FormInput } from '../../auth/components/AuthPrimitives';
import { solutionFixtures } from '../../../mocks/fixtures/solutions';
import type { QuoteFormData } from '../domain/Quote';

const fieldPresentation: Partial<
  Record<keyof QuoteFormData, { icon: IconName; placeholder: string }>
> = {
  title: {
    icon: 'briefcase',
    placeholder: 'e.g. Illuminated storefront signage',
  },
  description: {
    icon: 'file-text',
    placeholder: 'Describe your project, size and materials',
  },
  location: { icon: 'pin', placeholder: 'e.g. Dubai, UAE' },
  budget: { icon: 'wallet', placeholder: 'e.g. AED 10,000–25,000' },
  completionDate: { icon: 'calendar', placeholder: 'YYYY-MM-DD' },
  additional: {
    icon: 'clipboard',
    placeholder: 'Any installation or design preferences?',
  },
  name: { icon: 'user', placeholder: 'Enter your full name' },
  company: { icon: 'building', placeholder: 'Enter your company name' },
  email: { icon: 'mail', placeholder: 'name@example.com' },
  phone: { icon: 'phone', placeholder: '+971 50 123 4567' },
};

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
      icon={fieldPresentation[field]?.icon ?? 'file-text'}
      placeholder={fieldPresentation[field]?.placeholder ?? label}
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
