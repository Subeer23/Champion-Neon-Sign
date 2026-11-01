import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Pressable,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import type { TabScreenProps } from '../../../app/navigation/types';
import {
  AppText,
  Button,
  BrandLogo,
  BrandImage,
} from '../../../design-system/components';
import { colors } from '../../../design-system/tokens/colors';
import { images } from '../../../assets/images';
import { CinematicBackdrop } from '../../../shared/components/CinematicBackdrop';
import { LineIcon } from '../../../shared/components/LineIcon';
import { useGetSolutionsQuery } from '../../solutions/state/solutionsApi';
import { useGetProjectsQuery } from '../../projects/state/projectsApi';
import { QueryState } from '../../../shared/components/QueryState';
import { SectionHeading } from '../components/SectionHeading';
import { ShowcaseCard } from '../components/ShowcaseCard';
import { clientPreview } from '../data/homeContent';
export function HomeScreen({ navigation }: TabScreenProps<'Home'>) {
  const { width, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const available = Math.min(width - insets.left - insets.right, 1100) - 40;
  const columns = available / fontScale >= 310 ? 4 : 2;
  const projectColumns = available / fontScale >= 320 ? 2 : 1;
  const projectCardWidth =
    (available - 12 * (projectColumns - 1)) / projectColumns;
  const solutions = useGetSolutionsQuery();
  const projects = useGetProjectsQuery();
  const focused = useIsFocused();
  return (
    <View style={styles.screen}>
      {focused && <StatusBar barStyle="light-content" />}
      <SafeAreaView edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            onPress={() => navigation.navigate('More')}
            style={styles.icon}
          >
            <LineIcon name="menu" color={colors.text} />
          </Pressable>
          <BrandLogo style={styles.logo} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open Profile"
            onPress={() => navigation.navigate('Profile')}
            style={styles.icon}
          >
            <LineIcon name="user" color={colors.text} />
          </Pressable>
        </View>
      </SafeAreaView>
      <SafeAreaView edges={['left', 'right']} style={styles.flex}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.hero}>
            <CinematicBackdrop source={images['exhibition-stand-a']} />
            <View style={[styles.heroCopy, fontScale > 1.3 && styles.full]}>
              <AppText style={styles.heroTitle}>
                Elevate{'\n'}Your Brand.{'\n'}
                <AppText style={[styles.heroTitle, styles.red]}>
                  With Champion.
                </AppText>
              </AppText>
              <AppText style={styles.heroBody}>
                Signage, digital displays and spaces that bring your identity to
                life.
              </AppText>
              <Button
                compact
                label="Start your project"
                onPress={() => navigation.navigate('GetQuote')}
              />
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AppText variant="heading">Our Solutions</AppText>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Explore solutions"
                onPress={() => navigation.navigate('Solutions')}
                style={styles.link}
              >
                <AppText variant="caption" style={styles.red}>
                  View All ↗
                </AppText>
              </Pressable>
            </View>
            <QueryState
              loading={solutions.isLoading}
              empty={solutions.data?.length === 0}
              error={solutions.isError}
              onRetry={solutions.refetch}
            />
            <View style={styles.grid}>
              {solutions.data
                ?.filter(item =>
                  [
                    'signage',
                    'branding',
                    'led-screens',
                    'exhibitions',
                  ].includes(item.id),
                )
                .map(item => (
                  <View
                    key={item.id}
                    style={{
                      width: (available - 12 * (columns - 1)) / columns,
                    }}
                  >
                    <ShowcaseCard
                      compact
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
          <View style={styles.section}>
            <SectionHeading
              eyebrow="CHAMPION GROUP / SINCE 1989"
              title="Ideas made visible."
            />
            <AppText muted>
              Discover our approach to signage and visual communication, from
              concept to installation.
            </AppText>
            <Button
              label="Our story"
              variant="secondary"
              onPress={() => navigation.navigate('AboutUs')}
            />
          </View>
          <View style={styles.section}>
            <SectionHeading eyebrow="OUR WORK" title="Featured Projects" />
            <QueryState
              loading={projects.isLoading}
              empty={projects.data?.length === 0}
              error={projects.isError}
              onRetry={projects.refetch}
            />
            <View style={styles.grid}>
              {projects.data?.slice(0, 4).map(item => (
                <View
                  key={item.id}
                  style={{
                    width: projectCardWidth,
                  }}
                >
                  <ShowcaseCard
                    title={item.title}
                    subtitle={item.summary}
                    imageId={item.imageIds[0]}
                    mediaHeight={Math.min(240, projectCardWidth * 0.72)}
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
            <SectionHeading eyebrow="OUR CLIENTS" title="In good company." />
            <View style={styles.clients}>
              {clientPreview.map(client => (
                <View key={client.name} style={styles.client}>
                  <BrandImage
                    source={client.image}
                    resizeMode="contain"
                    accessibilityLabel={client.name}
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
          <View style={[styles.section, styles.cta]}>
            <AppText variant="title">
              Let’s create{'\n'}
              <AppText variant="title" style={styles.red}>
                something distinctive.
              </AppText>
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
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
  },
  icon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { width: 144, height: 60 },
  content: {
    paddingBottom: 32,
    gap: 28,
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
  },
  hero: { minHeight: 340, justifyContent: 'center', overflow: 'hidden' },
  heroCopy: { padding: 24, gap: 16, width: '66%', minWidth: 230 },
  full: { width: '100%' },
  heroTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 30,
    lineHeight: 38,
    color: colors.text,
  },
  red: { color: colors.primary },
  heroBody: { fontSize: 14, lineHeight: 22, color: colors.mutedOnDark },
  section: { marginHorizontal: 20, gap: 16 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  link: { minHeight: 44, justifyContent: 'center', paddingLeft: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  clients: { flexDirection: 'row', gap: 12 },
  client: {
    flex: 1,
    padding: 12,
    height: 84,
    borderRadius: 12,
    backgroundColor: colors.logoPlate,
    justifyContent: 'center',
  },
  clientLogo: { width: '100%', height: 48 },
  cta: { padding: 20, backgroundColor: colors.surface, borderRadius: 16 },
});
