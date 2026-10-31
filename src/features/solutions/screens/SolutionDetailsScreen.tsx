import React from 'react';
import type { RootScreenProps } from '../../../app/navigation/types';
import { AppText, Button } from '../../../design-system/components';
import { Screen } from '../../../shared/components/Screen';
import { QueryState } from '../../../shared/components/QueryState';
import { useGetSolutionQuery } from '../state/solutionsApi';
export function SolutionDetailsScreen({
  route,
  navigation,
}: RootScreenProps<'SolutionDetails'>) {
  const { data, isLoading, isError, refetch } = useGetSolutionQuery(
    route.params.solutionId,
  );
  return (
    <Screen>
      <QueryState loading={isLoading} error={isError} onRetry={refetch} />
      {data && (
        <>
          <AppText variant="title" accessibilityRole="header">
            {data.title}
          </AppText>
          <AppText>{data.summary}</AppText>
          <Button
            label="Request a quote"
            onPress={() =>
              navigation.navigate('GetQuote', { solutionId: data.id })
            }
          />
        </>
      )}
    </Screen>
  );
}
