import React from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootScreenProps } from '../../../app/navigation/types';
import { AppText, Button, Card } from '../../../design-system/components';
import { colors } from '../../../design-system/tokens/colors';
import { Screen } from '../../../shared/components/Screen';
import { ContentMedia } from '../../../shared/components/ContentMedia';
import {
  useAuthRepository,
  useDemoSelector,
} from '../../auth/data/AuthRepositoryProvider';
import { useAsyncAction } from '../../../shared/hooks/useAsyncAction';
import {
  AccountEmpty,
  GuestPrompt,
  accountStyles as s,
} from '../components/AccountPrimitives';
import { useGetProjectsQuery } from '../../projects/state/projectsApi';
import { QueryState } from '../../../shared/components/QueryState';
import { projectFixtures } from '../../../mocks/fixtures/projects';
import { solutionFixtures } from '../../../mocks/fixtures/solutions';
const dateLabel = (value: string) => new Date(value).toLocaleDateString();
function ListFrame<T>({
  data,
  renderItem,
  empty,
  header,
}: {
  data: readonly T[];
  renderItem: (item: T) => React.ReactElement;
  empty: React.ReactElement;
  header?: React.ReactElement;
}) {
  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.page}>
      <FlatList
        data={data}
        keyExtractor={(item, index) =>
          typeof item === 'string'
            ? item
            : 'id' in (item as object)
            ? String((item as { id: string }).id)
            : String(index)
        }
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <View style={styles.item}>{renderItem(item)}</View>
        )}
        ListEmptyComponent={empty}
        ListHeaderComponent={header}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
      />
    </SafeAreaView>
  );
}
export function SavedProjectsScreen({
  navigation,
}: RootScreenProps<'SavedProjects'>) {
  const profile = useDemoSelector(snapshot => snapshot.profile?.id);
  const savedProjects = useDemoSelector(snapshot => snapshot.savedProjects);
  const repo = useAuthRepository();
  const action = useAsyncAction();
  const projects = useGetProjectsQuery();
  if (!profile)
    return (
      <Screen>
        <GuestPrompt />
      </Screen>
    );
  return (
    <ListFrame
      data={savedProjects}
      header={
        <QueryState
          loading={projects.isLoading}
          error={projects.isError}
          onRetry={projects.refetch}
        />
      }
      empty={
        <AccountEmpty
          title="Your inspiration starts here"
          body="Save a project from its detail screen to find it here on your next visit."
        />
      }
      renderItem={id => {
        const project = projects.data?.find(p => p.id === id);
        return (
          <Card>
            {project ? (
              <>
                <ContentMedia
                  imageId={project.imageIds[0]}
                  title={project.title}
                  height={180}
                />
                <AppText variant="heading">{project.title}</AppText>
                <AppText muted>{project.summary}</AppText>
                <Button
                  label={`Open ${project.title}`}
                  onPress={() =>
                    navigation.navigate('ProjectDetails', { projectId: id })
                  }
                />
              </>
            ) : (
              <AppText muted>
                {projects.isLoading || projects.isError
                  ? 'Project information unavailable right now.'
                  : 'This saved project is no longer available.'}
              </AppText>
            )}
            <Button
              label="Remove saved project"
              variant="secondary"
              loading={action.busy}
              onPress={() => action.run(() => repo.toggleSavedProject(id))}
            />
            {action.error && (
              <AppText accessibilityRole="alert">{action.error}</AppText>
            )}
          </Card>
        );
      }}
    />
  );
}
export function MyQuotationsScreen({
  navigation,
}: RootScreenProps<'MyQuotations'>) {
  const profile = useDemoSelector(snapshot => snapshot.profile?.id);
  const quotations = useDemoSelector(snapshot => snapshot.quotations);
  if (!profile)
    return (
      <Screen>
        <GuestPrompt />
      </Screen>
    );
  return (
    <ListFrame
      data={quotations}
      header={
        <View style={styles.item}>
          <AppText muted>
            Saved on this device only. Nothing has been submitted to Champion
            Group.
          </AppText>
          <Button
            label="Create demo quotation"
            onPress={() => navigation.navigate('GetQuote')}
          />
        </View>
      }
      empty={
        <AccountEmpty
          title="Let’s start your next idea"
          body="Your locally saved quotation requests will appear here with their reference, service and date."
        />
      }
      renderItem={q => (
        <Card>
          <AppText variant="caption" style={s.accent}>
            {q.reference} · {dateLabel(q.createdAt)}
          </AppText>
          <AppText variant="heading">
            {solutionFixtures.find(service => service.id === q.serviceId)
              ?.title ?? 'Service unavailable'}
          </AppText>
          <AppText muted>{q.status}</AppText>
          <Button
            label="View demo"
            variant="secondary"
            onPress={() =>
              navigation.navigate('QuotationDetails', { quotationId: q.id })
            }
          />
        </Card>
      )}
    />
  );
}
export function QuotationDetailsScreen({
  route,
  navigation,
}: RootScreenProps<'QuotationDetails'>) {
  const profile = useDemoSelector(snapshot => snapshot.profile?.id);
  const quote = useDemoSelector(snapshot =>
    snapshot.quotations.find(q => q.id === route.params?.quotationId),
  );
  const repo = useAuthRepository();
  const action = useAsyncAction();
  return (
    <Screen>
      {!profile ? (
        <GuestPrompt />
      ) : !quote ? (
        <AccountEmpty
          title="Quotation unavailable"
          body="This draft may have been cleared or belongs to a different demo account."
        />
      ) : (
        <>
          <AppText variant="caption" style={s.accent}>
            {quote.reference}
          </AppText>
          <AppText variant="title">
            {solutionFixtures.find(service => service.id === quote.serviceId)
              ?.title ?? 'Service unavailable'}
          </AppText>
          <Card>
            <AppText variant="label">{quote.status}</AppText>
            <AppText muted>
              {new Date(quote.createdAt).toLocaleString()}
            </AppText>
            <AppText>{quote.form?.name ?? quote.name}</AppText>
            <AppText>{quote.form?.email ?? quote.email}</AppText>
            <AppText>{quote.form?.phone ?? quote.phone}</AppText>
          </Card>
          <Card>
            <AppText variant="heading">Your project brief</AppText>
            <AppText>{quote.form?.title}</AppText>
            {quote.projectId && (
              <AppText>
                Inspired by:{' '}
                {projectFixtures.find(p => p.id === quote.projectId)?.title ??
                  quote.projectId}
              </AppText>
            )}
            <AppText>{quote.form?.description ?? quote.message}</AppText>
            <AppText>
              Location: {quote.form?.location || 'Not specified'}
            </AppText>
            <AppText>Budget: {quote.form?.budget || 'Not specified'}</AppText>
            <AppText>
              Completion: {quote.form?.completionDate || 'Not specified'}
            </AppText>
            <AppText>
              Additional: {quote.form?.additional || 'Not specified'}
            </AppText>
            <AppText>Company: {quote.form?.company || 'Not specified'}</AppText>
            <AppText>
              Preferred contact: {quote.form?.contactMethod || 'Not specified'}
            </AppText>
          </Card>
          <AppText muted>
            Saved locally for demonstration. This request was not sent to
            Champion Group.
          </AppText>
          {quote.status === 'Draft' && (
            <Button
              label="Continue editing draft"
              onPress={() =>
                navigation.navigate('GetQuote', { draftId: quote.id })
              }
            />
          )}
          {quote.status === 'Submitted (Demo)' && (
            <Button
              label="Cancel demo request"
              variant="secondary"
              loading={action.busy}
              onPress={() => action.run(() => repo.cancelQuotation(quote.id))}
            />
          )}
          <Button
            label="Delete quotation"
            variant="secondary"
            loading={action.busy}
            onPress={() =>
              Alert.alert(
                'Delete local quotation?',
                'This removes the request from this demo account.',
                [
                  { text: 'Keep', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () =>
                      action.run(async isActive => {
                        await repo.deleteQuotation(quote.id);
                        if (!isActive() || navigation.isFocused?.() === false)
                          return;
                        navigation.goBack();
                      }),
                  },
                ],
              )
            }
          />
          {action.error && (
            <AppText accessibilityRole="alert">{action.error}</AppText>
          )}
          <Button
            label="Contact Champion Group"
            onPress={() => navigation.navigate('ContactUs')}
          />
        </>
      )}
    </Screen>
  );
}
export function NotificationsScreen({
  navigation,
}: RootScreenProps<'Notifications'>) {
  const profile = useDemoSelector(snapshot => snapshot.profile?.id);
  const notifications = useDemoSelector(snapshot => snapshot.notifications);
  const notificationsEnabled = useDemoSelector(
    snapshot => snapshot.notificationsEnabled,
  );
  const repo = useAuthRepository();
  const action = useAsyncAction();
  if (!profile)
    return (
      <Screen>
        <GuestPrompt />
      </Screen>
    );
  return (
    <ListFrame
      data={notifications}
      header={
        <View style={styles.item}>
          <AppText muted>
            {notificationsEnabled
              ? 'Local activity updates · No push notifications'
              : 'New local notifications are turned off in Settings.'}
          </AppText>
          {action.error && (
            <AppText accessibilityRole="alert">{action.error}</AppText>
          )}
        </View>
      }
      empty={
        <AccountEmpty
          title="You’re all caught up"
          body="Local updates appear when you save a demo quotation with notifications enabled. No messages are fabricated."
        />
      }
      renderItem={n => (
        <Card>
          <AppText variant="caption" style={s.accent}>
            {n.read ? 'READ' : 'UNREAD'} · {dateLabel(n.createdAt)}
          </AppText>
          <AppText variant="heading">{n.title}</AppText>
          <AppText muted>{n.body}</AppText>
          {!n.read && (
            <Button
              label="Mark as read"
              loading={action.busy}
              variant="secondary"
              onPress={() => action.run(() => repo.markNotificationRead(n.id))}
            />
          )}{' '}
          {n.quoteId && (
            <Button
              label="View quotation"
              onPress={() =>
                action.run(async isActive => {
                  await repo.markNotificationRead(n.id);
                  if (!isActive() || navigation.isFocused?.() === false) return;
                  navigation.navigate('QuotationDetails', {
                    quotationId: n.quoteId!,
                  });
                })
              }
            />
          )}
        </Card>
      )}
    />
  );
}
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: 20,
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    flexGrow: 1,
  },
  item: { marginBottom: 16, gap: 16 },
});
