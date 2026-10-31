import type { AxiosAdapter } from 'axios';
import axios from 'axios';
import { createHttpClient } from '../core/network/createHttpClient';
import { ApiSolutionRepository } from '../features/solutions/data/ApiSolutionRepository';
import { ApiProjectRepository } from '../features/projects/data/ApiProjectRepository';
import { createRepositories } from '../app/dependencies/createRepositories';

/** In-memory Axios adapters: these tests never make HTTP requests. */
function clientWithData(data: unknown) {
  const client = createHttpClient('https://api.example.invalid');
  const adapter: AxiosAdapter = async config => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  });
  client.defaults.adapter = adapter;
  return client;
}

it('does not construct an HTTP client in default mock mode', async () => {
  const create = jest.spyOn(axios, 'create');
  const repositories = createRepositories();
  await repositories.solutions.list();
  await repositories.projects.list();
  expect(create).not.toHaveBeenCalled();
  create.mockRestore();
});

it('validates API data and strips transport-only fields', async () => {
  const repository = new ApiSolutionRepository(
    clientWithData([
      {
        id: 'signage',
        title: 'Signage',
        summary: 'Example',
        internal: 'private',
      },
    ]),
  );
  expect(await repository.list()).toEqual([
    { id: 'signage', title: 'Signage', summary: 'Example' },
  ]);
  const malformed = new ApiProjectRepository(
    clientWithData([{ id: 'missing-fields' }]),
  );
  await expect(malformed.list()).rejects.toMatchObject({
    code: 'invalid-data',
  });
});

it('encodes detail IDs and forwards cancellation signals', async () => {
  const client = clientWithData({ id: 'a/b', title: 'Example', summary: '' });
  const adapter = jest.fn(client.defaults.adapter as AxiosAdapter);
  client.defaults.adapter = adapter;
  const controller = new AbortController();
  await new ApiSolutionRepository(client).getById('a/b', controller.signal);
  expect(adapter).toHaveBeenCalledWith(
    expect.objectContaining({
      url: '/solutions/a%2Fb',
      signal: controller.signal,
    }),
  );
});

it('normalizes transport errors without leaking backend details', async () => {
  const client = clientWithData(null);
  client.defaults.adapter = async () => {
    throw new Error('Internal transport detail');
  };
  await expect(new ApiProjectRepository(client).list()).rejects.toMatchObject({
    code: 'network',
    message: 'Unable to load content. Please try again.',
  });
});
