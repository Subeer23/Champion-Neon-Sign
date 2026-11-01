import React from 'react';
import { Alert, Linking, Switch, View } from 'react-native';
import type { RootScreenProps } from '../../../app/navigation/types';
import { AppText, Button, Card } from '../../../design-system/components';
import { Screen } from '../../../shared/components/Screen';
import { colors } from '../../../design-system/tokens/colors';
import {
  useAuthRepository,
  useDemoSnapshot,
} from '../../auth/data/AuthRepositoryProvider';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import {
  clearLocalDemo,
  selectAuthEntry,
  setDemoAccess,
} from '../../auth/state/authSlice';
import { useAsyncAction } from '../../../shared/hooks/useAsyncAction';
import {
  AccountEmpty,
  AccountRow,
  GuestPrompt,
  accountStyles as s,
} from '../components/AccountPrimitives';
import { companyContent } from '../../../mocks/fixtures/company';
import { openContactLink } from '../../contact/services/openContactLink';
import { version } from '../../../../package.json';
export function AppSettingsScreen({
  navigation,
}: RootScreenProps<'AppSettings'>) {
  const { profile, notificationsEnabled } = useDemoSnapshot();
  const repo = useAuthRepository();
  const action = useAsyncAction();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(state => state.auth);
  return (
    <Screen>
      <AppText variant="title">Make it yours</AppText>
      {profile ? (
        <Card>
          <View style={s.row}>
            <View style={s.flex}>
              <AppText variant="label">Local notifications</AppText>
              <AppText muted variant="caption">
                Show updates for new demo quotation drafts. No push or system
                permission.
              </AppText>
            </View>
            <Switch
              accessibilityLabel="Local demo notifications"
              disabled={action.busy}
              value={notificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              onValueChange={value =>
                action.run(() => repo.setNotificationsEnabled(value))
              }
            />
          </View>
        </Card>
      ) : (
        <GuestPrompt />
      )}
      <Card>
        <AppText variant="heading">Appearance</AppText>
        <AppText muted>Champion Red & Black · Manrope</AppText>
        <AppText variant="caption" muted>
          The client demo uses the official dark theme.
        </AppText>
      </Card>
      <Card>
        <AppText variant="heading">App Information</AppText>
        <AppText>Champion Group · {version}</AppText>
        <AppText muted>
          Local client demo. Accounts, saved projects and quotation drafts stay
          on this device. This is not production account security.
        </AppText>
      </Card>
      <Card style={s.menu}>
        <AccountRow
          title="Help & Support"
          onPress={() => navigation.navigate('HelpSupport')}
        />
      </Card>
      {(action.error || auth.error) && (
        <AppText accessibilityRole="alert">
          {action.error || auth.error}
        </AppText>
      )}
      <Button
        label="Clear demo data"
        variant="secondary"
        loading={auth.saving}
        disabled={action.busy}
        onPress={() =>
          Alert.alert(
            'Clear all demo data?',
            'This removes ALL local demo accounts, sessions, profiles, saved projects, quotation drafts and notifications on this device. Onboarding and company content are kept.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Clear demo data',
                style: 'destructive',
                onPress: () => dispatch(clearLocalDemo()),
              },
            ],
          )
        }
      />
      {profile && (
        <Button
          label="Logout of Demo"
          loading={auth.saving}
          onPress={() => {
            dispatch(selectAuthEntry('Welcome'));
            dispatch(setDemoAccess(null));
          }}
        />
      )}
    </Screen>
  );
}
export function HelpSupportScreen({
  navigation,
}: RootScreenProps<'HelpSupport'>) {
  const action = useAsyncAction();
  const contact = companyContent.contact;
  return (
    <Screen>
      <AppText variant="title">Let’s work together.</AppText>
      <AppText muted>
        Reach Champion Group through its verified contact channels.
      </AppText>
      <Card>
        <AppText variant="heading">Champion Group</AppText>
        <AppText>{contact.address}</AppText>
        <AppText>{contact.phone}</AppText>
        <AppText>{contact.email}</AppText>
      </Card>
      {action.error && (
        <AppText accessibilityRole="alert">{action.error}</AppText>
      )}
      <Button
        label="Call Champion Group"
        loading={action.busy}
        onPress={() => action.run(() => openContactLink(contact.telephoneUrl))}
      />
      <Button
        label="Email Champion Group"
        disabled={action.busy}
        variant="secondary"
        onPress={() =>
          action.run(() => openContactLink(`mailto:${contact.email}`))
        }
      />
      <Button
        label="Chat on WhatsApp"
        disabled={action.busy}
        variant="secondary"
        onPress={() => action.run(() => openContactLink(contact.whatsappUrl))}
      />
      <Button
        label="Open Maps"
        disabled={action.busy}
        variant="secondary"
        onPress={() => action.run(() => openContactLink(contact.mapsUrl))}
      />
      <Button
        label="Frequently Asked Questions"
        variant="secondary"
        onPress={() => navigation.navigate('FAQs')}
      />
    </Screen>
  );
}
export function LegalDocumentScreen({
  route,
  navigation,
}: RootScreenProps<'LegalDocument'>) {
  const action = useAsyncAction();
  const privacy = route.params.kind === 'privacy';
  return (
    <Screen>
      <AppText variant="title">
        {privacy ? 'Privacy Policy' : 'Terms & Conditions'}
      </AppText>
      {privacy ? (
        <>
          <AppText muted>
            The official website publishes a Privacy Policy page. It contains
            website/template wording and is not an app-specific policy. You can
            review the original page in your browser.
          </AppText>
          <Button
            label="Open official Privacy Policy"
            loading={action.busy}
            onPress={() =>
              action.run(async () => {
                await Linking.openURL(
                  'https://championgroup.ae/privacy-policy/',
                );
              })
            }
          />
        </>
      ) : (
        <AccountEmpty
          title="Official terms unavailable"
          body="A published Terms & Conditions document could not be verified on the official website. No replacement legal terms have been invented for this demo. Please contact Champion Group for the appropriate document."
        />
      )}
      {action.error && (
        <AppText accessibilityRole="alert">
          Unable to open the document. Check your browser and connection, then
          retry.
        </AppText>
      )}
      <Card>
        <AppText variant="heading">About this local demo</AppText>
        <AppText muted>
          Demo accounts, profile details and drafts are stored on your device.
          No real SMS, emails, quotations or push messages are sent. Clear demo
          data in Settings removes these local records. Use sample details and a
          unique demo password.
        </AppText>
      </Card>
      <Button
        label="Contact Champion Group"
        variant="secondary"
        onPress={() => navigation.navigate('ContactUs')}
      />
    </Screen>
  );
}
