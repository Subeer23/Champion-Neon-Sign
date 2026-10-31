import React, { useState } from 'react';
import { View, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import type { RootScreenProps } from '../../../app/navigation/types';
import { AppText, Button, Card } from '../../../design-system/components';
import { BrandImage } from '../../../design-system/components/BrandImage';
import { colors } from '../../../design-system/tokens/colors';
import { getImage } from '../../../assets/images';
import { Screen } from '../../../shared/components/Screen';
import { ContentMedia } from '../../../shared/components/ContentMedia';
import { SearchField } from '../../../shared/components/SearchField';
import { companyContent } from '../../../mocks/fixtures/company';
export function AboutUsScreen({ navigation }: RootScreenProps<'AboutUs'>) {
  return (
    <Screen>
      <ContentMedia
        imageId="experience"
        title="Champion Group experience center"
      />
      <AppText style={styles.eyebrow}>SINCE 1989</AppText>
      <AppText variant="title" accessibilityRole="header">
        Ideas made visible.
      </AppText>
      <AppText>{companyContent.introduction}</AppText>
      <Card>
        <AppText variant="heading">From concept to installation</AppText>
        <AppText muted>{companyContent.expertise}</AppText>
      </Card>
      <Card>
        <AppText variant="heading">Quality & craftsmanship</AppText>
        <AppText muted>{companyContent.quality}</AppText>
      </Card>
      <Button
        label="Explore our solutions"
        variant="secondary"
        onPress={() => navigation.navigate('MainTabs', { screen: 'Solutions' })}
      />
      <Button
        label="Contact our team"
        onPress={() => navigation.navigate('ContactUs')}
      />
    </Screen>
  );
}
export function ClientsScreen() {
  const { width, fontScale } = useWindowDimensions();
  const columns = width / fontScale >= 600 ? 3 : 2;
  return (
    <Screen>
      <AppText style={styles.eyebrow}>OUR CLIENTS</AppText>
      <AppText variant="title" accessibilityRole="header">
        In good company.
      </AppText>
      <AppText muted>Client logos published by Champion Group.</AppText>
      <View style={styles.grid}>
        {companyContent.clients.map(client => (
          <View
            key={client.name}
            style={[
              styles.logoCard,
              columns === 3 ? styles.third : styles.half,
            ]}
          >
            <BrandImage
              source={getImage(client.imageId)!}
              accessibilityLabel={client.name}
              resizeMode="contain"
              style={styles.logo}
            />
          </View>
        ))}
      </View>
      {companyContent.clients.length === 0 && (
        <AppText muted>No client logos available.</AppText>
      )}
      <AppText variant="title" accessibilityRole="header">
        What our clients say
      </AppText>
      <AppText muted>
        Testimonials reproduced from the official Champion Group website.
      </AppText>
      {companyContent.testimonials.length === 0 && (
        <AppText muted>No published testimonials available.</AppText>
      )}
      {companyContent.testimonials.map(item => (
        <Card key={item.id}>
          {item.imageId && getImage(item.imageId) && (
            <BrandImage
              source={getImage(item.imageId)!}
              accessibilityLabel={`${item.name} — image published with testimonial`}
              resizeMode="contain"
              style={styles.testimonialImage}
            />
          )}
          <AppText style={styles.quote}>“{item.quote}”</AppText>
          <AppText variant="label">{item.name}</AppText>
          <AppText variant="caption" muted>
            {item.role} · Champion Group website
          </AppText>
        </Card>
      ))}
    </Screen>
  );
}
export function FAQsScreen() {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const entries = companyContent.faqs.filter(item =>
    `${item.question} ${item.answer}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  return (
    <Screen>
      <AppText variant="title" accessibilityRole="header">
        Your questions, answered.
      </AppText>
      <AppText muted>Answers published by Champion Group.</AppText>
      <SearchField label="Search FAQs" value={query} onChangeText={setQuery} />
      {entries.length === 0 && (
        <AppText muted>No matching questions. Try another search.</AppText>
      )}
      {entries.map(item => (
        <View key={item.id} style={styles.accordion}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={item.question}
            accessibilityState={{ expanded: expanded === item.id }}
            onPress={() => setExpanded(expanded === item.id ? null : item.id)}
            style={({ pressed }) => [
              styles.question,
              pressed && styles.pressed,
            ]}
          >
            <AppText variant="label" style={styles.questionText}>
              {item.question}
            </AppText>
            <AppText style={styles.indicator} accessible={false}>
              {expanded === item.id ? '−' : '+'}
            </AppText>
          </Pressable>
          {expanded === item.id && (
            <AppText style={styles.answer}>{item.answer}</AppText>
          )}
        </View>
      ))}
    </Screen>
  );
}
const styles = StyleSheet.create({
  third: { width: '31%' },
  half: { width: '48%' },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.8,
    fontFamily: 'Manrope-Bold',
    color: colors.primaryStrong,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  logoCard: {
    height: 110,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { width: '100%', maxWidth: 140, height: 65 },
  testimonialImage: { width: 48, height: 48 },
  quote: { fontSize: 15, lineHeight: 25 },
  accordion: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  question: {
    minHeight: 56,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  questionText: { flex: 1 },
  indicator: { fontSize: 24, color: colors.primary },
  answer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    fontSize: 15,
    lineHeight: 24,
  },
  pressed: { opacity: 0.65 },
});
