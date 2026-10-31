import React from 'react';
import { colors } from '../../../design-system/tokens/colors';
import { View, StyleSheet } from 'react-native';
import { AppText, Button } from '../../../design-system/components';
export function SectionHeading({
  eyebrow,
  title,
  action,
  onPress,
}: {
  eyebrow: string;
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View style={styles.section}>
      <AppText style={styles.eyebrow}>{eyebrow}</AppText>
      <View style={styles.row}>
        <AppText
          variant="title"
          accessibilityRole="header"
          style={styles.title}
        >
          {title}
        </AppText>
        {action && (
          <Button label={action} variant="secondary" onPress={onPress} />
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  section: { gap: 8 },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 2,
    color: colors.primaryStrong,
    fontFamily: 'Manrope-Bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  title: { flexGrow: 1, flexShrink: 1, fontSize: 25, lineHeight: 33 },
});
