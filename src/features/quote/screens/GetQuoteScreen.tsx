import React from 'react';
import type { RootScreenProps } from '../../../app/navigation/types';
import { AppText } from '../../../design-system/components';
import { PlaceholderScreen } from '../../../shared/components/PlaceholderScreen';
import { useGetSolutionQuery } from '../../solutions/state/solutionsApi';
import { useGetProjectQuery } from '../../projects/state/projectsApi';
import { skipToken } from '@reduxjs/toolkit/query';
export function GetQuoteScreen({ route }: RootScreenProps<'GetQuote'>) {
  const solution = useGetSolutionQuery(route.params?.solutionId ?? skipToken);
  const project = useGetProjectQuery(route.params?.projectId ?? skipToken);
  return (
    <PlaceholderScreen title="Get a Quote">
      <AppText>
        Quotation submission is not available in this demo yet. The complete
        quotation flow is planned for Phase 4.
      </AppText>
      {solution.data && <AppText>Solution: {solution.data.title}</AppText>}
      {project.data && <AppText>Project: {project.data.title}</AppText>}
    </PlaceholderScreen>
  );
}
