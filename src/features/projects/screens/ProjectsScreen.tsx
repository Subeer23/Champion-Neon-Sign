import React, { useMemo } from 'react';
import type { TabScreenProps } from '../../../app/navigation/types';
import { CatalogList } from '../../../shared/components/CatalogList';
import { useGetProjectsQuery } from '../state/projectsApi';
export function ProjectsScreen({ navigation }: TabScreenProps<'Projects'>) {
  const { data, isLoading, isError, refetch } = useGetProjectsQuery();
  const items = useMemo(
    () => data?.map(item => ({ ...item, imageId: item.imageIds[0] })) ?? [],
    [data],
  );
  const categories = useMemo(() => items.map(item => item.title), [items]);
  return (
    <CatalogList
      items={items}
      categories={categories}
      loading={isLoading}
      error={isError}
      onRetry={refetch}
      title="Projects"
      description="Official website showcases. Explore our work in branding, digital displays, exhibitions and events."
      verb="View"
      onSelect={projectId =>
        navigation.navigate('ProjectDetails', { projectId })
      }
    />
  );
}
