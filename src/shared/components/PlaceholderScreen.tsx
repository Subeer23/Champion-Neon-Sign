import React, { type PropsWithChildren } from 'react';
import { AppText, Card } from '../../design-system/components';
import { Screen } from './Screen';
export function PlaceholderScreen({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  return (
    <Screen>
      <AppText variant="title" accessibilityRole="header">
        {title}
      </AppText>
      <Card>
        <AppText muted>This experience is coming soon.</AppText>
        {children}
      </Card>
    </Screen>
  );
}
