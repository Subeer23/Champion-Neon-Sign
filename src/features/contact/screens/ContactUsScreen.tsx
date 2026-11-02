import { useAsyncAction } from '../../../shared/hooks/useAsyncAction';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View, ActivityIndicator } from 'react-native';
import type { RootNavigation } from '../../../app/navigation/types';
import { AppText, Button } from '../../../design-system/components';
import { colors } from '../../../design-system/tokens/colors';
import { Screen } from '../../../shared/components/Screen';
import { LineIcon, type IconName } from '../../../shared/components/LineIcon';
import { companyContent } from '../../../mocks/fixtures/company';
import { openContactLink } from '../services/openContactLink';
export function ContactUsScreen({
  navigation,
}: {
  navigation: RootNavigation;
}) {
  const request = useAsyncAction();
  const [label, setLabel] = useState<string | null>(null);
  const busy = request.busy ? label : null;
  const error = request.error;
  const contact = companyContent.contact;
  function open(nextLabel: string, url: string) {
    return request.run(async () => {
      setLabel(nextLabel);
      try {
        await openContactLink(url);
      } catch {
        throw new Error(
          'Unable to open this action. Use the contact details below or try again.',
        );
      }
    });
  }
  const actions: {
    label: string;
    title: string;
    detail: string;
    url: string;
    icon: IconName;
  }[] = [
    {
      label: 'Call Champion Group',
      title: 'Call Us',
      detail: contact.phone,
      url: contact.telephoneUrl,
      icon: 'phone',
    },
    {
      label: 'Chat on WhatsApp',
      title: 'WhatsApp',
      detail: '+971 55 318 2020',
      url: contact.whatsappUrl,
      icon: 'phone',
    },
    {
      label: 'Email Champion Group',
      title: 'Email Us',
      detail: contact.email,
      url: `mailto:${contact.email}`,
      icon: 'mail',
    },
    {
      label: 'Open Maps',
      title: 'Visit Our Experience Center',
      detail: contact.address,
      url: contact.mapsUrl,
      icon: 'pin',
    },
  ];
  return (
    <Screen>
      <AppText variant="title" style={styles.red}>
        Let’s Work Together.
      </AppText>
      <AppText muted>
        Bring your vision to life with signage, branding and digital displays.
      </AppText>
      {error && (
        <AppText accessibilityRole="alert" style={styles.red}>
          {error}
        </AppText>
      )}
      {actions.map(action => (
        <Pressable
          key={action.label}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          accessibilityState={{
            disabled: busy !== null,
            busy: busy === action.label,
          }}
          disabled={busy !== null}
          onPress={() => open(action.label, action.url)}
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
        >
          <LineIcon name={action.icon} size={28} />
          <View style={styles.copy}>
            <AppText variant="label">{action.title}</AppText>
            <AppText variant="caption" muted selectable>
              {action.detail}
            </AppText>
          </View>
          {busy === action.label ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <AppText muted>↗</AppText>
          )}
        </Pressable>
      ))}
      <View style={styles.hours}>
        {contact.hours.map(line => (
          <AppText key={line} variant="caption" muted>
            {line}
          </AppText>
        ))}
      </View>
      <Button
        label="Get a Quote"
        onPress={() => navigation.navigate('GetQuote')}
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  red: { color: colors.accentOnDark },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 18,
    minHeight: 84,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
  copy: { flex: 1, gap: 5 },
  pressed: { backgroundColor: colors.surfaceSecondary },
  hours: { gap: 8, paddingVertical: 12 },
});
