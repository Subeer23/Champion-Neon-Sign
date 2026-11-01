import { Linking } from 'react-native';

// CID converted losslessly from the official homepage embed's business feature
// 0x3e5f58126fb99783:0x944cdf610b8a58fd. Embed viewport coordinates are not a pin.
export const mapsSearchFallback =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent(
    'Champion Neon Headquarters, Champion Group, Dubai Investments Park 2, Dubai, UAE',
  );

/** HTTPS links use the installed handler (Google Maps/WhatsApp or browser).
 * Avoid canOpenURL for HTTPS: OS scheme-query restrictions can return false
 * even when a browser can open the link. No native scheme declarations needed.
 */
export async function openContactLink(url: string): Promise<void> {
  if (!/^(https:\/\/|tel:\+|mailto:)/.test(url)) {
    throw new Error('Unsupported contact link.');
  }
  if (!url.startsWith('https://') && !(await Linking.canOpenURL(url))) {
    throw new Error(
      'No compatible app is available. Please use the contact details shown below.',
    );
  }
  try {
    await Linking.openURL(url);
  } catch (error) {
    if (url === 'https://www.google.com/maps?cid=10686161623741782269') {
      await Linking.openURL(mapsSearchFallback);
      return;
    }
    throw error;
  }
}
