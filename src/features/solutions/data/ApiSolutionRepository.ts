import type { AxiosInstance } from 'axios';
import { z } from 'zod';
import { RepositoryError } from '../../../core/errors/AppError';
import type { SolutionRepository } from '../domain/SolutionRepository';
const schema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string(),
  imageId: z.string().optional(),
  sourceUrl: z.string().url().optional(),
});
/** Proposed API contract only; endpoints must be agreed before enabling API mode. */
export class ApiSolutionRepository implements SolutionRepository {
  constructor(private readonly client: AxiosInstance) {}
  async list(signal?: AbortSignal) {
    const { data } = await this.client.get<unknown>('/solutions', { signal });
    const result = schema.array().safeParse(data);
    if (!result.success) {
      throw new RepositoryError('invalid-data', 'Invalid solution data.');
    }
    return result.data;
  }
  async getById(id: string, signal?: AbortSignal) {
    const { data } = await this.client.get<unknown>(
      `/solutions/${encodeURIComponent(id)}`,
      { signal },
    );
    const result = schema.safeParse(data);
    if (!result.success) {
      throw new RepositoryError('invalid-data', 'Invalid solution data.');
    }
    return result.data;
  }
}
