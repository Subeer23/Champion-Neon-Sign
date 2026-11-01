import {
  useAuthRepository,
  useDemoSnapshot,
} from '../../auth/data/AuthRepositoryProvider';
import { useAsyncAction } from '../../../shared/hooks/useAsyncAction';
import { GuestPrompt } from '../../account/components/AccountPrimitives';
import { localId } from '../../account/data/LocalDemoRepository';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { RootScreenProps } from '../../../app/navigation/types';
import { AppText, Button, Card } from '../../../design-system/components';
import { colors } from '../../../design-system/tokens/colors';
import { AuthFrame, FormInput } from '../../auth/components/AuthPrimitives';
import { validEmail } from '../../auth/domain/AuthRepository';
import { solutionFixtures } from '../../../mocks/fixtures/solutions';
import { projectFixtures } from '../../../mocks/fixtures/projects';
export function GetQuoteScreen({
  route,
  navigation,
}: RootScreenProps<'GetQuote'>) {
  const { profile } = useDemoSnapshot();
  const repository = useAuthRepository();
  const action = useAsyncAction();
  const [requestId, setRequestId] = useState(localId);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [name, setName] = useState(profile?.name ?? '');
  const [email, setEmail] = useState(profile?.email ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [message, setMessage] = useState('');
  const [solution, setSolution] = useState(route.params?.solutionId ?? '');
  const [selecting, setSelecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const project = projectFixtures.find(
    item => item.id === route.params?.projectId,
  );
  const selected = solutionFixtures.find(item => item.id === solution);
  return (
    <AuthFrame title="Get a Quote" onBack={navigation.goBack}>
      <AppText muted>Fill in sample details to preview your request.</AppText>
      <AppText variant="caption" style={styles.notice}>
        Demo form · Preview or save a local draft. Nothing is submitted or sent.
        Use sample contact details.
      </AppText>
      {project && <AppText variant="label">Project: {project.title}</AppText>}
      <FormInput
        editable={!action.busy && !savedId}
        label="Full Name"
        icon="user"
        placeholder="Demo Visitor"
        value={name}
        onChangeText={setName}
      />
      <FormInput
        editable={!action.busy && !savedId}
        label="Email Address"
        placeholder="demo@example.com"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <FormInput
        editable={!action.busy && !savedId}
        label="Phone Number"
        icon="phone"
        placeholder="Sample phone number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <AppText variant="caption" muted>
        Project Type
      </AppText>
      <Pressable
        disabled={action.busy || Boolean(savedId)}
        accessibilityRole="button"
        accessibilityLabel="Select a service"
        accessibilityState={{ expanded: selecting }}
        onPress={() => setSelecting(!selecting)}
        style={styles.select}
      >
        <AppText>{selected?.title ?? 'Select a service'}</AppText>
        <AppText muted>⌄</AppText>
      </Pressable>
      {selecting && (
        <View style={styles.choices}>
          {solutionFixtures.map(item => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={`Choose ${item.title}`}
              accessibilityState={{ selected: solution === item.id }}
              onPress={() => {
                setSolution(item.id);
                setSelecting(false);
                setPreview(false);
              }}
              style={styles.choice}
            >
              <AppText
                variant="label"
                style={solution === item.id && styles.notice}
              >
                {item.title}
              </AppText>
            </Pressable>
          ))}
        </View>
      )}
      <FormInput
        editable={!action.busy && !savedId}
        label="Message"
        icon="mail"
        placeholder="Tell us about your sample project"
        multiline
        value={message}
        onChangeText={setMessage}
        style={styles.message}
      />
      {error && (
        <AppText accessibilityRole="alert" style={styles.notice}>
          {error}
        </AppText>
      )}
      <Button
        disabled={action.busy || Boolean(savedId)}
        label="Preview Request"
        onPress={() => {
          if (
            !name.trim() ||
            !validEmail(email) ||
            !solution ||
            !message.trim()
          ) {
            setPreview(false);
            setError('Complete the name, valid email, service and message.');
            return;
          }
          setError(null);
          setPreview(true);
        }}
      />
      {preview && (
        <Card>
          <AppText variant="heading">Preview ready — not submitted</AppText>
          <AppText>
            {selected?.title} · {name}
          </AppText>
          <AppText muted>{message}</AppText>
          <AppText variant="caption" muted>
            To request an actual quotation, contact Champion Group using the
            verified channels.
          </AppText>
        </Card>
      )}
      {preview &&
        !savedId &&
        (profile ? (
          <Button
            label="Save Demo Quotation"
            loading={action.busy}
            onPress={() =>
              action.run(async () => {
                const draft = await repository.saveQuotation(
                  {
                    name,
                    email: email.trim().toLowerCase(),
                    phone,
                    serviceId: solution,
                    message,
                    projectId: route.params?.projectId,
                  },
                  requestId,
                );
                setSavedId(draft.id);
              })
            }
          />
        ) : (
          <GuestPrompt />
        ))}
      {action.error && (
        <AppText accessibilityRole="alert">{action.error}</AppText>
      )}
      {savedId && (
        <Card>
          <AppText accessibilityLiveRegion="polite" variant="heading">
            Saved on this device
          </AppText>
          <AppText muted>
            Local demo draft only — not submitted to Champion Group.
          </AppText>
          <Button
            label="View Saved Quotation"
            onPress={() =>
              navigation.navigate('QuotationDetails', { quotationId: savedId })
            }
          />
          <Button
            label="Start another draft"
            variant="secondary"
            onPress={() => {
              setSavedId(null);
              setRequestId(localId());
              setMessage('');
              setPreview(false);
            }}
          />
        </Card>
      )}
      <Button
        label="Contact our team"
        variant="secondary"
        onPress={() => navigation.navigate('ContactUs')}
      />
    </AuthFrame>
  );
}
const styles = StyleSheet.create({
  notice: { color: colors.accentOnDark },
  select: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  choices: {
    gap: 4,
    padding: 8,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  choice: { minHeight: 44, padding: 12, justifyContent: 'center' },
  message: { minHeight: 112, textAlignVertical: 'top' },
});
