export type DataConfig = { mode: 'mock' } | { mode: 'api'; baseURL: string };
/** No real API host or runtime toggle is shipped in the demo. */
export const dataConfig: DataConfig = { mode: 'mock' };
