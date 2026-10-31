import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../../assets/images';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { saveOnboardingCompleted } from '../state/onboardingSlice';
import { AppText, Button } from '../../../design-system/components';
import { BrandImage } from '../../../design-system/components/BrandImage';
import { BrandLogo } from '../../../design-system/components/BrandLogo';
import { FadeIn } from '../../../design-system/components/FadeIn';
import { colors } from '../../../design-system/tokens/colors';
const slides = [
  {
    title: 'Welcome to\nChampion Group',
    eyebrow: '01 / A LEGACY OF CRAFT',
    body: 'Visual communication, shaped around your brand. Discover Champion Group’s world of signage and creative solutions.',
    image: images.experience,
    alt: 'Champion premises, photographed on the official website',
  },
  {
    title: 'Explore Our\nSolutions',
    eyebrow: '02 / POSSIBILITIES, REIMAGINED',
    body: 'From signage and branding to LED screens and exhibition stands. Find the right expression for your next idea.',
    image: images.exhibition,
    alt: 'Exhibition stand featured by Champion Group',
  },
  {
    title: 'Bring Your\nVision to Life',
    eyebrow: '03 / LET’S CREATE TOGETHER',
    body: 'Explore our work, discover our expertise, and start a conversation about your next project.',
    image: images.branding,
    alt: 'Vehicle branding showcased by Champion Group',
  },
] as const;
export function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const { height, width } = useWindowDimensions();
  const dispatch = useAppDispatch();
  const { saving, error } = useAppSelector(state => state.onboarding);
  const slide = slides[index] ?? slides[0];
  const finish = () => {
    if (!saving) {
      dispatch(saveOnboardingCompleted(true));
    }
  };
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (saving) {
        return true;
      }
      if (index > 0) {
        setIndex(value => value - 1);
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [index, saving]);
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <BrandLogo />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
          disabled={saving}
          onPress={finish}
          style={styles.skip}
        >
          <AppText style={styles.white}>Skip</AppText>
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <FadeIn key={index} style={styles.slide}>
          <View style={styles.picture}>
            <BrandImage
              source={slide.image}
              accessibilityLabel={slide.alt}
              resizeMode="cover"
              style={[
                styles.image,
                {
                  height: Math.min(height * 0.35, width > 600 ? 360 : 300),
                },
              ]}
            />
            <View style={styles.photoLabel}>
              <AppText variant="caption" style={styles.white}>
                CHAMPION GROUP / UAE
              </AppText>
            </View>
          </View>
          <View style={styles.copy}>
            <AppText style={styles.eyebrow}>{slide.eyebrow}</AppText>
            <AppText accessibilityRole="header" style={styles.title}>
              {slide.title}
            </AppText>
            <AppText style={styles.body}>{slide.body}</AppText>
          </View>
        </FadeIn>
      </ScrollView>
      <View style={styles.controls}>
        <View
          style={styles.pagination}
          accessibilityLabel={`Page ${index + 1} of 3`}
        >
          {slides.map((item, i) => (
            <Pressable
              key={item.eyebrow}
              accessibilityRole="button"
              accessibilityLabel={`Go to onboarding page ${i + 1}`}
              accessibilityState={{ selected: i === index, disabled: saving }}
              disabled={saving}
              onPress={() => setIndex(i)}
              style={styles.dotTouch}
            >
              <View style={[styles.dot, i === index && styles.activeDot]} />
            </Pressable>
          ))}
        </View>
        {error && (
          <AppText accessibilityRole="alert" style={styles.error}>
            {error} Please try again.
          </AppText>
        )}
        <Button
          label={index === 2 ? 'Get Started' : 'Next'}
          loading={saving}
          onPress={index === 2 ? finish : () => setIndex(index + 1)}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  image: { width: '100%' },
  screen: { flex: 1, backgroundColor: colors.dark },
  white: { color: colors.onDark },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skip: {
    minHeight: 48,
    minWidth: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: { flexGrow: 1, alignItems: 'center' },
  slide: { width: '100%', maxWidth: 760 },
  picture: { margin: 16, borderRadius: 24, overflow: 'hidden' },
  photoLabel: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: colors.scrim,
    padding: 8,
    borderRadius: 6,
  },
  copy: { padding: 24, gap: 16 },
  eyebrow: {
    color: colors.accentOnDark,
    fontSize: 11,
    letterSpacing: 1.5,
    fontFamily: 'Manrope-SemiBold',
  },
  title: {
    fontFamily: 'Manrope-Bold',
    fontSize: 34,
    lineHeight: 43,
    color: colors.onDark,
  },
  body: { color: colors.mutedOnDark, lineHeight: 26 },
  controls: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    gap: 8,
  },
  pagination: { flexDirection: 'row', justifyContent: 'center' },
  dotTouch: {
    height: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 5,
    width: 16,
    backgroundColor: colors.inactiveOnDark,
    borderRadius: 3,
  },
  activeDot: { width: 32, backgroundColor: colors.primary },
  error: { color: colors.onDark, textAlign: 'center', fontSize: 13 },
});
