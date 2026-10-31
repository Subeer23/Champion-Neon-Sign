import type { Project } from '../../features/projects/domain/Project';
export const projectFixtures: readonly Project[] = [
  {
    id: 'branding',
    title: 'Branding',
    summary: 'A Champion Group service showcase.',
    solutionIds: ['branding'],
    imageIds: [],
  },
  {
    id: 'led-screens',
    title: 'LED Screens',
    summary: 'A Champion Group indoor and outdoor display showcase.',
    solutionIds: ['led-screens'],
    imageIds: [],
  },
];
