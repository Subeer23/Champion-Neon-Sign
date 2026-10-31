import React from 'react';
import type { TabScreenProps } from '../../../app/navigation/types';
import { CatalogList } from '../../../shared/components/CatalogList';
import { useGetSolutionsQuery } from '../state/solutionsApi';
export function SolutionsScreen({ navigation }: TabScreenProps<'Solutions'>) {
  const { data, isLoading, isError, refetch } = useGetSolutionsQuery();
  return (
    <CatalogList
      items={data ?? []}
      loading={isLoading}
      error={isError}
      onRetry={refetch}
      title="Solutions"
      description="Explore our 16 visual communication solutions."
      verb="Explore"
      onSelect={solutionId =>
        navigation.navigate('SolutionDetails', { solutionId })
      }
    />
  );
}
