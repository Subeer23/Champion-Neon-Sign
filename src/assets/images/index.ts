import type { ImageSourcePropType } from 'react-native';
export const images = {
  'solution-signage': require('./solution-signage.jpg'),
  'testimonial-1': require('./testimonial-1.png'),
  'testimonial-2': require('./testimonial-2.png'),
  'testimonial-3': require('./testimonial-3.png'),
  'testimonial-4': require('./testimonial-4.png'),
  'testimonial-5': require('./testimonial-5.png'),
  'testimonial-6': require('./testimonial-6.png'),

  'led-portrait': require('./led-portrait.jpg'),
  'led-display': require('./led-display.jpg'),
  'exhibition-stand-a': require('./exhibition-stand-a.jpg'),
  'exhibition-stand-b': require('./exhibition-stand-b.jpg'),
  'events-hero': require('./events-hero.jpg'),
  'events-showcase': require('./events-showcase.jpg'),
  'events-illustration': require('./events-illustration.jpg'),
  'client-gree': require('./client-gree.png'),
  'client-mister-baker': require('./client-mister-baker.png'),
  'client-canadian-university-dubai': require('./client-canadian-university-dubai.png'),
  'client-emax': require('./client-emax.png'),
  'client-general': require('./client-general.png'),
  'client-enoc': require('./client-enoc.png'),
  logo: require('./logo.png'),
  experience: require('./experience.png'),
  branding: require('./branding.jpg'),
  led: require('./led.jpg'),
  exhibition: require('./exhibition.jpg'),
  adnoc: require('./adnoc.jpg'),
  superGeneral: require('./super-general.jpg'),
  jumbo: require('./jumbo.png'),
} satisfies Record<string, ImageSourcePropType>;
export type ImageKey = keyof typeof images;

export function getImage(id?: string): ImageSourcePropType | undefined {
  return id && Object.prototype.hasOwnProperty.call(images, id)
    ? images[id as ImageKey]
    : undefined;
}
