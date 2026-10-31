export type ErrorCode =
  | 'not-found'
  | 'network'
  | 'invalid-data'
  | 'cancelled'
  | 'unknown';
export interface AppError {
  code: ErrorCode;
  message: string;
}
export class RepositoryError extends Error {
  constructor(public readonly code: ErrorCode, message: string) {
    super(message);
    this.name = 'RepositoryError';
  }
}
export function toAppError(error: unknown): AppError {
  if (error instanceof RepositoryError) {
    return { code: error.code, message: error.message };
  }
  return {
    code: 'unknown',
    message: 'Something went wrong. Please try again.',
  };
}
