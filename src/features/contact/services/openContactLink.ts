import { Linking } from 'react-native';
/** External actions are user initiated; no requests are made during rendering. */
export async function openContactLink(url: string): Promise<void> {
  if (!/^(https:\/\/|tel:\+|mailto:)/.test(url))
    throw new Error('Unsupported contact link.');
  if (!(await Linking.canOpenURL(url)))
    throw new Error(
      'No compatible app is available. Please use the contact details shown below.',
    );
  await Linking.openURL(url);
}
