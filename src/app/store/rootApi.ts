import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { AppError } from '../../core/errors/AppError';
export const rootApi = createApi({
  reducerPath: 'catalogApi',
  baseQuery: fakeBaseQuery<AppError>(),
  tagTypes: ['Solution', 'Project'],
  endpoints: () => ({}),
});
