import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import type { RootScreenProps } from '../../../app/navigation/types';
import { AppText, Button } from '../../../design-system/components';
import { BrandImage } from '../../../design-system/components/BrandImage';
import { getImage } from '../../../assets/images';
import { Screen } from '../../../shared/components/Screen';
import { ContentMedia } from '../../../shared/components/ContentMedia';
import { QueryState } from '../../../shared/components/QueryState';
import { useGetProjectQuery } from '../state/projectsApi';
import { useGetSolutionsQuery } from '../../solutions/state/solutionsApi';
export function ProjectDetailsScreen({
  route,
  navigation,
}: RootScreenProps<'ProjectDetails'>) {
  const { data, isLoading, isError, refetch } = useGetProjectQuery(
    route.params.projectId,
  );
  const solutions = useGetSolutionsQuery();
  return (
    <Screen>
      <QueryState loading={isLoading} error={isError} onRetry={refetch} />
      {data && (
        <>
          <ContentMedia imageId={data.imageIds[0]} title={data.title} />
          <AppText variant="caption" muted>
            WEBSITE SHOWCASE / {data.title.toUpperCase()}
          </AppText>
          <AppText variant="title" accessibilityRole="header">
            {data.title}
          </AppText>
          <AppText>{data.description ?? data.summary}</AppText>
          <AppText variant="heading">Gallery</AppText>
          <View style={styles.gallery}>
            {data.imageIds.map((id, index) => {
              const image = getImage(id);
              return image ? (
                <Pressable
                  key={id}
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${data.title} image ${index + 1}`}
                  onPress={() =>
                    navigation.navigate('GalleryViewer', {
                      projectId: data.id,
                      initialIndex: index,
                    })
                  }
                  style={styles.thumb}
                >
                  <BrandImage
                    source={image}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </Pressable>
              ) : null;
            })}
          </View>
          {data.imageIds.includes('events-illustration') && (
            <AppText variant="caption" muted>
              The gallery includes an illustration published on the official
              website, labelled in the viewer.
            </AppText>
          )}
          {data.imageIds.length > 0 ? (
            <Button
              label="Open gallery"
              variant="secondary"
              onPress={() =>
                navigation.navigate('GalleryViewer', { projectId: data.id })
              }
            />
          ) : (
            <AppText muted>No gallery images published.</AppText>
          )}
          <Button
            label="Enquire about this project"
            onPress={() =>
              navigation.navigate('GetQuote', {
                projectId: data.id,
                solutionId: data.solutionIds[0],
              })
            }
          />
          <QueryState
            loading={solutions.isLoading}
            error={solutions.isError}
            onRetry={solutions.refetch}
          />
          <AppText variant="heading">Related solutions</AppText>
          {solutions.data
            ?.filter(item => data.solutionIds.includes(item.id))
            .map(item => (
              <Button
                key={item.id}
                label={`Explore ${item.title}`}
                variant="secondary"
                onPress={() =>
                  navigation.navigate('SolutionDetails', {
                    solutionId: item.id,
                  })
                }
              />
            ))}
        </>
      )}
    </Screen>
  );
}
const styles = StyleSheet.create({
  gallery: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  thumb: { width: '30%', minHeight: 72, borderRadius: 8, overflow: 'hidden' },
  image: { width: '100%', aspectRatio: 1 },
});
