import React from 'react';
import type { RootScreenProps } from '../../../app/navigation/types';
import { AppText } from '../../../design-system/components';
import { Screen } from '../../../shared/components/Screen';
import { QueryState } from '../../../shared/components/QueryState';
import { useGetProjectQuery } from '../state/projectsApi';
export function GalleryViewerScreen({
  route,
}: RootScreenProps<'GalleryViewer'>) {
  const { data, isLoading, isError, refetch } = useGetProjectQuery(
    route.params.projectId,
  );
  return (
    <Screen>
      <QueryState loading={isLoading} error={isError} onRetry={refetch} />
      {data && (
        <>
          <AppText variant="title">{data.title}</AppText>
          <AppText muted>Gallery images are coming soon.</AppText>
        </>
      )}
    </Screen>
  );
}
