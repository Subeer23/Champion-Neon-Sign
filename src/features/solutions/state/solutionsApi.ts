import { rootApi } from '../../../app/store/rootApi';
import { repositoryQuery } from '../../../app/store/repositoryQuery';
import type { Solution } from '../domain/Solution';
export const solutionsApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    getSolutions: builder.query<Solution[], void>({
      queryFn: (_, api) =>
        repositoryQuery(api, (repositories, signal) =>
          repositories.solutions.list(signal),
        ),
      providesTags: ['Solution'],
    }),
    getSolution: builder.query<Solution, string>({
      queryFn: (id, api) =>
        repositoryQuery(api, (repositories, signal) =>
          repositories.solutions.getById(id, signal),
        ),
      providesTags: (_, __, id) => [{ type: 'Solution', id }],
    }),
  }),
});
export const { useGetSolutionsQuery, useGetSolutionQuery } = solutionsApi;
