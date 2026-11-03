import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { RootScreenProps } from '../../../app/navigation/types';
import { AppText, Button, Card } from '../../../design-system/components';
import { colors } from '../../../design-system/tokens/colors';
import { Screen } from '../../../shared/components/Screen';
import { useAsyncAction } from '../../../shared/hooks/useAsyncAction';
import { openContactLink } from '../../contact/services/openContactLink';
import { FounderAttribution as Attribution } from '../components/FounderAttribution';
import { founderContent, founderSources } from '../data/founderContent';
import { ScrollReveal } from '../../../shared/components/ScrollReveal';
import { FounderPortrait } from '../components/FounderSpotlight';

export function FounderJourneyScreen(
  _props: RootScreenProps<'FounderJourney'>,
) {
  const action = useAsyncAction();
  return (
    <Screen revealOnScroll>
      <AppText variant="caption" style={styles.accent}>
        THE FOUNDER JOURNEY
      </AppText>
      <FounderPortrait large />
      <AppText variant="title" accessibilityRole="header">
        {founderContent.name.text}
      </AppText>
      <AppText variant="heading" style={styles.accent}>
        {founderContent.designation.text}
      </AppText>
      <Attribution ids={founderContent.designation.sourceIds} />
      <AppText>{founderContent.introduction.text}</AppText>
      <Attribution ids={founderContent.introduction.sourceIds} />
      {founderContent.sections.map(section => (
        <ScrollReveal key={section.id}>
          <Card>
            <AppText variant="heading" accessibilityRole="header">
              {section.title}
            </AppText>
            <AppText muted>{section.text}</AppText>
            <Attribution ids={section.sourceIds} />
          </Card>
        </ScrollReveal>
      ))}
      <AppText variant="title" accessibilityRole="header">
        Company history
      </AppText>
      {founderContent.timeline.map(milestone => (
        <ScrollReveal key={milestone.id}>
          <View style={styles.milestone}>
            <AppText variant="label" style={styles.accent}>
              {milestone.period}
            </AppText>
            <AppText variant="heading">{milestone.title}</AppText>
            <AppText muted>{milestone.text}</AppText>
            <Attribution ids={milestone.sourceIds} />
          </View>
        </ScrollReveal>
      ))}
      <AppText variant="title" accessibilityRole="header">
        Sources & References
      </AppText>
      <AppText muted>
        Summarised from published interviews and company information. Dates
        below distinguish article updates from magazine publication details.
      </AppText>
      {action.error && (
        <AppText accessibilityRole="alert" style={styles.accent}>
          Unable to open this reference. Please check your browser and try
          again.
        </AppText>
      )}
      {Object.values(founderSources).map(source => (
        <Card key={source.id}>
          <AppText variant="label">{source.publication}</AppText>
          <AppText>{source.title}</AppText>
          <AppText variant="caption" muted>
            {source.dateLabel}
            {source.locator ? ` · ${source.locator}` : ''}
          </AppText>
          {source.access === 'indexed-excerpt' && (
            <AppText variant="caption" muted>
              Indexed excerpt reviewed; full page access was unavailable. No
              unique story detail relies on this reference.
            </AppText>
          )}
          <Button
            label={`Read ${source.publication}${
              source.date ? ` · ${source.date.slice(0, 4)}` : ''
            }`}
            variant="secondary"
            disabled={action.busy}
            onPress={() => action.run(() => openContactLink(source.url))}
          />
        </Card>
      ))}
    </Screen>
  );
}
const styles = StyleSheet.create({
  accent: { color: colors.accentOnDark },
  milestone: {
    borderLeftWidth: 2,
    borderLeftColor: colors.primary,
    paddingLeft: 20,
    paddingVertical: 12,
    gap: 10,
  },
});
