import React from 'react';
import {
  ScrollView,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import type { TabScreenProps } from '../../../app/navigation/types';
import { AppText, Button } from '../../../design-system/components';
import { BrandLogo } from '../../../design-system/components/BrandLogo';
import { BrandImage } from '../../../design-system/components/BrandImage';
import { radii, spacing } from '../../../design-system/tokens/spacing';
import { colors } from '../../../design-system/tokens/colors';
import { images } from '../../../assets/images';
import { useGetSolutionsQuery } from '../../solutions/state/solutionsApi';
import { useGetProjectsQuery } from '../../projects/state/projectsApi';
import { QueryState } from '../../../shared/components/QueryState';
import { SectionHeading } from '../components/SectionHeading';
import { ShowcaseCard } from '../components/ShowcaseCard';
import { clientPreview, expertise, reasons } from '../data/homeContent';
export function HomeScreen({ navigation }: TabScreenProps<'Home'>) {
  const { width, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const availableWidth = Math.min(width - insets.left - insets.right, 1100);
  const wide = availableWidth / fontScale >= 680;
  const cardWidth =
    (availableWidth - 40 - spacing.md * (wide ? 2 : 0)) / (wide ? 3 : 1);
  const projectWidth =
    (availableWidth - 40 - (wide ? spacing.md : 0)) / (wide ? 2 : 1);
  const solutions = useGetSolutionsQuery();
  const projects = useGetProjectsQuery();
  const focused = useIsFocused();
  return (
    <View style={styles.screen}>
      {focused && <StatusBar barStyle="light-content" />}
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.top}>
        <View
          style={[
            styles.header,
            (fontScale > 1.4 || availableWidth / fontScale < 300) &&
              styles.headerLargeText,
          ]}
        >
          <BrandLogo style={styles.headerLogo} />
          <Button
            compact
            label="Get a quote"
            onPress={() => navigation.navigate('GetQuote')}
          />
        </View>
      </SafeAreaView>
      <SafeAreaView edges={['left', 'right']} style={styles.scrollArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="never"
          automaticallyAdjustContentInsets={false}
          contentContainerStyle={styles.scroll}
        >
          <View style={styles.content}>
            <View style={styles.hero}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Explore featured exhibition"
                onPress={() =>
                  navigation.navigate('ProjectDetails', {
                    projectId: 'exhibition-stands',
                  })
                }
                style={({ pressed }) => [
                  styles.heroPhoto,
                  pressed && styles.photoPressed,
                ]}
              >
                <BrandImage
                  source={images['exhibition-stand-a']}
                  accessibilityLabel="Exhibition stand and digital display published by Champion Group"
                  style={styles.heroImage}
                  resizeMode="contain"
                />
                <View style={styles.heroPhotoCaption}>
                  <AppText variant="caption" style={styles.white}>
                    EXHIBITIONS & DIGITAL DISPLAYS
                  </AppText>
                  <AppText variant="caption" style={styles.white}>
                    Explore ↗
                  </AppText>
                </View>
              </Pressable>
              <View style={styles.heroCopy}>
                <AppText style={styles.kicker}>
                  QUALITY VISUAL COMMUNICATION
                </AppText>
                <AppText
                  accessibilityRole="header"
                  style={[styles.heroTitle, wide && styles.heroTitleWide]}
                >
                  Elevate Your Brand With Champion.
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
              <AppText muted style={styles.paragraph}>
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
                {solutions.data
                  ?.filter(item =>
                    ['signage', 'branding', 'led-screens'].includes(item.id),
                  )
                  .map(item => (
                    <View key={item.id} style={{ width: cardWidth }}>
                      <ShowcaseCard
                        title={item.title}
                        subtitle={item.summary}
                        imageId={item.imageId}
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
                style={[styles.white, styles.sectionTitle]}
              >
                One vision.{'\n'}Many possibilities.
              </AppText>
              {expertise.map(item => (
                <View key={item.number} style={styles.expertiseRow}>
                  <AppText style={styles.number}>{item.number}</AppText>
                  <View style={styles.flex}>
                    <AppText
                      variant="heading"
                      style={[styles.white, styles.itemTitle]}
                    >
                      {item.title}
                    </AppText>
                    <AppText style={[styles.light, styles.paragraph]}>
                      {item.detail}
                    </AppText>
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.section}>
              <SectionHeading
                eyebrow="OUR WORK"
                title="See the possibilities."
              />
              <AppText muted style={styles.paragraph}>
                Explore selected showcases from Champion Group.
              </AppText>
              <QueryState
                loading={projects.isLoading}
                error={projects.isError}
                empty={projects.data?.length === 0}
                onRetry={projects.refetch}
              />
              <View style={styles.grid}>
                {projects.data?.slice(0, 4).map(item => (
                  <View key={item.id} style={{ width: projectWidth }}>
                    <ShowcaseCard
                      title={item.title}
                      subtitle={item.summary}
                      imageId={item.imageIds[0]}
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
                <View
                  style={[
                    styles.reason,
                    i === reasons.length - 1 && styles.lastReason,
                  ]}
                  key={item.title}
                >
                  <View style={styles.reasonNumber}>
                    <AppText style={styles.reasonDigit}>{`0${i + 1}`}</AppText>
                  </View>
                  <View style={styles.flex}>
                    <AppText variant="heading" style={styles.itemTitle}>
                      {item.title}
                    </AppText>
                    <AppText muted style={styles.paragraph}>
                      {item.detail}
                    </AppText>
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.section}>
              <SectionHeading eyebrow="OUR CLIENTS" title="In good company." />
              <View style={styles.clients}>
                {clientPreview.map(client => (
                  <View
                    key={client.name}
                    style={[
                      styles.client,
                      { width: (availableWidth - 40 - spacing.sm * 2) / 3 },
                    ]}
                  >
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
              <View style={styles.contactActions}>
                <Button
                  label="Get a quote"
                  onPress={() => navigation.navigate('GetQuote')}
                />
                <Button
                  label="Contact our team"
                  variant="secondary"
                  onPress={() => navigation.navigate('ContactUs')}
                />
              </View>
              <AppText variant="caption" style={styles.light}>
                Dubai Investments Park 2 · UAE
              </AppText>
            </View>
            <AppText variant="caption" muted style={styles.footer}>
              CHAMPION GROUP · IDEAS MADE VISIBLE
            </AppText>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  scrollArea: { flex: 1 },
  screen: { flex: 1, backgroundColor: colors.background },
  top: { backgroundColor: '#101012' },
  headerLogo: { width: 124, height: 52 },
  headerLargeText: { flexDirection: 'column', alignItems: 'stretch' },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    maxWidth: 1100,
    width: '100%',
    alignSelf: 'center',
  },
  scroll: { paddingBottom: 12 },
  content: { gap: 28, width: '100%', maxWidth: 1100, alignSelf: 'center' },
  hero: { backgroundColor: '#101012' },
  heroPhoto: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  photoPressed: { opacity: 0.85 },
  heroPhotoCaption: {
    padding: 14,
    gap: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: colors.dark,
  },
  heroImage: { aspectRatio: 16 / 9, width: '100%' },
  heroCopy: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 14,
  },
  kicker: {
    fontFamily: 'Manrope-Bold',
    fontSize: 10,
    letterSpacing: 1.8,
    color: colors.accentOnDark,
  },
  heroTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 30,
    lineHeight: 37,
    color: colors.onDark,
  },
  heroTitleWide: { fontSize: 44, lineHeight: 54 },
  heroDescription: {
    color: colors.mutedOnDark,
    maxWidth: 550,
    fontSize: 15,
    lineHeight: 23,
  },
  heroFoot: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  redLine: { width: 24, height: 2, backgroundColor: colors.primary },
  light: { color: colors.mutedOnDark },
  white: { color: colors.onDark },
  section: { marginHorizontal: 20, gap: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  expertise: {
    backgroundColor: colors.dark,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: radii.md,
    gap: 20,
  },
  expertiseRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderDark,
  },
  number: {
    color: colors.accentOnDark,
    fontFamily: 'Manrope-SemiBold',
    fontSize: 13,
    lineHeight: 26,
    minWidth: 24,
  },
  paragraph: { fontSize: 15, lineHeight: 24, maxWidth: 640 },
  sectionTitle: { fontSize: 25, lineHeight: 33 },
  itemTitle: { fontSize: 18, lineHeight: 26 },
  flex: { flex: 1, gap: spacing.xs },
  reason: {
    flexDirection: 'row',
    gap: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  reasonNumber: {
    minWidth: 32,
    minHeight: 32,
    paddingHorizontal: 6,
    borderRadius: radii.sm,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reasonDigit: { color: colors.primaryStrong, fontFamily: 'Manrope-Bold' },
  lastReason: { borderBottomWidth: 0, paddingBottom: 0 },
  clients: { flexDirection: 'row', gap: spacing.sm },
  client: {
    height: 88,
    backgroundColor: colors.onDark,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    padding: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clientLogo: { width: '100%', maxWidth: 110, height: 48 },
  contactActions: { gap: spacing.sm },
  contact: {
    backgroundColor: colors.dark,
    padding: 20,
    marginHorizontal: 20,
    borderRadius: radii.md,
    gap: 20,
  },
  footer: { textAlign: 'center', letterSpacing: 0.6, paddingHorizontal: 20 },
});
