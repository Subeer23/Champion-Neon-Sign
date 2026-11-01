import originalAssets from '../assets/images/sources.json';
import contentUpdateAssets from '../assets/images/content-update-sources.json';
import phase3Assets from '../assets/images/phase3-sources.json';
import visualSelections from '../assets/images/visual-selection-sources.json';
import { companyContent } from './fixtures/company';
import { solutionFixtures } from './fixtures/solutions';
import { projectFixtures } from './fixtures/projects';
export interface ContentSource {
  id: string;
  sourceUrl: string;
  verifiedOn: string;
  assetIds: readonly string[];
  treatment: 'verbatim' | 'summary' | 'asset';
  note?: string;
}
const verifiedOn = '2026-10-31';
const home = 'https://championgroup.ae/';
export const sourceManifest: readonly ContentSource[] = [
  ...visualSelections.map(item => ({
    id: `visual-selection:${item.imageId}`,
    sourceUrl: item.sourceUrl,
    verifiedOn: item.verifiedOn,
    assetIds: [item.imageId],
    treatment: 'asset' as const,
    note: `${item.note} Screens: ${item.screens.join(', ')}. Page: ${
      item.pageUrl
    }`,
  })),
  ...companyContent.faqs.map(item => ({
    id: item.id,
    sourceUrl: `${home}#faqs`,
    verifiedOn,
    assetIds: [],
    treatment: 'verbatim' as const,
  })),
  ...companyContent.testimonials.map(item => ({
    id: item.id,
    sourceUrl: home,
    verifiedOn,
    assetIds: item.imageId ? [item.imageId] : [],
    treatment: 'verbatim' as const,
    note: `Homepage Testimonials section; attribution: ${item.name}`,
  })),
  ...companyContent.clients.map(item => ({
    id: `client:${item.name}`,
    sourceUrl: `${home}#clients`,
    verifiedOn,
    assetIds: [item.imageId],
    treatment: 'asset' as const,
  })),

  ...solutionFixtures.map(item => ({
    id: `solution:${item.id}`,
    sourceUrl: `${home}#services`,
    verifiedOn,
    assetIds: item.imageId ? [item.imageId] : [],
    treatment: 'verbatim' as const,
    note: 'Website uppercase category labels displayed in title case. Dedicated image unavailable unless referenced.',
  })),
  ...projectFixtures.map(item => ({
    id: `project:${item.id}`,
    sourceUrl: `${home}project/${item.id}/`,
    verifiedOn,
    assetIds: item.imageIds,
    treatment: 'summary' as const,
    note: 'Service showcase, not independently documented client case study.',
  })),
  ...['about', 'clients', 'faqs', 'contact', 'testimonials'].map(id => ({
    id,
    sourceUrl: `${home}#${id}`,
    verifiedOn,
    assetIds: [],
    treatment: (id === 'about' ? 'summary' : 'verbatim') as
      | 'summary'
      | 'verbatim',
    note:
      id === 'testimonials'
        ? 'Homepage Testimonials section; no separate page or reliable anchor.'
        : undefined,
  })),
  ...Object.entries(originalAssets.files).map(([id, sourceUrl]) => ({
    id,
    sourceUrl,
    verifiedOn,
    assetIds: [id],
    treatment: 'asset' as const,
  })),
  ...contentUpdateAssets.map(item => ({
    id: item.id,
    sourceUrl: item.sourceUrl,
    verifiedOn: item.verifiedOn,
    assetIds: [item.id],
    treatment: 'asset' as const,
  })),
  {
    id: 'solution-icons',
    sourceUrl: `${home}#services`,
    verifiedOn,
    assetIds: ['solutionIcons.ts'],
    treatment: 'asset',
    note: 'Original inline SVG and Disle font glyphs; all 16 categories. Not project photographs.',
  },
  ...phase3Assets.map(item => ({
    id: item.id,
    sourceUrl: item.sourceUrl,
    verifiedOn: item.verifiedOn,
    assetIds: [item.id],
    treatment: 'asset' as const,
    note:
      item.id === 'events-illustration'
        ? 'Website-published illustration; original filename starts ChatGPT-Image. Do not describe as an event photograph.'
        : undefined,
  })),
];
/** Capabilities paraphrased from the homepage FAQs and linked showcase descriptions. */
export const solutionCapabilities: Readonly<Record<string, readonly string[]>> =
  {
    signage: [
      'LED and neon signs; 3D backlit signage',
      'Design, fabrication, installation and maintenance',
    ],
    branding: ['Visual identity, messaging and brand positioning'],
    'lcd-displays': [
      'Fixed and rental displays for events, exhibitions and retail',
    ],
    'led-screens': [
      'Indoor and outdoor screens',
      'Consultation, design, installation and support',
    ],
    exhibitions: [
      'Custom exhibition booth design',
      'Permanent installations and temporary events',
    ],
    kiosks: ['Mall kiosks, POS displays and interactive kiosks'],
    '3d-prints': [
      'Prototypes, custom figures, architectural models and signage accents',
    ],
  };
export const capabilitySources: Readonly<Record<string, string>> = {
  signage: `${home}#faqs`,
  branding: `${home}project/branding/`,
  'lcd-displays': `${home}#faqs`,
  'led-screens': `${home}project/led-screens/`,
  exhibitions: `${home}#faqs`,
  kiosks: `${home}#faqs`,
  '3d-prints': `${home}#faqs`,
};
export const contentLimitations = {
  missingServiceImages: solutionFixtures
    .filter(item => !item.imageId)
    .map(item => item.id),
  galleryIllustrations: [],
  maps: 'Verified 2026-11-01: homepage embed feature 0x3e5f58126fb99783:0x944cdf610b8a58fd, Champion Neon Headquarters. Decimal CID 10686161623741782269. Contact page London Eye placeholder rejected; embed viewport coordinates are not used as a business pin.',
  testimonials:
    'Verbatim website quotations, including original spelling. Attribution is as published; no independent endorsement verification.',
} as const;
