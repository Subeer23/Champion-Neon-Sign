import React from 'react';
import type { TabScreenProps } from '../../../app/navigation/types';
import { AppText, Button, Card } from '../../../design-system/components';
import { Screen } from '../../../shared/components/Screen';
import { QueryState } from '../../../shared/components/QueryState';
import { useGetProjectsQuery } from '../state/projectsApi';
export function ProjectsScreen({ navigation }: TabScreenProps<'Projects'>) {
  const { data, isLoading, isError, refetch } = useGetProjectsQuery();
  return (
    <Screen>
      <AppText variant="title" accessibilityRole="header">
        Projects
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
            label={`View ${item.title}`}
            variant="secondary"
            onPress={() =>
              navigation.navigate('ProjectDetails', { projectId: item.id })
            }
          />
        </Card>
      ))}
    </Screen>
  );
}
