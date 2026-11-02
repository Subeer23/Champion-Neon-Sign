import { MediaCarousel } from '../../../shared/components/MediaCarousel';
import React, { useMemo } from 'react';
import type { RootScreenProps } from '../../../app/navigation/types';
import { AppText, Button, Card } from '../../../design-system/components';
import { Screen } from '../../../shared/components/Screen';
import { ContentMedia } from '../../../shared/components/ContentMedia';
import { QueryState } from '../../../shared/components/QueryState';
import { useGetSolutionQuery } from '../state/solutionsApi';
import { useGetProjectsQuery } from '../../projects/state/projectsApi';
import { solutionCapabilities } from '../../../mocks/sourceManifest';
export function SolutionDetailsScreen({
  route,
  navigation,
}: RootScreenProps<'SolutionDetails'>) {
  const { data, isLoading, isError, refetch } = useGetSolutionQuery(
    route.params?.solutionId ?? '',
  );
  const projects = useGetProjectsQuery();
  const solutionId = route.params?.solutionId;
  const related = useMemo(
    () =>
      projects.data?.filter(
        item => solutionId && item.solutionIds.includes(solutionId),
      ) ?? [],
    [projects.data, solutionId],
  );
  const imageIds = useMemo(
    () =>
      data?.imageId
        ? [data.imageId, ...related.flatMap(item => item.imageIds)]
        : [],
    [data?.imageId, related],
  );
  return (
    <Screen>
      <QueryState
        loading={isLoading}
        error={isError}
        empty={!data}
        onRetry={refetch}
      />
      {data && (
        <>
          {data.imageId ? (
            <MediaCarousel imageIds={imageIds} title={data.title} />
          ) : (
            <ContentMedia title={data.title} />
          )}
          <AppText variant="caption" muted>
            CHAMPION GROUP / SOLUTIONS
          </AppText>
          <AppText variant="title" accessibilityRole="header">
            {data.title}
          </AppText>
          <AppText>{data.summary}</AppText>
          {(solutionCapabilities[data.id] ?? []).length > 0 && (
            <Card>
              <AppText variant="heading">Capabilities</AppText>
              {solutionCapabilities[data.id]?.map(value => (
                <AppText key={value}>• {value}</AppText>
              ))}
            </Card>
          )}
          <Button
            label="Request a quote"
            onPress={() =>
              navigation.navigate('GetQuote', { solutionId: data.id })
            }
          />
          <Button
            label="Contact our team"
            variant="secondary"
            onPress={() => navigation.navigate('ContactUs')}
          />
          <QueryState
            loading={projects.isLoading}
            error={projects.isError}
            onRetry={projects.refetch}
          />
          {related.length > 0 && (
            <>
              <AppText variant="heading" accessibilityRole="header">
                Related showcases
              </AppText>
              {related.map(item => (
                <Card key={item.id}>
                  <ContentMedia imageId={item.imageIds[0]} title={item.title} />
                  <AppText variant="heading">{item.title}</AppText>
                  <AppText muted>{item.summary}</AppText>
                  <Button
                    label={`View ${item.title}`}
                    variant="secondary"
                    onPress={() =>
                      navigation.navigate('ProjectDetails', {
                        projectId: item.id,
                      })
                    }
                  />
                </Card>
              ))}
            </>
          )}
        </>
      )}
    </Screen>
  );
}
