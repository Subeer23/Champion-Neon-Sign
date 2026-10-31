import type { ImageSourcePropType } from 'react-native';
export const images = {
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
