import React, {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type PropsWithChildren,
} from 'react';
import type { AuthRepository } from '../domain/AuthRepository';
const Context = createContext<AuthRepository | null>(null);
export function AuthRepositoryProvider({
  children,
  repository,
}: PropsWithChildren<{ repository: AuthRepository }>) {
  return <Context.Provider value={repository}>{children}</Context.Provider>;
}
export function useAuthRepository() {
  const repository = useContext(Context);
  if (!repository) throw new Error('Auth repository provider is missing.');
  return repository;
}

export function useDemoSnapshot() {
  const repository = useAuthRepository();
  return useSyncExternalStore(
    repository.subscribe,
    repository.getSnapshot,
    repository.getSnapshot,
  );
}

/** Select a stable field or item; selectors should not allocate new objects. */
export function useDemoSelector<T>(
  selector: (snapshot: import('../../account/domain/models').DemoSnapshot) => T,
): T {
  const repository = useAuthRepository();
  const getSelected = useCallback(
    () => selector(repository.getSnapshot()),
    [repository, selector],
  );
  return useSyncExternalStore(repository.subscribe, getSelected, getSelected);
}
