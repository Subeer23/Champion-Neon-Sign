import React from 'react';
import type { TabScreenProps } from '../../../app/navigation/types';
import { AppText, Button, Card } from '../../../design-system/components';
import { Screen } from '../../../shared/components/Screen';
import { QueryState } from '../../../shared/components/QueryState';
import { useGetSolutionsQuery } from '../state/solutionsApi';
export function SolutionsScreen({ navigation }: TabScreenProps<'Solutions'>) {
  const { data, isLoading, isError, refetch } = useGetSolutionsQuery();
  return (
    <Screen>
      <AppText variant="title" accessibilityRole="header">
        Solutions
      </AppText>
      <QueryState
        loading={isLoading}
        error={isError}
        empty={data?.length === 0}
        onRetry={refetch}
      />
      {data?.map(item => (
        <Card key={item.id}>
          <AppText variant="heading">{item.title}</AppText>
          <Button
            label={`Explore ${item.title}`}
            variant="secondary"
            onPress={() =>
              navigation.navigate('SolutionDetails', { solutionId: item.id })
            }
          />
        </Card>
      ))}
    </Screen>
  );
}
