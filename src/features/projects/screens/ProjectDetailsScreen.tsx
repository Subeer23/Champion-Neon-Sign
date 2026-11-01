import React from 'react';
import { Pressable, View, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../../design-system/tokens/colors';
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
  const { width, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const contentWidth = Math.max(
    0,
    Math.min(width - insets.left - insets.right, 760) - 40,
  );
  const narrow = contentWidth / fontScale < 360;
  const galleryIds = data?.imageIds.filter(id => getImage(id)) ?? [];
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
          <ContentMedia detail imageId={data.imageIds[0]} title={data.title} />
          <AppText variant="caption" muted>
            WEBSITE SHOWCASE / {data.title.toUpperCase()}
          </AppText>
          <AppText variant="title" accessibilityRole="header">
            {data.title}
          </AppText>
          <AppText>{data.description ?? data.summary}</AppText>
          <AppText variant="heading">Gallery</AppText>
          <View style={styles.gallery}>
            {galleryIds.map((id, index) => {
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
                  style={({ pressed }) => [
                    styles.thumb,
                    {
                      width:
                        index === 0 || narrow
                          ? contentWidth
                          : (contentWidth - 12) / 2,
                    },
                    pressed && styles.pressed,
                  ]}
                >
                  <BrandImage
                    source={image}
                    style={styles.image}
                    resizeMode="contain"
                  />
                  <View style={styles.photoCaption}>
                    <AppText variant="caption" style={styles.light}>
                      PHOTO {String(index + 1).padStart(2, '0')}
                    </AppText>
                    <AppText variant="caption" style={styles.light}>
                      View full image ↗
                    </AppText>
                  </View>
                </Pressable>
              ) : null;
            })}
          </View>
          {galleryIds.length > 0 ? (
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
  gallery: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  thumb: { borderRadius: 16, overflow: 'hidden', backgroundColor: colors.dark },
  image: { width: '100%', aspectRatio: 1.6 },
  photoCaption: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  light: { color: colors.onDark },
  pressed: { opacity: 0.85 },
});
