import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { RootScreenProps } from '../../../app/navigation/types';
import { AppText, Button, Card } from '../../../design-system/components';
import { Screen } from '../../../shared/components/Screen';
import { colors } from '../../../design-system/tokens/colors';
const destinations = [
  {
    route: 'Profile',
    title: 'Profile',
    detail: 'Demo account and app settings',
  },
  {
    route: 'AboutUs',
    title: 'About Us',
    detail: 'Our story, expertise and craftsmanship',
  },
  { route: 'Clients', title: 'Clients', detail: 'The brands we work with' },
  {
    route: 'Testimonials',
    title: 'Testimonials',
    detail: 'Hear from our clients',
  },
  { route: 'FAQs', title: 'FAQs', detail: 'Answers to your questions' },
  {
    route: 'ContactUs',
    title: 'Contact Us',
    detail: 'Talk to our team or plan a visit',
  },
] as const;
export function MoreScreen({ navigation }: RootScreenProps<'More'>) {
  return (
    <Screen>
      <AppText variant="caption" style={styles.eyebrow}>
        CHAMPION GROUP / SINCE 1989
      </AppText>
      <AppText variant="title" accessibilityRole="header">
        Discover Champion.
      </AppText>
      <AppText muted>
        People, expertise and ideas behind your next project.
      </AppText>
      <Card style={styles.menu}>
        {destinations.map((item, index) => (
          <Pressable
            key={item.route}
            accessibilityRole="button"
            accessibilityLabel={item.title}
            onPress={() => navigation.navigate(item.route)}
            style={({ pressed }) => [
              styles.row,
              index > 0 && styles.divider,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.copy}>
              <AppText variant="heading">{item.title}</AppText>
              <AppText variant="caption" muted>
                {item.detail}
              </AppText>
            </View>
            <AppText style={styles.arrow} accessible={false}>
              ›
            </AppText>
          </Pressable>
        ))}
      </Card>
      <Card>
        <AppText variant="heading">Let’s bring your idea to life.</AppText>
        <AppText muted>
          Start a conversation about your signage, display or space.
        </AppText>
        <Button
          label="Get a Quote"
          onPress={() => navigation.navigate('GetQuote')}
        />
      </Card>
    </Screen>
  );
}
const styles = StyleSheet.create({
  eyebrow: { color: colors.primaryStrong, letterSpacing: 1.2 },
  menu: { padding: 0, gap: 0, overflow: 'hidden' },
  row: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    minHeight: 84,
  },
  divider: { borderTopWidth: 1, borderTopColor: colors.border },
  copy: { flex: 1, gap: 4 },
  arrow: { color: colors.primaryStrong, fontSize: 28, lineHeight: 32 },
  pressed: { backgroundColor: colors.primarySubtle },
});
