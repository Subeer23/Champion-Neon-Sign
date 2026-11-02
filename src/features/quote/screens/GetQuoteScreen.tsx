import { QuoteField, SolutionChoices } from '../components/QuoteFields';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { usePreventRemove } from '@react-navigation/native';
import type { RootScreenProps } from '../../../app/navigation/types';
import { AppText, Button, Card } from '../../../design-system/components';
import { colors } from '../../../design-system/tokens/colors';
import { AuthFrame } from '../../auth/components/AuthPrimitives';
import {
  useAuthRepository,
  useDemoSelector,
} from '../../auth/data/AuthRepositoryProvider';
import { useAsyncAction } from '../../../shared/hooks/useAsyncAction';
import { localId } from '../../account/data/LocalDemoRepository';
import { solutionFixtures } from '../../../mocks/fixtures/solutions';
import { projectFixtures } from '../../../mocks/fixtures/projects';
import {
  emptyQuoteForm,
  validateQuote,
  validateQuoteStep,
  type QuoteFormData,
} from '../domain/Quote';
import { useAppDispatch } from '../../../app/store/hooks';
import { selectAuthEntry, setDemoAccess } from '../../auth/state/authSlice';
import { guestQuoteHandoff } from '../state/guestQuoteHandoff';

const steps = [
  'Select Solution',
  'Project Requirements',
  'Contact Details',
  'Review Request',
];
export function GetQuoteScreen({
  route,
  navigation,
}: RootScreenProps<'GetQuote'>) {
  const profile = useDemoSelector(snapshot => snapshot.profile);
  const draftId = route.params?.draftId;
  const restored = useDemoSelector(snapshot =>
    snapshot.quotations.find(q => q.id === draftId && q.status === 'Draft'),
  );
  const repo = useAuthRepository();
  const dispatch = useAppDispatch();
  const action = useAsyncAction();
  const projectId = route.params?.projectId ?? restored?.form?.projectId;
  const project = useMemo(
    () => projectFixtures.find(p => p.id === projectId),
    [projectId],
  );
  const [id] = useState(() => restored?.id ?? localId());
  const [form, setForm] = useState<QuoteFormData>(() => ({
    ...emptyQuoteForm,
    name: profile?.name ?? '',
    email: profile?.email ?? '',
    phone: profile?.phone ?? '',
    solutionId: route.params?.solutionId ?? project?.solutionIds[0] ?? '',
    projectId: project?.id ?? '',
    ...restored?.form,
  }));
  const [step, setStep] = useState(restored?.step ?? 0);
  const [dirty, setDirty] = useState(false);
  const [finished, setFinished] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(Boolean(profile));
  const [restoreAttempt, setRestoreAttempt] = useState(0);
  const owner = useRef(profile?.id);
  useEffect(() => {
    if (owner.current) return;
    let active = true;
    guestQuoteHandoff
      .restore()
      .then(value => {
        if (active && value) {
          setForm(value.form);
          setStep(value.step);
          setDirty(true);
        }
        if (active) setReady(true);
      })
      .catch(() => {
        if (active) {
          setError(
            'Your guest draft could not be restored. Retry by reopening this screen.',
          );
        }
      });
    return () => {
      active = false;
    };
  }, [restoreAttempt]);
  const sessionChanged = owner.current !== profile?.id;
  usePreventRemove(dirty && !finished && !sessionChanged, ({ data }) => {
    Alert.alert(
      'Leave this request?',
      'Unsaved changes will be discarded. Choose Stay to save a draft first.',
      [
        { text: 'Stay', style: 'cancel' },
        {
          text: 'Discard changes',
          style: 'destructive',
          onPress: () => navigation.dispatch(data.action),
        },
      ],
    );
  });
  const update = useCallback((key: keyof QuoteFormData, value: string) => {
    setForm(current => ({ ...current, [key]: value }));
    setDirty(true);
    setError(null);
  }, []);
  const selectSolution = useCallback(
    (solutionId: string) => update('solutionId', solutionId),
    [update],
  );
  function continueStep() {
    const invalid = validateQuoteStep(form, step);
    setError(invalid);
    if (!invalid) setStep(step + 1);
  }
  const stickyContinue =
    step === 0 && Boolean(form.solutionId) && ready && !sessionChanged;
  function save(submit: boolean) {
    if (action.busy || sessionChanged) return;
    const invalid = submit ? validateQuote(form) : null;
    if (invalid) {
      setError(invalid);
      return;
    }
    action.run(async () => {
      const quote = submit
        ? await repo.submitQuote(form, id)
        : await repo.saveQuoteDraft(form, id, step);
      setDirty(false);
      if (submit) setFinished(quote.reference);
      else
        setError(
          'Draft saved on this device. Continue here or find it in My Quotations.',
        );
    });
  }
  function authenticate(entry: 'Login' | 'SignUp') {
    action.run(async () => {
      await guestQuoteHandoff.save({ form, step });
      setDirty(false);
      dispatch(selectAuthEntry(entry));
      await dispatch(setDemoAccess(null)).unwrap();
    });
  }
  const field = (
    key: keyof QuoteFormData,
    label: string,
    multiline = false,
  ) => (
    <QuoteField
      key={key}
      field={key}
      label={label}
      value={form[key]}
      editable={!action.busy && !sessionChanged}
      multiline={multiline}
      onChange={update}
    />
  );
  if (finished)
    return (
      <AuthFrame title="Request Saved">
        <AppText variant="title">Your next idea starts here.</AppText>
        <Card>
          <AppText variant="heading">Submitted (Demo)</AppText>
          <AppText selectable>{finished}</AppText>
          <AppText muted>
            Saved locally for demonstration. This request was not sent to
            Champion Group.
          </AppText>
        </Card>
        <Button
          label="View My Quotations"
          onPress={() => navigation.replace('MyQuotations')}
        />
        <Button
          label="Back to Home"
          variant="secondary"
          onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
        />
      </AuthFrame>
    );
  return (
    <AuthFrame
      title="Get a Quote"
      scrollKey={step}
      onBack={navigation.goBack}
      footer={
        stickyContinue ? (
          <View style={styles.footer}>
            <View style={styles.footerContent}>
              <Button
                label="Continue"
                disabled={action.busy}
                onPress={continueStep}
              />
            </View>
          </View>
        ) : undefined
      }
    >
      <AppText variant="caption" style={styles.accent}>
        YOUR VISION. OUR EXPERTISE.
      </AppText>
      <View style={styles.progress}>
        {steps.map((title, index) => (
          <View
            key={title}
            style={[styles.segment, index <= step && styles.active]}
          />
        ))}
      </View>
      <AppText variant="caption" muted>
        Step {step + 1} of 4
      </AppText>
      <AppText variant="title">{steps[step]}</AppText>
      <AppText muted>
        Demo only · Saved on this device. Nothing is sent to Champion Group.
      </AppText>
      {project && <AppText>Inspired by {project.title}</AppText>}
      {!ready && !error && <AppText muted>Restoring your draft…</AppText>}
      {!ready && error && (
        <Card>
          <AppText accessibilityRole="alert">{error}</AppText>
          <Button
            label="Retry draft restoration"
            onPress={() => {
              setError(null);
              setRestoreAttempt(value => value + 1);
            }}
          />
        </Card>
      )}
      {sessionChanged ? (
        <AppText accessibilityRole="alert">
          Your account changed. Reopen this form from your account.
        </AppText>
      ) : (
        ready && (
          <>
            {step === 0 && (
              <SolutionChoices
                selectedId={form.solutionId}
                disabled={action.busy}
                onSelect={selectSolution}
              />
            )}
            {step === 1 && (
              <>
                {field('title', 'Project title')}
                {field('description', 'Project description', true)}
                {field('location', 'Project location')}
                {field('budget', 'Estimated budget (optional)')}
                {field(
                  'completionDate',
                  'Required completion date (YYYY-MM-DD, optional)',
                )}
                {field(
                  'additional',
                  'Additional requirements (optional)',
                  true,
                )}
              </>
            )}
            {step === 2 && (
              <>
                {field('name', 'Full name')}
                {field('company', 'Company name (optional)')}
                {field('email', 'Email')}
                {field('phone', 'Phone number')}
                <AppText variant="label">Preferred contact method</AppText>
                <View style={styles.methods}>
                  {['Email', 'Phone', 'WhatsApp'].map(method => (
                    <Button
                      key={method}
                      label={method}
                      variant={
                        form.contactMethod === method ? 'primary' : 'secondary'
                      }
                      onPress={() => update('contactMethod', method)}
                      disabled={action.busy}
                    />
                  ))}
                </View>
              </>
            )}
            {step === 3 && (
              <>
                <Card>
                  <AppText variant="heading">Selected solution</AppText>
                  <AppText>
                    {
                      solutionFixtures.find(s => s.id === form.solutionId)
                        ?.title
                    }
                  </AppText>
                  <Button
                    label="Edit solution"
                    variant="secondary"
                    onPress={() => setStep(0)}
                  />
                </Card>
                <Card>
                  <AppText variant="heading">Project details</AppText>
                  {(
                    [
                      'title',
                      'description',
                      'location',
                      'budget',
                      'completionDate',
                      'additional',
                    ] as const
                  ).map(key => (
                    <AppText key={key}>
                      {
                        {
                          title: 'Title',
                          description: 'Description',
                          location: 'Location',
                          budget: 'Budget',
                          completionDate: 'Completion date',
                          additional: 'Additional requirements',
                        }[key]
                      }
                      : {form[key] || 'Not specified'}
                    </AppText>
                  ))}
                  <Button
                    label="Edit project"
                    variant="secondary"
                    onPress={() => setStep(1)}
                  />
                </Card>
                <Card>
                  <AppText variant="heading">Contact details</AppText>
                  <AppText>
                    {form.name} · {form.company || 'No company specified'}
                  </AppText>
                  <AppText>{form.email}</AppText>
                  <AppText>{form.phone}</AppText>
                  <AppText>Preferred contact: {form.contactMethod}</AppText>
                  <Button
                    label="Edit contact"
                    variant="secondary"
                    onPress={() => setStep(2)}
                  />
                </Card>
              </>
            )}
            {(error || action.error) && (
              <AppText accessibilityRole="alert" style={styles.accent}>
                {action.error || error}
              </AppText>
            )}
            {stickyContinue ? null : step < 3 ? (
              <Button
                label="Continue"
                disabled={action.busy}
                onPress={continueStep}
              />
            ) : (
              profile && (
                <Button
                  label="Submit Request"
                  loading={action.busy}
                  onPress={() => save(true)}
                />
              )
            )}
            {step > 0 && (
              <Button
                label="Previous step"
                variant="secondary"
                disabled={action.busy}
                onPress={() => {
                  setStep(step - 1);
                  setError(null);
                }}
              />
            )}
            {profile ? (
              <Button
                label="Save draft"
                variant="secondary"
                loading={action.busy}
                onPress={() => save(false)}
              />
            ) : (
              <Card>
                <AppText variant="heading">
                  Keep this request in your account
                </AppText>
                <AppText muted>
                  Sign in to save or submit your demo quotation. Your entries
                  will be preserved and restored after authentication.
                </AppText>
                <Button
                  label="Login and keep draft"
                  loading={action.busy}
                  onPress={() => authenticate('Login')}
                />
                <Button
                  label="Sign Up and keep draft"
                  variant="secondary"
                  disabled={action.busy}
                  onPress={() => authenticate('SignUp')}
                />
              </Card>
            )}
          </>
        )
      )}
    </AuthFrame>
  );
}
const styles = StyleSheet.create({
  footer: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  footerContent: { width: '100%', maxWidth: 472, alignSelf: 'center' },
  accent: { color: colors.accentOnDark },
  progress: { flexDirection: 'row', gap: 6 },
  segment: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
  },
  active: { backgroundColor: colors.primary },
  methods: { gap: 8 },
});
