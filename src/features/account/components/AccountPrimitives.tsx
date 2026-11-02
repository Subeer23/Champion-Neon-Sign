import { usePressGuard } from '../../../shared/hooks/usePressGuard';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Button, Card } from '../../../design-system/components';
import { colors } from '../../../design-system/tokens/colors';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { selectAuthEntry, setDemoAccess } from '../../auth/state/authSlice';
import type { DemoProfile } from '../domain/models';
export function Avatar({ profile }: { profile: DemoProfile | null }) {
  const initials =
    profile?.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(word => word[0])
      .join('')
      .toUpperCase() || 'CG';
  const backgroundColor =
    profile?.avatar === 'white'
      ? colors.logoPlate
      : profile?.avatar === 'charcoal'
      ? colors.surfaceSecondary
      : colors.primary;
  return (
    <View
      accessibilityLabel={
        profile ? `${profile.name} initials avatar` : 'Guest avatar'
      }
      style={[styles.avatar, { backgroundColor }]}
    >
      <AppText
        style={[styles.initials, profile?.avatar === 'white' && styles.red]}
      >
        {initials}
      </AppText>
    </View>
  );
}
export function GuestPrompt() {
  const dispatch = useAppDispatch();
  const { saving, error } = useAppSelector(state => state.auth);
  const enter = (entry: 'Login' | 'SignUp') => {
    dispatch(selectAuthEntry(entry));
    dispatch(setDemoAccess(null));
  };
  return (
    <Card>
      <AppText variant="heading">Your own demo space</AppText>
      <AppText muted>
        Login or create a local demo account to save projects, manage your
        profile and keep quotation drafts. Public company content is available
        as a guest.
      </AppText>
      {error && <AppText accessibilityRole="alert">{error}</AppText>}
      <Button label="Login" loading={saving} onPress={() => enter('Login')} />
      <Button
        label="Sign Up"
        variant="secondary"
        disabled={saving}
        onPress={() => enter('SignUp')}
      />
    </Card>
  );
}
export function AccountRow({
  title,
  detail,
  onPress,
}: {
  title: string;
  detail?: string;
  onPress: () => void;
}) {
  const guardedPress = usePressGuard(onPress);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={guardedPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.copy}>
        <AppText variant="label">{title}</AppText>
        {detail && (
          <AppText variant="caption" muted>
            {detail}
          </AppText>
        )}
      </View>
      <AppText style={styles.chevron}>›</AppText>
    </Pressable>
  );
}
export function AccountEmpty({ title, body }: { title: string; body: string }) {
  return (
    <Card>
      <View style={styles.emptyAccent} />
      <AppText variant="heading">{title}</AppText>
      <AppText muted>{body}</AppText>
    </Card>
  );
}
export const accountStyles = StyleSheet.create({
  section: { gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  flex: { flex: 1, minWidth: 0 },
  accent: { color: colors.accentOnDark },
  success: { color: colors.text },
  menu: { padding: 0, gap: 0 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
});
const styles = StyleSheet.create({
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { fontFamily: 'Manrope-Bold', fontSize: 24, color: colors.text },
  red: { color: colors.primary },
  row: {
    minHeight: 64,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  copy: { flex: 1, gap: 4 },
  chevron: { fontSize: 24, color: colors.accentOnDark },
  pressed: { backgroundColor: colors.surfaceSecondary },
  emptyAccent: { width: 32, height: 3, backgroundColor: colors.primary },
});
