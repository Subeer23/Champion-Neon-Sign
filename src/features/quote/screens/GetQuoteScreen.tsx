import React from 'react';
import type { RootScreenProps } from '../../../app/navigation/types';
import { AppText, Button, Card } from '../../../design-system/components';
import { Screen } from '../../../shared/components/Screen';
import { useGetSolutionQuery } from '../../solutions/state/solutionsApi';
import { useGetProjectQuery } from '../../projects/state/projectsApi';
import { skipToken } from '@reduxjs/toolkit/query';
export function GetQuoteScreen({
  route,
  navigation,
}: RootScreenProps<'GetQuote'>) {
  const solution = useGetSolutionQuery(route.params?.solutionId ?? skipToken);
  const project = useGetProjectQuery(route.params?.projectId ?? skipToken);
  return (
    <Screen>
      <AppText variant="title" accessibilityRole="header">
        Let’s discuss your project.
      </AppText>
      <Card>
        <AppText>
          Contact our team to discuss your requirements and request a quote.
        </AppText>
        {solution.data && <AppText>Solution: {solution.data.title}</AppText>}
        {project.data && <AppText>Project: {project.data.title}</AppText>}
      </Card>
      <Button
        label="Contact our team"
        onPress={() => navigation.navigate('ContactUs')}
      />
    </Screen>
  );
}
