import React from 'react';
import { ActivityIndicator } from 'react-native';
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
      <ActivityIndicator
        accessibilityLabel="Loading content"
        color={colors.primary}
      />
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
