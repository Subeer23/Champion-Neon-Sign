import React from 'react';
import { Text, type TextProps } from 'react-native';
import { colors } from '../tokens/colors';
import { typography } from '../tokens/typography';
interface Props extends TextProps {
  variant?: keyof typeof typography;
  muted?: boolean;
}
export function AppText({
  variant = 'body',
  muted = false,
  style,
  ...props
}: Props) {
  return (
    <Text
      {...props}
      style={[
        typography[variant],
        { color: muted ? colors.muted : colors.text },
        style,
      ]}
    />
  );
}
