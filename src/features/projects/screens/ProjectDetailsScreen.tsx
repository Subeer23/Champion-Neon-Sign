import React from 'react';
import type { RootScreenProps } from '../../../app/navigation/types';
import { AppText, Button } from '../../../design-system/components';
import { Screen } from '../../../shared/components/Screen';
import { QueryState } from '../../../shared/components/QueryState';
import { useGetProjectQuery } from '../state/projectsApi';
export function ProjectDetailsScreen({
  route,
  navigation,
}: RootScreenProps<'ProjectDetails'>) {
  const { data, isLoading, isError, refetch } = useGetProjectQuery(
    route.params.projectId,
  );
  return (
    <Screen>
      <QueryState loading={isLoading} error={isError} onRetry={refetch} />
      {data && (
        <>
          <AppText variant="title" accessibilityRole="header">
            {data.title}
          </AppText>
          <AppText>{data.summary}</AppText>
          <Button
            label="Open gallery"
            variant="secondary"
            onPress={() =>
              navigation.navigate('GalleryViewer', { projectId: data.id })
            }
          />
          <Button
            label="Enquire about this project"
            onPress={() =>
              navigation.navigate('GetQuote', {
                projectId: data.id,
                solutionId: data.solutionIds[0],
              })
            }
          />
        </>
      )}
    </Screen>
  );
}
