import React, { useMemo, useState } from 'react';
import { FlatList, View, StyleSheet, useWindowDimensions } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import type { RootScreenProps } from '../../../app/navigation/types';
import { AppText, Button } from '../../../design-system/components';
import { BrandImage } from '../../../design-system/components/BrandImage';
import { getImage } from '../../../assets/images';
import { colors } from '../../../design-system/tokens/colors';
import { IconButton } from '../../../shared/components/IconButton';
import { useGetProjectQuery } from '../state/projectsApi';
export function clampGalleryIndex(index: number, count: number) {
  return Math.min(
    Math.max(0, Number.isFinite(index) ? Math.floor(index) : 0),
    Math.max(0, count - 1),
  );
}
export function GalleryViewerScreen({
  route,
  navigation,
}: RootScreenProps<'GalleryViewer'>) {
  const { data, isLoading, isError, refetch } = useGetProjectQuery(
    route.params?.projectId ?? '',
  );
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const pageWidth = Math.max(1, width - insets.left - insets.right);
  const ids = useMemo(
    () => [...new Set(data?.imageIds ?? [])].filter(id => getImage(id)),
    [data?.imageIds],
  );
  const [index, setIndex] = useState(route.params?.initialIndex ?? 0);
  const current = clampGalleryIndex(index, ids.length);
  return (
    <SafeAreaView
      style={styles.screen}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <View style={styles.header}>
        <IconButton
          icon="close"
          dark
          label="Close gallery"
          onPress={() => navigation.goBack()}
        />
        <AppText style={styles.title}>{data?.title ?? 'Gallery'}</AppText>
        <AppText style={styles.light} accessibilityLiveRegion="polite">
          {ids.length ? `${current + 1} / ${ids.length}` : '0 / 0'}
        </AppText>
      </View>
      {isLoading && <AppText style={styles.light}>Loading gallery…</AppText>}
      {isError && (
        <View style={styles.message}>
          <AppText style={styles.light}>Gallery unavailable.</AppText>
          <Button label="Try again" onPress={refetch} />
        </View>
      )}
      {!isLoading && !isError && ids.length === 0 && (
        <AppText style={styles.light}>No gallery images published.</AppText>
      )}
      {ids.length > 0 && (
        <FlatList
          key={`${route.params?.projectId}-${pageWidth}-${ids.join(',')}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          data={ids}
          keyExtractor={id => id}
          initialScrollIndex={current}
          initialNumToRender={1}
          maxToRenderPerBatch={2}
          windowSize={3}
          getItemLayout={(_, i) => ({
            length: pageWidth,
            offset: pageWidth * i,
            index: i,
          })}
          onMomentumScrollEnd={event =>
            setIndex(
              clampGalleryIndex(
                Math.round(event.nativeEvent.contentOffset.x / pageWidth),
                ids.length,
              ),
            )
          }
          renderItem={({ item, index: imageIndex }) => (
            <View style={[styles.page, { width: pageWidth }]}>
              <BrandImage
                source={getImage(item)!}
                resizeMode="contain"
                style={{
                  width: pageWidth,
                  height: Math.max(
                    120,
                    height - insets.top - insets.bottom - 180,
                  ),
                }}
                accessibilityLabel={`${data?.title} image ${imageIndex + 1}`}
              />
              <AppText style={styles.caption}>
                Champion Group · Project photography
              </AppText>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.dark },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
    minHeight: 60,
  },
  title: { flex: 1, color: colors.onDark, fontFamily: 'Manrope-SemiBold' },
  light: { color: colors.mutedOnDark },
  page: { justifyContent: 'center' },
  caption: {
    color: colors.mutedOnDark,
    textAlign: 'center',
    padding: 16,
    fontSize: 12,
    lineHeight: 18,
  },
  message: { padding: 24, gap: 16 },
});
