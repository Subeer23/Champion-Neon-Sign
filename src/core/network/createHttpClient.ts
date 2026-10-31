import axios from 'axios';
import { RepositoryError } from '../errors/AppError';

/** Only constructed by the explicit API composition branch. No default host. */
export function createHttpClient(baseURL: string) {
  if (!/^https:\/\/[^/\s]+/.test(baseURL)) {
    throw new RepositoryError('invalid-data', 'An HTTPS API URL is required.');
  }
  const client = axios.create({
    baseURL,
    timeout: 15000,
    headers: { Accept: 'application/json' },
  });
  client.interceptors.response.use(
    response => response,
    (error: unknown) => {
      if (axios.isCancel(error)) {
        return Promise.reject(
          new RepositoryError('cancelled', 'Request cancelled.'),
        );
      }
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return Promise.reject(
          new RepositoryError('not-found', 'This item is unavailable.'),
        );
      }
      return Promise.reject(
        new RepositoryError(
          'network',
          'Unable to load content. Please try again.',
        ),
      );
    },
  );
  return client;
}
