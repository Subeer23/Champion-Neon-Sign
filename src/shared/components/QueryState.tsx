import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { AppText, Button, Card } from '../../design-system/components';
import { colors } from '../../design-system/tokens/colors';
export function QueryState({
  loading,
  error,
  empty,
  onRetry,
}: {
  loading: boolean;
  error: boolean;
  empty?: boolean;
  onRetry: () => void;
}) {
  if (loading) {
    return (
      <View style={styles.loading} accessibilityLiveRegion="polite">
        <ActivityIndicator
          accessibilityLabel="Loading content"
          color={colors.primary}
        />
        <AppText variant="caption" muted>
          Loading content…
        </AppText>
      </View>
    );
  }
  if (error) {
    return (
      <Card>
        <AppText accessibilityRole="alert">Content is unavailable.</AppText>
        <Button label="Try again" onPress={onRetry} />
      </Card>
    );
  }
  if (empty) {
    return <AppText muted>No items available yet.</AppText>;
  }
  return null;
}

const styles = StyleSheet.create({
  loading: { padding: 24, gap: 12, alignItems: 'center' },
});
