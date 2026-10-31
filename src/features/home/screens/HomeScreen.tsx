import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import type { TabScreenProps } from '../../../app/navigation/types';
import { AppText, Button } from '../../../design-system/components';
import { BrandLogo } from '../../../design-system/components/BrandLogo';
import { BrandImage } from '../../../design-system/components/BrandImage';
import { FadeIn } from '../../../design-system/components/FadeIn';
import { colors } from '../../../design-system/tokens/colors';
import { images } from '../../../assets/images';
import { useGetSolutionsQuery } from '../../solutions/state/solutionsApi';
import { useGetProjectsQuery } from '../../projects/state/projectsApi';
import { QueryState } from '../../../shared/components/QueryState';
import { SectionHeading } from '../components/SectionHeading';
import { ShowcaseCard } from '../components/ShowcaseCard';
import {
  clientPreview,
  expertise,
  reasons,
  solutionImages,
  projectImages,
} from '../data/homeContent';
export function HomeScreen({ navigation }: TabScreenProps<'Home'>) {
  const { width } = useWindowDimensions();
  const wide = width >= 680;
  const solutions = useGetSolutionsQuery();
  const projects = useGetProjectsQuery();
  const focused = useIsFocused();
  return (
    <View style={styles.screen}>
      {focused && <StatusBar barStyle="light-content" />}
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.top}>
        <View style={styles.header}>
          <BrandLogo />
          <Button
            label="Get a quote"
            onPress={() => navigation.navigate('GetQuote')}
          />
        </View>
      </SafeAreaView>
      <SafeAreaView edges={['left', 'right']} style={styles.scrollArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <FadeIn style={styles.content}>
            <View style={styles.hero}>
              <BrandImage
                source={images.exhibition}
                accessibilityLabel="Exhibition stand showcased by Champion Group"
                style={[styles.heroImage, wide && styles.heroImageWide]}
                resizeMode="cover"
              />
              <View style={styles.heroCopy}>
                <AppText style={styles.kicker}>VISION. CRAFT. IMPACT.</AppText>
                <AppText
                  accessibilityRole="header"
                  style={[styles.heroTitle, wide && styles.heroTitleWide]}
                >
                  Make your brand{'\n'}impossible to miss.
                </AppText>
                <AppText style={styles.heroDescription}>
                  Signage, digital displays and spaces that bring your identity
                  to life.
                </AppText>
                <Button
                  label="Start your project"
                  onPress={() => navigation.navigate('GetQuote')}
                />
                <View style={styles.heroFoot}>
                  <View style={styles.redLine} />
                  <AppText variant="caption" style={styles.light}>
                    VISUAL COMMUNICATION / SINCE 1989
                  </AppText>
                </View>
              </View>
            </View>
            <View style={styles.section}>
              <SectionHeading
                eyebrow="WELCOME TO CHAMPION GROUP"
                title="Ideas made visible."
              />
              <AppText muted>
                We design and build signage and visual communication solutions
                in the UAE. From the first concept to installation, our work
                connects your brand with the world around it.
              </AppText>
              <Button
                label="Our story"
                variant="secondary"
                onPress={() => navigation.navigate('AboutUs')}
              />
            </View>
            <View style={styles.section}>
              <SectionHeading
                eyebrow="WHAT WE DO"
                title="Solutions with presence."
              />
              <QueryState
                loading={solutions.isLoading}
                error={solutions.isError}
                empty={solutions.data?.length === 0}
                onRetry={solutions.refetch}
              />
              <View style={styles.grid}>
                {solutions.data?.slice(0, 3).map(item => (
                  <View key={item.id} style={wide ? styles.third : styles.full}>
                    <ShowcaseCard
                      compact
                      title={item.title}
                      subtitle={item.summary}
                      image={solutionImages[item.id] ?? images.experience}
                      onPress={() =>
                        navigation.navigate('SolutionDetails', {
                          solutionId: item.id,
                        })
                      }
                    />
                  </View>
                ))}
              </View>
              <Button
                label="Explore solutions"
                variant="secondary"
                onPress={() => navigation.navigate('Solutions')}
              />
            </View>
            <View style={styles.expertise}>
              <AppText style={styles.kicker}>OUR EXPERTISE</AppText>
              <AppText
                variant="title"
                accessibilityRole="header"
                style={styles.white}
              >
                One vision.{'\n'}Many possibilities.
              </AppText>
              {expertise.map(item => (
                <View key={item.number} style={styles.expertiseRow}>
                  <AppText style={styles.number}>{item.number}</AppText>
                  <View style={styles.flex}>
                    <AppText variant="heading" style={styles.white}>
                      {item.title}
                    </AppText>
                    <AppText style={styles.light}>{item.detail}</AppText>
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.section}>
              <SectionHeading
                eyebrow="OUR WORK"
                title="See the possibilities."
              />
              <AppText muted>
                Explore selected showcases from Champion Group.
              </AppText>
              <QueryState
                loading={projects.isLoading}
                error={projects.isError}
                empty={projects.data?.length === 0}
                onRetry={projects.refetch}
              />
              <View style={styles.grid}>
                {projects.data?.slice(0, 2).map(item => (
                  <View key={item.id} style={wide ? styles.half : styles.full}>
                    <ShowcaseCard
                      title={item.title}
                      subtitle="CHAMPION GROUP / SHOWCASE"
                      image={projectImages[item.id] ?? images.exhibition}
                      onPress={() =>
                        navigation.navigate('ProjectDetails', {
                          projectId: item.id,
                        })
                      }
                    />
                  </View>
                ))}
              </View>
              <Button
                label="View projects"
                variant="secondary"
                onPress={() => navigation.navigate('Projects')}
              />
            </View>
            <View style={styles.section}>
              <SectionHeading
                eyebrow="WHY CHAMPION"
                title="Craft. Care. Commitment."
              />
              {reasons.map((item, i) => (
                <View style={styles.reason} key={item.title}>
                  <View style={styles.reasonNumber}>
                    <AppText style={styles.reasonDigit}>{`0${i + 1}`}</AppText>
                  </View>
                  <View style={styles.flex}>
                    <AppText variant="heading">{item.title}</AppText>
                    <AppText muted>{item.detail}</AppText>
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.section}>
              <SectionHeading eyebrow="OUR CLIENTS" title="In good company." />
              <View style={styles.clients}>
                {clientPreview.map(client => (
                  <View key={client.name} style={styles.client}>
                    <BrandImage
                      accessibilityLabel={client.name}
                      source={client.image}
                      resizeMode="contain"
                      style={styles.clientLogo}
                    />
                  </View>
                ))}
              </View>
              <Button
                label="Meet our clients"
                variant="secondary"
                onPress={() => navigation.navigate('Clients')}
              />
            </View>
            <View style={styles.contact}>
              <AppText style={styles.kicker}>
                LET’S CREATE SOMETHING DISTINCTIVE
              </AppText>
              <AppText style={styles.heroTitle} accessibilityRole="header">
                Your next idea{'\n'}starts here.
              </AppText>
              <AppText style={styles.light}>
                Tell us what you have in mind. Let’s explore the possibilities
                together.
              </AppText>
              <Button
                label="Get a quote"
                onPress={() => navigation.navigate('GetQuote')}
              />
              <Button
                label="Contact our team"
                variant="secondary"
                onPress={() => navigation.navigate('ContactUs')}
              />
              <AppText variant="caption" style={styles.light}>
                Dubai Investments Park 2 · UAE
              </AppText>
            </View>
            <AppText variant="caption" muted style={styles.footer}>
              CHAMPION GROUP · IDEAS MADE VISIBLE
            </AppText>
          </FadeIn>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  scrollArea: { flex: 1 },
  screen: { flex: 1, backgroundColor: colors.background },
  top: { backgroundColor: colors.dark },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
    maxWidth: 1100,
    width: '100%',
    alignSelf: 'center',
  },
  scroll: { paddingBottom: 24 },
  content: { gap: 36, width: '100%', maxWidth: 1100, alignSelf: 'center' },
  hero: { backgroundColor: colors.dark },
  heroImage: { height: 220, width: '100%' },
  heroImageWide: { height: 340 },
  heroCopy: { padding: 28, gap: 20 },
  kicker: {
    fontFamily: 'Manrope-Bold',
    fontSize: 10,
    letterSpacing: 1.8,
    color: colors.accentOnDark,
  },
  heroTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 34,
    lineHeight: 43,
    color: colors.onDark,
  },
  heroTitleWide: { fontSize: 44, lineHeight: 54 },
  heroDescription: { color: colors.mutedOnDark, maxWidth: 550 },
  heroFoot: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  redLine: { width: 24, height: 2, backgroundColor: colors.primary },
  light: { color: colors.mutedOnDark },
  white: { color: colors.onDark },
  section: { marginHorizontal: 24, gap: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  full: { width: '100%' },
  half: { width: '48%' },
  third: { width: '31%' },
  expertise: {
    backgroundColor: colors.dark,
    marginHorizontal: 16,
    padding: 28,
    borderRadius: 24,
    gap: 24,
  },
  expertiseRow: {
    flexDirection: 'row',
    gap: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.borderDark,
  },
  number: {
    color: colors.accentOnDark,
    fontFamily: 'Manrope-SemiBold',
    fontSize: 13,
  },
  flex: { flex: 1, gap: 8 },
  reason: {
    flexDirection: 'row',
    gap: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  reasonNumber: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reasonDigit: { color: colors.primaryStrong, fontFamily: 'Manrope-Bold' },
  clients: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  client: {
    flexGrow: 1,
    flexBasis: 120,
    backgroundColor: colors.onDark,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  clientLogo: { width: 110, height: 56 },
  contact: {
    backgroundColor: colors.dark,
    padding: 28,
    marginHorizontal: 16,
    borderRadius: 24,
    gap: 20,
  },
  footer: { textAlign: 'center', letterSpacing: 1 },
});
