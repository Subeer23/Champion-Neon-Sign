import type { ImageSourcePropType } from 'react-native';
import { images } from '../../../assets/images';
// Verified against championgroup.ae. Photos depict published service showcases,
// not independently documented client case studies.
export const solutionImages: Record<string, ImageSourcePropType> = {
  signage: images.experience,
  branding: images.branding,
  'led-screens': images.led,
};
export const projectImages: Record<string, ImageSourcePropType> = {
  branding: images.branding,
  'led-screens': images.led,
};
export const clientPreview = [
  { name: 'ADNOC', image: images.adnoc },
  { name: 'Super General', image: images.superGeneral },
  { name: 'Jumbo', image: images.jumbo },
];
export const expertise = [
  {
    number: '01',
    title: 'Signage & branding',
    detail: 'Visual identity, signage and graphics.',
  },
  {
    number: '02',
    title: 'Digital experiences',
    detail: 'LED screens, LCD displays and interactive solutions.',
  },
  {
    number: '03',
    title: 'Spaces & experiences',
    detail: 'Exhibition stands, events and interiors.',
  },
];
export const reasons = [
  {
    title: 'Established in 1989',
    detail: 'A longstanding presence in visual communication.',
  },
  {
    title: 'From concept to installation',
    detail: 'Design, fabrication, installation and maintenance.',
  },
  {
    title: 'Built around your brand',
    detail: 'Custom solutions shaped to your requirements.',
  },
];
