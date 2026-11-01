import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { RootScreenProps } from '../../../app/navigation/types';
import { AppText, Button } from '../../../design-system/components';
import { colors } from '../../../design-system/tokens/colors';
import { AuthFrame, FormInput } from '../../auth/components/AuthPrimitives';
import {
  useAuthRepository,
  useDemoSnapshot,
} from '../../auth/data/AuthRepositoryProvider';
import { useAsyncAction } from '../../../shared/hooks/useAsyncAction';
import { Avatar, GuestPrompt } from '../components/AccountPrimitives';
import type { DemoProfile } from '../domain/models';
export function EditProfileScreen({
  navigation,
}: RootScreenProps<'EditProfile'>) {
  const { profile } = useDemoSnapshot();
  const repository = useAuthRepository();
  const action = useAsyncAction();
  const [name, setName] = useState(profile?.name ?? '');
  const [email, setEmail] = useState(profile?.email ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [avatar, setAvatar] = useState<DemoProfile['avatar']>(
    profile?.avatar ?? 'red',
  );
  const [success, setSuccess] = useState(false);
  return (
    <AuthFrame title="Edit Profile" onBack={navigation.goBack}>
      {!profile ? (
        <GuestPrompt />
      ) : (
        <>
          <View style={styles.center}>
            <Avatar profile={{ ...profile, name, avatar }} />
            <AppText muted variant="caption">
              Initials update with your name
            </AppText>
          </View>
          <View style={styles.options}>
            {(['red', 'charcoal', 'white'] as const).map(value => (
              <Pressable
                key={value}
                accessibilityRole="radio"
                accessibilityLabel={`${value} avatar`}
                accessibilityState={{ selected: avatar === value }}
                onPress={() => {
                  setAvatar(value);
                  setSuccess(false);
                }}
                style={[styles.option, avatar === value && styles.selected]}
              >
                <AppText>{value}</AppText>
              </Pressable>
            ))}
          </View>
          <FormInput
            label="Full Name"
            icon="user"
            value={name}
            onChangeText={v => {
              setName(v);
              setSuccess(false);
            }}
            editable={!action.busy}
          />
          <FormInput
            label="Email Address"
            value={email}
            keyboardType="email-address"
            onChangeText={v => {
              setEmail(v);
              setSuccess(false);
            }}
            editable={!action.busy}
          />
          <FormInput
            label="Phone Number"
            icon="phone"
            value={phone}
            keyboardType="phone-pad"
            onChangeText={v => {
              setPhone(v);
              setSuccess(false);
            }}
            editable={!action.busy}
          />
          <AppText muted variant="caption">
            Changes apply to your local demo account only. Use sample personal
            details.
          </AppText>
          {action.error && (
            <AppText accessibilityRole="alert">{action.error}</AppText>
          )}
          {success && (
            <AppText accessibilityLiveRegion="polite">
              Profile updated on this device.
            </AppText>
          )}
          <Button
            label="Save Profile"
            loading={action.busy}
            onPress={() =>
              action.run(async () => {
                setSuccess(false);
                await repository.updateProfile({ name, email, phone, avatar });
                setSuccess(true);
              })
            }
          />
        </>
      )}
    </AuthFrame>
  );
}
export function ChangePasswordScreen({
  navigation,
}: RootScreenProps<'ChangePassword'>) {
  const { profile } = useDemoSnapshot();
  const repository = useAuthRepository();
  const action = useAsyncAction();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [success, setSuccess] = useState(false);
  return (
    <AuthFrame title="Change Password" onBack={navigation.goBack}>
      {!profile ? (
        <GuestPrompt />
      ) : (
        <>
          <AppText variant="heading">Update your demo password</AppText>
          <AppText muted>
            Use 8–128 characters, an uppercase letter, number and special
            character. Never reuse a real account password.
          </AppText>
          <FormInput
            label="Current Password"
            icon="lock"
            secret
            value={current}
            onChangeText={v => {
              setCurrent(v);
              setSuccess(false);
            }}
            editable={!action.busy}
          />
          <FormInput
            label="New Password"
            icon="lock"
            secret
            value={next}
            onChangeText={v => {
              setNext(v);
              setSuccess(false);
            }}
            editable={!action.busy}
          />
          <FormInput
            label="Confirm New Password"
            icon="lock"
            secret
            value={confirm}
            onChangeText={v => {
              setConfirm(v);
              setSuccess(false);
            }}
            editable={!action.busy}
          />
          {action.error && (
            <AppText accessibilityRole="alert">{action.error}</AppText>
          )}
          {success && (
            <AppText accessibilityLiveRegion="polite">
              Your local demo password has been changed.
            </AppText>
          )}
          <Button
            label="Change Demo Password"
            loading={action.busy}
            onPress={() =>
              action.run(async () => {
                setSuccess(false);
                if (next !== confirm) throw new Error('Passwords must match.');
                await repository.changePassword(current, next);
                setCurrent('');
                setNext('');
                setConfirm('');
                setSuccess(true);
              })
            }
          />
        </>
      )}
    </AuthFrame>
  );
}
const styles = StyleSheet.create({
  center: { alignItems: 'center', gap: 12 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: {
    padding: 12,
    minHeight: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySubtle,
  },
});
