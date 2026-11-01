import { SolutionIcon } from './SolutionIcon';
import { BrandImage } from '../../design-system/components/BrandImage';
import { getImage } from '../../assets/images';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  View,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { AppText, Button } from '../../design-system/components';
import { colors } from '../../design-system/tokens/colors';
import { ContentMedia } from './ContentMedia';
import { SearchField } from './SearchField';
import { QueryState } from './QueryState';
import { filterContent } from '../content/filterContent';
export interface CatalogItem {
  id: string;
  title: string;
  summary: string;
  imageId?: string;
}
export function CatalogList({
  items,
  loading,
  error,
  onRetry,
  title,
  description,
  verb,
  onSelect,
  categories,
}: {
  items: readonly CatalogItem[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  title: string;
  description: string;
  verb: string;
  onSelect: (id: string) => void;
  categories?: readonly string[];
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const { width, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const solutionLayout = !categories;
  const available = Math.min(1100, width - insets.left - insets.right) - 40;
  const roomySolution = available / fontScale >= 340;
  const columns = !solutionLayout && available / fontScale >= 320 ? 2 : 1;
  const filtered = useMemo(
    () => filterContent(items, query, category),
    [items, query, category],
  );
  return (
    <SafeAreaView edges={['left', 'right']} style={styles.safe}>
      <FlatList
        key={columns}
        numColumns={columns}
        data={filtered}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        ListHeaderComponent={
          <View style={styles.heading}>
            <AppText style={styles.eyebrow}>CHAMPION GROUP</AppText>
            <AppText variant="title" accessibilityRole="header">
              {title}
            </AppText>
            <AppText muted>{description}</AppText>
            <SearchField
              label={`Search ${title.toLowerCase()}`}
              value={query}
              onChangeText={setQuery}
            />
            {categories && (
              <View style={styles.filters}>
                {['All', ...categories].map(value => (
                  <Pressable
                    key={value}
                    accessibilityRole="button"
                    accessibilityLabel={`Filter ${value}`}
                    accessibilityState={{ selected: category === value }}
                    onPress={() => setCategory(value)}
                    style={[styles.chip, category === value && styles.selected]}
                  >
                    <AppText
                      variant="label"
                      style={category === value && styles.selectedText}
                    >
                      {value}
                    </AppText>
                  </Pressable>
                ))}
              </View>
            )}
            <AppText variant="caption" muted accessibilityLiveRegion="polite">
              {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
            </AppText>
            <QueryState loading={loading} error={error} onRetry={onRetry} />
          </View>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View style={styles.empty}>
              <AppText variant="heading">No matches found</AppText>
              <AppText muted>Try a different search or filter.</AppText>
              <Button
                label="Clear search and filters"
                variant="secondary"
                onPress={() => {
                  setQuery('');
                  setCategory('All');
                }}
              />
            </View>
          ) : undefined
        }
        renderItem={({ item }) => (
          <View
            style={[styles.cell, columns === 2 ? styles.half : styles.full]}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${verb} ${item.title}`}
              onPress={() => onSelect(item.id)}
              style={({ pressed }) => [
                styles.card,
                solutionLayout && styles.solutionRow,
                pressed && styles.pressed,
              ]}
            >
              {solutionLayout ? (
                <SolutionIcon title={item.title} size={34} />
              ) : (
                <ContentMedia
                  imageId={item.imageId}
                  title={item.title}
                  height={Math.min(240, (available / columns - 8) * 0.72)}
                />
              )}
              <View
                style={[styles.copy, solutionLayout && styles.solutionCopy]}
              >
                <AppText
                  variant="heading"
                  numberOfLines={fontScale > 1.3 ? undefined : 2}
                  style={[
                    styles.cardTitle,
                    !solutionLayout && { minHeight: 44 * fontScale },
                  ]}
                >
                  {item.title}
                </AppText>
                <AppText
                  muted
                  numberOfLines={fontScale > 1.3 ? undefined : 3}
                  style={styles.summary}
                >
                  {item.summary}
                </AppText>
                <AppText variant="label" style={styles.link}>
                  {verb} details ↗
                </AppText>
              </View>
              {solutionLayout && roomySolution && getImage(item.imageId) && (
                <BrandImage
                  source={getImage(item.imageId)!}
                  resizeMode="contain"
                  style={styles.solutionImage}
                />
              )}
            </Pressable>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  solutionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  solutionCopy: { flex: 1, padding: 0 },
  solutionImage: {
    width: 72,
    height: 82,
    borderRadius: 8,
    backgroundColor: colors.dark,
  },
  cardTitle: { fontSize: 16, lineHeight: 22 },
  empty: {
    padding: 20,
    gap: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
  },
  half: { width: '50%' },
  full: { width: '100%' },
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, maxWidth: 1100, width: '100%', alignSelf: 'center' },
  heading: { gap: 16, padding: 4, marginBottom: 20 },
  eyebrow: {
    fontFamily: 'Manrope-Bold',
    fontSize: 10,
    letterSpacing: 1.8,
    color: colors.primaryStrong,
  },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary },
  selectedText: { color: colors.onPrimary },
  cell: { padding: 4, marginBottom: 12 },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    overflow: 'hidden',
  },
  pressed: { opacity: 0.8 },
  copy: { padding: 12, gap: 8 },
  summary: { fontSize: 12, lineHeight: 19 },
  link: { color: colors.primaryStrong, marginTop: 4 },
});
