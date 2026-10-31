import { rootApi } from '../../../app/store/rootApi';
import { repositoryQuery } from '../../../app/store/repositoryQuery';
import type { Project } from '../domain/Project';
export const projectsApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    getProjects: builder.query<Project[], void>({
      queryFn: (_, api) =>
        repositoryQuery(api, (repositories, signal) =>
          repositories.projects.list(signal),
        ),
      providesTags: ['Project'],
    }),
    getProject: builder.query<Project, string>({
      queryFn: (id, api) =>
        repositoryQuery(api, (repositories, signal) =>
          repositories.projects.getById(id, signal),
        ),
      providesTags: (_, __, id) => [{ type: 'Project', id }],
    }),
  }),
});
export const { useGetProjectsQuery, useGetProjectQuery } = projectsApi;
