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
import { AppText } from '../../design-system/components';
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
  const columns =
    (width - insets.left - insets.right) / fontScale >= 700 ? 2 : 1;
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
        initialNumToRender={6}
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
            <AppText muted>
              No matching results. Try a different search or filter.
            </AppText>
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
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            >
              <ContentMedia imageId={item.imageId} title={item.title} />
              <View style={styles.copy}>
                <AppText variant="heading">{item.title}</AppText>
                <AppText muted style={styles.summary}>
                  {item.summary}
                </AppText>
                <AppText variant="label" style={styles.link}>
                  {verb} details ↗
                </AppText>
              </View>
            </Pressable>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
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
    borderRadius: 22,
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
  copy: { padding: 16, gap: 8 },
  summary: { fontSize: 14, lineHeight: 22 },
  link: { color: colors.primaryStrong, marginTop: 4 },
});
