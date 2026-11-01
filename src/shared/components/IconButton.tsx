import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../../design-system/tokens/colors';
export function IconButton({
  label,
  icon = 'back',
  onPress,
  dark = false,
}: {
  label: string;
  icon?: 'back' | 'close';
  onPress: () => void;
  dark?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        dark ? styles.dark : styles.light,
        pressed && styles.pressed,
      ]}
    >
      <Svg width={24} height={24} viewBox="0 0 24 24" accessible={false}>
        <Path
          d={icon === 'back' ? 'M19 12H5m7-7-7 7 7 7' : 'M6 6l12 12M6 18L18 6'}
          fill="none"
          stroke={colors.onDark}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  light: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dark: { backgroundColor: colors.borderDark },
  pressed: { opacity: 0.55 },
});
