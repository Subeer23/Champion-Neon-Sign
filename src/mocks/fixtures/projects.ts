import type { Project } from '../../features/projects/domain/Project';
export const projectFixtures: readonly Project[] = [
  {
    id: 'branding',
    title: 'Branding',
    summary:
      'Visual identity, messaging and brand positioning for new and existing brands.',
    description:
      'Champion Group creates cohesive brand strategies spanning visual identity, messaging and positioning. The website describes work for both new brands and existing identities, with consistency across platforms.',
    solutionIds: ['branding'],
    imageIds: ['branding'],
    sourceUrl: 'https://championgroup.ae/project/branding/',
  },
  {
    id: 'led-screens',
    title: 'LED Screens',
    summary:
      'Indoor and outdoor LED displays for advertising, events, retail and corporate spaces.',
    description:
      'Champion Group provides LED indoor and outdoor screen solutions for advertising, events, retail spaces, corporate environments and public venues. Services span consultation, design, installation and support.',
    solutionIds: ['led-screens'],
    imageIds: ['led', 'led-portrait', 'led-display'],
    sourceUrl: 'https://championgroup.ae/project/led-screens/',
  },
  {
    id: 'exhibition-stands',
    title: 'Exhibition Stands',
    summary:
      'Custom exhibition stands for exhibitions, trade shows and corporate events.',
    description:
      'Champion Group designs and delivers custom exhibition stands. Its services cover concept, design, fabrication and installation, with stands tailored to the space and brand.',
    solutionIds: ['exhibitions'],
    imageIds: ['exhibition', 'exhibition-stand-a'],
    sourceUrl: 'https://championgroup.ae/project/exhibition-stands/',
  },
  {
    id: 'events',
    title: 'Events',
    summary: 'Event services from planning to execution.',
    description:
      'The official Events page presents event services from planning through execution. It does not identify a client, event date or location; these images are presented as a website showcase.',
    solutionIds: ['events'],
    imageIds: ['events-showcase', 'events-hero'],
    sourceUrl: 'https://championgroup.ae/project/events/',
  },
];
