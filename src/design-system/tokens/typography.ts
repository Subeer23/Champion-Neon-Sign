import type { TextStyle } from 'react-native';
export const typography = {
  title: { fontFamily: 'Manrope-Bold', fontSize: 28, lineHeight: 36 },
  heading: { fontFamily: 'Manrope-SemiBold', fontSize: 20, lineHeight: 28 },
  body: { fontFamily: 'Manrope-Regular', fontSize: 16, lineHeight: 24 },
  label: { fontFamily: 'Manrope-SemiBold', fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: 'Manrope-Regular', fontSize: 12, lineHeight: 18 },
} satisfies Record<string, TextStyle>;
