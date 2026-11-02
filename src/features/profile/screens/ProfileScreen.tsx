import React from 'react';
import { View } from 'react-native';
import type { RootScreenProps } from '../../../app/navigation/types';
import { AppText, Button, Card } from '../../../design-system/components';
import { Screen } from '../../../shared/components/Screen';
import { useDemoSnapshot } from '../../auth/data/AuthRepositoryProvider';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { selectAuthEntry, setDemoAccess } from '../../auth/state/authSlice';
import {
  Avatar,
  AccountRow,
  GuestPrompt,
  accountStyles as s,
} from '../../account/components/AccountPrimitives';
export function ProfileScreen({ navigation }: RootScreenProps<'Profile'>) {
  const { profile, savedProjects, quotations, notifications } =
    useDemoSnapshot();
  const dispatch = useAppDispatch();
  const { saving, error } = useAppSelector(state => state.auth);
  return (
    <Screen>
      <Card>
        <View style={s.row}>
          <Avatar profile={profile} />
          <View style={s.flex}>
            <AppText variant="heading">
              {profile?.name ?? 'Guest Visitor'}
            </AppText>
            <AppText muted>
              {profile?.email ?? 'Welcome to Champion Group'}
            </AppText>
            {profile && <AppText muted>{profile.phone}</AppText>}
          </View>
        </View>
        <View style={s.badge}>
          <AppText variant="caption" style={s.accent}>
            {profile
              ? 'Demo Account · Stored on this device'
              : 'Guest · Browse our work'}
          </AppText>
        </View>
      </Card>
      <Button
        label="Get a Quote"
        onPress={() => navigation.navigate('GetQuote')}
      />
      {!profile && <GuestPrompt />}
      {profile && (
        <>
          <AppText variant="label">My Account</AppText>
          <Card style={s.menu}>
            <AccountRow
              title="Edit Profile"
              detail="Your details and initials avatar"
              onPress={() => navigation.navigate('EditProfile')}
            />
            <AccountRow
              title="Change Password"
              onPress={() => navigation.navigate('ChangePassword')}
            />
            <AccountRow
              title="My Quotations"
              detail={`${quotations.length} local demo requests`}
              onPress={() => navigation.navigate('MyQuotations')}
            />
            <AccountRow
              title="Saved Projects"
              detail={`${savedProjects.length} saved`}
              onPress={() => navigation.navigate('SavedProjects')}
            />
            <AccountRow
              title="Notifications"
              detail={`${
                notifications.filter(n => !n.read).length
              } unread · Local only`}
              onPress={() => navigation.navigate('Notifications')}
            />
          </Card>
        </>
      )}
      <AppText variant="label">Support & Information</AppText>
      <Card style={s.menu}>
        <AccountRow
          title="App Settings"
          onPress={() => navigation.navigate('AppSettings')}
        />
        <AccountRow
          title="Help & Support"
          onPress={() => navigation.navigate('HelpSupport')}
        />
        <AccountRow
          title="About Champion Group"
          onPress={() => navigation.navigate('AboutUs')}
        />
        <AccountRow
          title="Privacy Policy"
          onPress={() =>
            navigation.navigate('LegalDocument', { kind: 'privacy' })
          }
        />
        <AccountRow
          title="Terms & Conditions"
          onPress={() =>
            navigation.navigate('LegalDocument', { kind: 'terms' })
          }
        />
      </Card>
      {error && <AppText accessibilityRole="alert">{error}</AppText>}
      {profile && (
        <Button
          label="Logout of Demo"
          loading={saving}
          onPress={() => {
            dispatch(selectAuthEntry('Welcome'));
            dispatch(setDemoAccess(null));
          }}
        />
      )}
    </Screen>
  );
}
