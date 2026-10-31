import type { Project } from './Project';
export interface ProjectRepository {
  list(signal?: AbortSignal): Promise<Project[]>;
  getById(id: string, signal?: AbortSignal): Promise<Project>;
}
