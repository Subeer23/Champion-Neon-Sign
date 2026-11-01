import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootScreenProps } from '../../../app/navigation/types';
import { AppText, Button, Card } from '../../../design-system/components';
import { colors } from '../../../design-system/tokens/colors';
import { Screen } from '../../../shared/components/Screen';
import { ContentMedia } from '../../../shared/components/ContentMedia';
import {
  useAuthRepository,
  useDemoSnapshot,
} from '../../auth/data/AuthRepositoryProvider';
import { useAsyncAction } from '../../../shared/hooks/useAsyncAction';
import {
  AccountEmpty,
  GuestPrompt,
  accountStyles as s,
} from '../components/AccountPrimitives';
import { useGetProjectsQuery } from '../../projects/state/projectsApi';
import { QueryState } from '../../../shared/components/QueryState';
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
  const { profile, savedProjects } = useDemoSnapshot();
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
  const { profile, quotations } = useDemoSnapshot();
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
          body="Your locally saved quotation drafts will appear here with their reference, service and date."
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
            label={`View ${q.reference}`}
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
  const { profile, quotations } = useDemoSnapshot();
  const quote = quotations.find(q => q.id === route.params.quotationId);
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
            <AppText>{quote.name}</AppText>
            <AppText>{quote.email}</AppText>
            <AppText>{quote.phone}</AppText>
          </Card>
          <Card>
            <AppText variant="heading">Your project brief</AppText>
            <AppText>{quote.message}</AppText>
          </Card>
          <AppText muted>
            This is a local demo draft, not a submitted request or a company
            price quotation.
          </AppText>
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
  const { profile, notifications, notificationsEnabled } = useDemoSnapshot();
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
                action.run(async () => {
                  await repo.markNotificationRead(n.id);
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
