import { createHttpClient } from '../../core/network/createHttpClient';
import { ApiProjectRepository } from '../../features/projects/data/ApiProjectRepository';
import { MockProjectRepository } from '../../features/projects/data/MockProjectRepository';
import { ApiSolutionRepository } from '../../features/solutions/data/ApiSolutionRepository';
import { MockSolutionRepository } from '../../features/solutions/data/MockSolutionRepository';
import { dataConfig, type DataConfig } from '../config/dataConfig';
import type { Repositories } from './types';
export function createRepositories(
  config: DataConfig = dataConfig,
): Repositories {
  if (config.mode === 'mock') {
    return {
      solutions: new MockSolutionRepository(),
      projects: new MockProjectRepository(),
    };
  }
  const client = createHttpClient(config.baseURL);
  return {
    solutions: new ApiSolutionRepository(client),
    projects: new ApiProjectRepository(client),
  };
}
