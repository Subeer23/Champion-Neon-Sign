import { usePortraitPrelude } from '../hooks/usePortraitPrelude';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  AppState,
  BackHandler,
  ScrollView,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Button, Card } from '../../../design-system/components';
import { colors } from '../../../design-system/tokens/colors';
import { founderContent } from '../data/founderContent';
import { FounderCinematicBackground } from '../components/FounderCinematicBackground';
import { FounderAttribution } from '../components/FounderAttribution';
import {
  FounderPlayback,
  type StoryBlock,
  type PlaybackStatus,
} from '../domain/FounderPlayback';

const words = (text: string) => text.trim().split(/\s+/).length;
export function FounderCinematicScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const preludeComplete = usePortraitPrelude();
  const preludeReady = useRef(preludeComplete);
  preludeReady.current = preludeComplete;
  const [viewportHeight, setViewportHeight] = useState(0);
  const scroll = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const complete = useRef(onComplete);
  complete.current = onComplete;
  const finished = useRef(false);
  const [status, setStatus] = useState<PlaybackStatus>('preparing');
  const [manual, setManual] = useState(true);
  const [ready, setReady] = useState(false);
  const [failure, setFailure] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const frame = useRef<number | null>(null);
  const active = useRef(
    AppState.currentState === 'active' || AppState.currentState == null,
  );
  const manualRef = useRef(true);
  const touched = useRef(false);
  const mounted = useRef(true);
  const measurements = useRef({
    viewport: 0,
    content: 0,
    blocks: new Map<string, StoryBlock>(),
  });
  const total =
    2 + founderContent.sections.length + founderContent.timeline.length;
  const [player] = useState(
    () =>
      new FounderPlayback(
        y => scroll.current?.scrollTo({ y, animated: false }),
        () => {
          if (finished.current || !mounted.current) return;
          finished.current = true;
          complete.current();
        },
      ),
  );
  const halt = useCallback(() => {
    if (frame.current !== null) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
  }, []);
  const pause = useCallback(() => {
    touched.current = true;
    player.pause();
    halt();
    if (mounted.current) setStatus(player.status);
  }, [player, halt]);
  const start = useCallback(() => {
    if (
      !mounted.current ||
      !preludeReady.current ||
      !active.current ||
      manualRef.current ||
      finished.current
    )
      return;
    player.resume();
    setStatus(player.status);
    if (frame.current !== null || player.status !== 'playing') return;
    const tick = (time: number) => {
      frame.current = null;
      if (
        !mounted.current ||
        !active.current ||
        finished.current ||
        player.status !== 'playing'
      )
        return;
      try {
        player.tick(time);
        progress.setValue(player.progress);
      } catch {
        player.pause();
        touched.current = true;
        setFailure(true);
        setStatus('paused');
        return;
      }
      if (player.status === 'playing' && !finished.current)
        frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, [player, progress]);
  const measure = useCallback(() => {
    if (!mounted.current || finished.current) return;
    const value = measurements.current;
    if (value.blocks.size !== total) return;
    player.measure([...value.blocks.values()], value.viewport, value.content);
    if (!manualRef.current && !touched.current && active.current) start();
    else setStatus(player.status);
  }, [player, start, total]);
  useEffect(() => {
    if (preludeComplete) measure();
  }, [preludeComplete, measure]);
  const block = (id: string, text: string) => (event: LayoutChangeEvent) => {
    const { y, height } = event.nativeEvent.layout;
    measurements.current.blocks.set(id, {
      id,
      y,
      height,
      words: words(text) + 8,
    });
    measure();
  };
  useEffect(() => {
    mounted.current = true;
    let live = true;
    let motionChanged = false;
    let readerChanged = false;
    let reduced = true;
    let reader = true;
    const apply = () => {
      if (!live || !mounted.current) return;
      const next = reduced || reader;
      manualRef.current = next;
      setManual(next);
      setReady(true);
      if (next) {
        player.pause();
        halt();
        setStatus(player.status);
      } else if (!touched.current) measure();
    };
    Promise.all([
      AccessibilityInfo.isReduceMotionEnabled(),
      AccessibilityInfo.isScreenReaderEnabled(),
    ])
      .then(([r, s]) => {
        if (!motionChanged) reduced = r;
        if (!readerChanged) reader = s;
        apply();
      })
      .catch(apply);
    const motion = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      value => {
        motionChanged = true;
        reduced = value;
        apply();
      },
    );
    const reading = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      value => {
        readerChanged = true;
        reader = value;
        apply();
      },
    );
    const app = AppState.addEventListener('change', value => {
      active.current = value === 'active';
      if (!active.current) pause();
      else if (!touched.current) measure();
    });
    const back = BackHandler.addEventListener('hardwareBackPress', () => {
      halt();
      player.skip();
      return true;
    });
    return () => {
      live = false;
      mounted.current = false;
      halt();
      player.pause();
      motion.remove();
      reading.remove();
      app.remove();
      back.remove();
    };
  }, [halt, measure, pause, player]);
  const skip = () => {
    halt();
    player.skip();
  };
  return (
    <View style={styles.page}>
      <FounderCinematicBackground />
      <SafeAreaView
        testID="founder-cinematic-foreground"
        style={[styles.foreground, !preludeComplete && styles.portraitOnly]}
        pointerEvents={preludeComplete ? 'auto' : 'none'}
        accessibilityElementsHidden={!preludeComplete}
        importantForAccessibility={
          preludeComplete ? 'auto' : 'no-hide-descendants'
        }
        edges={['top', 'bottom', 'left', 'right']}
      >
        <View style={styles.header}>
          <AppText variant="caption" style={styles.red}>
            CHAMPION GROUP
          </AppText>
          <Button
            compact
            variant="secondary"
            label="Skip"
            accessibilityLabel="Skip founder presentation"
            onPress={skip}
          />
        </View>
        <ScrollView
          ref={scroll}
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            !manual && { paddingTop: viewportHeight },
          ]}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="never"
          automaticallyAdjustContentInsets={false}
          onLayout={event => {
            measurements.current.viewport = event.nativeEvent.layout.height;
            setViewportHeight(event.nativeEvent.layout.height);
            measure();
          }}
          onContentSizeChange={(_, height) => {
            measurements.current.content = height;
            measure();
          }}
          onTouchStart={pause}
          onScrollBeginDrag={pause}
          scrollEventThrottle={32}
          onScroll={event => {
            player.manualOffset(event.nativeEvent.contentOffset.y);
            if (player.status !== 'playing') progress.setValue(player.progress);
          }}
        >
          <View
            testID="founder-cinematic-introduction"
            onLayout={block(
              'introduction',
              `${founderContent.name.text} ${founderContent.designation.text} ${founderContent.introduction.text}`,
            )}
            style={styles.section}
          >
            <AppText variant="title">{founderContent.name.text}</AppText>
            <AppText variant="heading" style={styles.red}>
              {founderContent.designation.text}
            </AppText>
            <AppText>{founderContent.introduction.text}</AppText>
            <FounderAttribution
              ids={[
                ...founderContent.designation.sourceIds,
                ...founderContent.introduction.sourceIds,
              ]}
            />
          </View>
          {founderContent.sections.map(section => (
            <View
              key={section.id}
              testID={`founder-cinematic-block-${section.id}`}
              onLayout={block(section.id, `${section.title} ${section.text}`)}
            >
              <Card style={styles.storyCard}>
                <AppText variant="heading" accessibilityRole="header">
                  {section.title}
                </AppText>
                <AppText muted>{section.text}</AppText>
                <FounderAttribution ids={section.sourceIds} />
              </Card>
            </View>
          ))}
          {founderContent.timeline.map(item => (
            <View
              key={item.id}
              testID={`founder-cinematic-timeline-${item.id}`}
              onLayout={block(
                `timeline-${item.id}`,
                `${item.period} ${item.title} ${item.text}`,
              )}
              style={styles.timeline}
            >
              <AppText variant="label" style={styles.red}>
                {item.period}
              </AppText>
              <AppText variant="heading">{item.title}</AppText>
              <AppText muted>{item.text}</AppText>
              <FounderAttribution ids={item.sourceIds} />
            </View>
          ))}
          <View
            testID="founder-cinematic-conclusion"
            onLayout={block(
              'conclusion',
              'Continue exploring Champion Group. Full sources and references are available in About, Founder Journey.',
            )}
            style={styles.section}
          >
            <AppText variant="title">
              Continue exploring Champion Group.
            </AppText>
            <AppText muted>
              Full sources and references are available in About → Founder
              Journey.
            </AppText>
            {manual && <Button label="Continue to app" onPress={skip} />}
          </View>
        </ScrollView>
        <View style={styles.controls}>
          <View
            accessibilityRole="progressbar"
            accessibilityLabel="Founder presentation progress"
            style={styles.track}
          >
            <Animated.View
              style={[
                styles.fill,
                {
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          {failure && (
            <AppText accessibilityRole="alert" muted>
              Playback paused. You can read manually, retry, or skip to the app.
            </AppText>
          )}
          {!ready ? (
            <AppText variant="caption" muted>
              Preparing presentation…
            </AppText>
          ) : manual ? (
            <>
              <AppText variant="caption" muted>
                Manual reading mode · Automatic motion is disabled for
                accessibility.
              </AppText>
              <Button compact label="Continue to app" onPress={skip} />
            </>
          ) : (
            <View style={styles.row}>
              <Button
                compact
                variant="secondary"
                label={
                  !ready
                    ? 'Preparing presentation'
                    : status === 'playing'
                    ? 'Pause'
                    : 'Resume'
                }
                disabled={!ready || status === 'preparing'}
                onPress={() => {
                  if (status === 'playing') pause();
                  else {
                    touched.current = false;
                    setFailure(false);
                    start();
                  }
                }}
              />
              <Button
                compact
                variant="secondary"
                label="Replay"
                onPress={() => {
                  halt();
                  touched.current = false;
                  try {
                    player.replay();
                    progress.setValue(0);
                    start();
                  } catch {
                    player.pause();
                    touched.current = true;
                    setFailure(true);
                    setStatus('paused');
                  }
                }}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#101010' },
  foreground: { flex: 1 },
  portraitOnly: { opacity: 0 },
  scroll: { flex: 1 },
  storyCard: {
    backgroundColor: 'rgba(16, 16, 16, 0.84)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  header: {
    backgroundColor: 'rgba(16, 16, 16, 0.72)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  content: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    padding: 20,
    gap: 24,
  },
  section: { gap: 18, paddingVertical: 12 },
  red: { color: colors.accentOnDark },
  timeline: {
    backgroundColor: 'rgba(23, 23, 23, 0.84)',
    borderLeftWidth: 2,
    borderLeftColor: '#D71D24',
    padding: 20,
    gap: 12,
  },
  controls: {
    backgroundColor: 'rgba(16, 16, 16, 0.82)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  track: {
    height: 3,
    backgroundColor: colors.border,
    overflow: 'hidden',
    borderRadius: 2,
  },
  fill: { height: 3, backgroundColor: '#D71D24' },
});
