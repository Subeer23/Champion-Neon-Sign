import type { AuthRepository } from '../../features/auth/domain/AuthRepository';
import type { PreferencesStorage } from '../../core/storage/PreferencesStorage';
import type { ProjectRepository } from '../../features/projects/domain/ProjectRepository';
import type { SolutionRepository } from '../../features/solutions/domain/SolutionRepository';
export interface Repositories {
  solutions: SolutionRepository;
  projects: ProjectRepository;
}
export interface AppDependencies {
  demo: AuthRepository;
  repositories: Repositories;
  preferences: PreferencesStorage;
}
