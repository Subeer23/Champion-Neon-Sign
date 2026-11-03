import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../../assets/images';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { saveOnboardingCompleted } from '../state/onboardingSlice';
import { AppText, Button } from '../../../design-system/components';
import { colors } from '../../../design-system/tokens/colors';
import { FadeIn } from '../../../design-system/components/FadeIn';
import { CinematicBackdrop } from '../../../shared/components/CinematicBackdrop';
const slides = [
  {
    title: 'Signage &',
    accent: 'LED Displays',
    ending: 'Made for Your Brand.',
    body: 'Explore signage and digital displays that bring your brand into view.',
    image: images.led,
  },
  {
    title: 'Built With',
    accent: 'Precision.',
    ending: 'From Concept to Installation.',
    body: 'Design, fabrication and installation. Discover the work behind each visual experience.',
    image: images['events-showcase'],
  },
  {
    title: 'Your Brand.',
    accent: 'Across the UAE.',
    ending: 'Ideas Made Visible.',
    body: 'Explore exhibition stands, branding and visual communication from Champion Group.',
    image: images.exhibition,
  },
] as const;
export function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const dispatch = useAppDispatch();
  const { saving, error } = useAppSelector(state => state.onboarding);
  const slide = slides[index]!;
  const finish = () => {
    if (!saving) dispatch(saveOnboardingCompleted(true));
  };
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (saving) return true;
        if (index > 0) {
          setIndex(value => value - 1);
          return true;
        }
        return false;
      },
    );
    return () => subscription.remove();
  }, [index, saving]);
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <CinematicBackdrop source={slide.image} overlay={false} />
      <SafeAreaView style={styles.safe}>
        <ScrollView
          style={styles.scroll}
          contentInsetAdjustmentBehavior="never"
          automaticallyAdjustContentInsets={false}
          contentContainerStyle={styles.copy}
          showsVerticalScrollIndicator={false}
        >
          <FadeIn key={index}>
            <AppText
              variant="caption"
              style={[styles.eyebrow, styles.textShadow]}
            >
              CHAMPION GROUP · {String(index + 1).padStart(2, '0')}
            </AppText>
            <AppText
              accessibilityRole="header"
              style={[styles.title, styles.textShadow]}
            >
              {slide.title}
              {'\n'}
              <AppText style={[styles.title, styles.red]}>
                {slide.accent}
              </AppText>
              {'\n'}
              {slide.ending}
            </AppText>
            <AppText style={[styles.body, styles.textShadow]}>
              {slide.body}
            </AppText>
          </FadeIn>
        </ScrollView>
        {error && (
          <AppText accessibilityRole="alert" style={styles.error}>
            {error} Please try again.
          </AppText>
        )}
        <View style={styles.controls}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
            onPress={finish}
            disabled={saving}
            style={styles.skip}
          >
            <AppText variant="label" style={styles.textShadow}>
              Skip
            </AppText>
          </Pressable>
          <View
            style={styles.pagination}
            accessibilityLabel={`Page ${index + 1} of 3`}
          >
            {slides.map((item, i) => (
              <Pressable
                key={item.title}
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
          <Button
            round
            label={index === 2 ? 'Get Started' : 'Next'}
            loading={saving}
            onPress={index === 2 ? finish : () => setIndex(index + 1)}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.dark },
  safe: { flex: 1, minHeight: 0 },
  scroll: { flex: 1, minHeight: 0 },
  copy: {
    padding: 28,
    paddingTop: 48,
    gap: 24,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  textShadow: {
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  eyebrow: { color: colors.text, letterSpacing: 1.6 },
  title: {
    fontFamily: 'Manrope-Bold',
    fontSize: 30,
    lineHeight: 40,
    color: colors.text,
  },
  red: { color: colors.primary },
  body: {
    fontSize: 15,
    lineHeight: 25,
    color: colors.text,
    maxWidth: 310,
  },
  controls: {
    flexShrink: 0,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  skip: { minWidth: 52, minHeight: 48, justifyContent: 'center' },
  pagination: { flexDirection: 'row' },
  dotTouch: {
    width: 36,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.inactiveOnDark,
  },
  activeDot: { backgroundColor: colors.primary, width: 16 },
  error: { padding: 24, color: colors.text },
});
