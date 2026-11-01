import { solutionFixtures } from '../mocks/fixtures/solutions';
import { companyContent } from '../mocks/fixtures/company';
import { solutionIcons } from '../assets/images/solutionIcons';
import { getImage } from '../assets/images';
import sources from '../assets/images/content-update-sources.json';

it('resolves official media or the original website icon for every service', () => {
  expect(solutionFixtures).toHaveLength(16);
  for (const item of solutionFixtures) {
    const icon = solutionIcons[item.title.toUpperCase()];
    expect(icon).toBeDefined();
    expect(icon!.paths.length).toBeGreaterThan(0);
    if (item.imageId) expect(getImage(item.imageId)).toBeDefined();
  }
  expect(solutionFixtures.find(item => item.id === 'signage')?.imageId).toBe(
    'events-showcase',
  );
});
it('includes the complete current client section and all six attributed testimonials', () => {
  expect(companyContent.clients.map(item => item.name)).toEqual([
    'ADNOC',
    'Gree',
    'Super General',
    'Mister Baker',
    'Canadian University Dubai',
    'Jumbo',
    'Emax',
    'General',
    'ENOC',
  ]);
  expect(companyContent.testimonials.map(item => item.name)).toEqual([
    'Julian Leo Sirrao',
    'Syed Adil',
    'Dolphin Stationery',
    'CEO CLUBS NETWORK',
    'Mihir Sanganee',
    'Namra Masood',
  ]);
  for (const item of companyContent.testimonials) {
    expect(getImage(item.imageId)).toBeDefined();
    expect(item.quote.length).toBeGreaterThan(50);
  }
});
it('bundles every newly sourced asset with an official URL and verification date', () => {
  for (const item of sources) {
    expect(item.sourceUrl).toMatch(/^https:\/\/championgroup\.ae\//);
    expect(item.verifiedOn).toBe('2026-10-31');
    expect(getImage(item.id)).toBeDefined();
  }
});
