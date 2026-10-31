import React from 'react';
import type { TabScreenProps } from '../../../app/navigation/types';
import { AppText, Button, Card } from '../../../design-system/components';
import { Screen } from '../../../shared/components/Screen';
export function HomeScreen({ navigation }: TabScreenProps<'Home'>) {
  return (
    <Screen>
      <AppText variant="title" accessibilityRole="header">
        Champion Group
      </AppText>
      <Card>
        <AppText variant="heading">Explore our expertise</AppText>
        <Button
          label="Explore solutions"
          onPress={() => navigation.navigate('Solutions')}
        />
        <Button
          label="View projects"
          variant="secondary"
          onPress={() => navigation.navigate('Projects')}
        />
        <Button
          label="Get a quote"
          variant="secondary"
          onPress={() => navigation.navigate('GetQuote')}
        />
      </Card>
    </Screen>
  );
}
