import React, { useCallback } from 'react';
import type { TabScreenProps } from '../../../app/navigation/types';
import { CatalogList } from '../../../shared/components/CatalogList';
import { useGetSolutionsQuery } from '../state/solutionsApi';
export function SolutionsScreen({ navigation }: TabScreenProps<'Solutions'>) {
  const { data, isLoading, isError, refetch } = useGetSolutionsQuery();
  const select = useCallback(
    (solutionId: string) =>
      navigation.navigate('SolutionDetails', { solutionId }),
    [navigation],
  );
  return (
    <CatalogList
      onQuote={() => navigation.navigate('GetQuote')}
      items={data ?? []}
      loading={isLoading}
      error={isError}
      onRetry={refetch}
      title="Solutions"
      description="Explore our 16 visual communication solutions."
      verb="Explore"
      onSelect={select}
    />
  );
}
