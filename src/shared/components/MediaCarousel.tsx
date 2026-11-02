import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getImage } from '../../assets/images';
import { BrandImage, AppText } from '../../design-system/components';
import { colors } from '../../design-system/tokens/colors';
export function MediaCarousel({
  imageIds,
  title,
}: {
  imageIds: readonly string[];
  title: string;
}) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const pageWidth = Math.max(
    1,
    Math.min(760, width - insets.left - insets.right) - 40,
  );
  const ids = useMemo(
    () => [...new Set(imageIds)].filter(id => getImage(id)),
    [imageIds],
  );
  const [index, setIndex] = useState(0);
  const list = useRef<FlatList<string>>(null);
  const current = Math.min(index, Math.max(0, ids.length - 1));
  const renderItem = useCallback(
    ({ item, index: i }: { item: string; index: number }) => (
      <BrandImage
        source={getImage(item)!}
        resizeMode="contain"
        accessibilityLabel={`${title} photo ${i + 1}`}
        style={{ width: pageWidth, height: Math.min(360, pageWidth * 0.8) }}
      />
    ),
    [pageWidth, title],
  );
  if (!ids.length) return null;
  return (
    <View style={styles.container}>
      <FlatList
        ref={list}
        key={`${pageWidth}-${ids.join(',')}`}
        horizontal
        pagingEnabled
        data={ids}
        keyExtractor={id => id}
        initialScrollIndex={current}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, i) => ({
          length: pageWidth,
          offset: pageWidth * i,
          index: i,
        })}
        onMomentumScrollEnd={event =>
          setIndex(
            Math.min(
              ids.length - 1,
              Math.max(
                0,
                Math.round(event.nativeEvent.contentOffset.x / pageWidth),
              ),
            ),
          )
        }
        renderItem={renderItem}
      />
      <View style={styles.pagination}>
        {ids.map((id, i) => (
          <Pressable
            key={id}
            accessibilityRole="button"
            accessibilityLabel={`Show ${title} photo ${i + 1}`}
            accessibilityState={{ selected: current === i }}
            onPress={() => {
              list.current?.scrollToIndex({ index: i, animated: false });
              setIndex(i);
            }}
            style={styles.touch}
          >
            <View style={[styles.dot, current === i && styles.active]} />
          </Pressable>
        ))}
      </View>
      <AppText variant="caption" muted style={styles.count}>
        {current + 1} / {ids.length}
      </AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  touch: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.inactiveOnDark,
  },
  active: { width: 18, backgroundColor: colors.primary },
  count: { textAlign: 'center' },
});
