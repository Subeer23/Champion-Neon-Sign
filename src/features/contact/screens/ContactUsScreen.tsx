import React, { useState } from 'react';
import type { RootScreenProps } from '../../../app/navigation/types';
import { AppText, Button, Card } from '../../../design-system/components';
import { Screen } from '../../../shared/components/Screen';
import { ContentMedia } from '../../../shared/components/ContentMedia';
import { companyContent } from '../../../mocks/fixtures/company';
import { openContactLink } from '../services/openContactLink';
export function ContactUsScreen({ navigation }: RootScreenProps<'ContactUs'>) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const contact = companyContent.contact;
  async function open(label: string, url: string) {
    setError(null);
    setBusy(label);
    try {
      await openContactLink(url);
    } catch {
      setError(
        'Unable to open this action. Check that a compatible app is installed, or use the contact details below.',
      );
    } finally {
      setBusy(null);
    }
  }
  return (
    <Screen>
      <ContentMedia
        imageId="experience"
        title="Champion Group experience center"
      />
      <AppText variant="title" accessibilityRole="header">
        Let’s connect.
      </AppText>
      <AppText muted>{companyContent.introduction}</AppText>
      {error && <AppText accessibilityRole="alert">{error}</AppText>}
      <Card>
        <AppText variant="heading">Speak with our team</AppText>
        <AppText selectable>{contact.phone}</AppText>
        <AppText selectable>{contact.email}</AppText>
        <Button
          label="Call Champion Group"
          loading={busy === 'Call'}
          disabled={busy !== null}
          onPress={() => open('Call', contact.telephoneUrl)}
        />
        <Button
          label="Email Champion Group"
          variant="secondary"
          loading={busy === 'Email'}
          disabled={busy !== null}
          onPress={() => open('Email', `mailto:${contact.email}`)}
        />
        <Button
          label="Chat on WhatsApp"
          variant="secondary"
          loading={busy === 'WhatsApp'}
          disabled={busy !== null}
          onPress={() => open('WhatsApp', contact.whatsappUrl)}
        />
      </Card>
      <Card>
        <AppText variant="heading">Visit our experience center</AppText>
        <AppText selectable>{contact.address}</AppText>
        {contact.hours.map(line => (
          <AppText key={line} muted>
            {line}
          </AppText>
        ))}
        <Button
          label="Open Maps"
          variant="secondary"
          loading={busy === 'Maps'}
          disabled={busy !== null}
          onPress={() => open('Maps', contact.mapsUrl)}
        />
      </Card>
      <Button
        label="Get a Quote"
        onPress={() => navigation.navigate('GetQuote')}
      />
    </Screen>
  );
}
