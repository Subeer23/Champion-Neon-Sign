import type { AxiosInstance } from 'axios';
import { z } from 'zod';
import { RepositoryError } from '../../../core/errors/AppError';
import type { ProjectRepository } from '../domain/ProjectRepository';
const schema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string(),
  description: z.string().optional(),
  sourceUrl: z.string().url().optional(),
  solutionIds: z.array(z.string()),
  imageIds: z.array(z.string()),
});
/** Proposed API contract only; endpoints must be agreed before enabling API mode. */
export class ApiProjectRepository implements ProjectRepository {
  constructor(private readonly client: AxiosInstance) {}
  async list(signal?: AbortSignal) {
    const { data } = await this.client.get<unknown>('/projects', { signal });
    const result = schema.array().safeParse(data);
    if (!result.success) {
      throw new RepositoryError('invalid-data', 'Invalid project data.');
    }
    return result.data;
  }
  async getById(id: string, signal?: AbortSignal) {
    const { data } = await this.client.get<unknown>(
      `/projects/${encodeURIComponent(id)}`,
      { signal },
    );
    const result = schema.safeParse(data);
    if (!result.success) {
      throw new RepositoryError('invalid-data', 'Invalid project data.');
    }
    return result.data;
  }
}
