import React, { useState, type PropsWithChildren } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, AppText } from '../../../design-system/components';
import { colors } from '../../../design-system/tokens/colors';
import { LineIcon, type IconName } from '../../../shared/components/LineIcon';
export function AuthFrame({
  title,
  onBack,
  children,
}: PropsWithChildren<{ title: string; onBack?: () => void }>) {
  return (
    <View style={styles.page}>
      <Header title={title} onBack={onBack} />
      <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.page}>
        <KeyboardAvoidingView
          style={styles.page}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentInsetAdjustmentBehavior="never"
            automaticallyAdjustContentInsets={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={styles.content}
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
export function DemoNotice() {
  return (
    <AppText variant="caption" muted>
      Demo only · Accounts and profile details stay on this device. Passwords
      are hashed, but this is not production security. Use sample details and a
      unique demo password.
    </AppText>
  );
}
export function FormInput({
  label,
  secret = false,
  icon = 'mail',
  style,
  ...props
}: TextInputProps & { label: string; secret?: boolean; icon?: IconName }) {
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.field}>
      <AppText variant="caption" muted>
        {label}
      </AppText>
      <View style={styles.inputRow}>
        <LineIcon name={icon} size={18} color={colors.muted} />
        <TextInput
          {...props}
          accessibilityLabel={label}
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={secret && !visible}
          style={[styles.input, style]}
        />
        {secret && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${
              visible ? 'Hide' : 'Show'
            } ${label.toLowerCase()}`}
            accessibilityState={{ expanded: visible }}
            onPress={() => setVisible(!visible)}
            style={styles.eye}
          >
            <AppText variant="caption" muted>
              {visible ? 'Hide' : 'Show'}
            </AppText>
          </Pressable>
        )}
      </View>
    </View>
  );
}
export function TextLink({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.link}
    >
      <AppText variant="label" style={styles.accent}>
        {label}
      </AppText>
    </Pressable>
  );
}
export function AuthEmblem({ success = false }: { success?: boolean }) {
  return (
    <View style={styles.emblem}>
      <LineIcon name={success ? 'check' : 'lock'} size={48} />
    </View>
  );
}
export const authStyles = StyleSheet.create({
  heading: { marginTop: 12 },
  centered: { textAlign: 'center' },
  accent: { color: colors.primary },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  flex: { flex: 1 },
  space: { flex: 1, minHeight: 12 },
  error: { color: colors.accentOnDark },
});
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: {
    flexGrow: 1,
    padding: 24,
    gap: 18,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  field: { gap: 8 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    gap: 10,
  },
  input: {
    flex: 1,
    minWidth: 0,
    color: colors.text,
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    minHeight: 48,
    paddingVertical: 12,
  },
  eye: { paddingVertical: 14, minWidth: 44, alignItems: 'center' },
  link: { paddingVertical: 12, minHeight: 44 },
  accent: { color: colors.accentOnDark },
  emblem: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
});
