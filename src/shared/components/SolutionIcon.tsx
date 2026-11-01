import React from 'react';
import Svg, { G, Path } from 'react-native-svg';
import { solutionIcons } from '../../assets/images/solutionIcons';
import { colors } from '../../design-system/tokens/colors';
export function SolutionIcon({
  title,
  size = 32,
}: {
  title: string;
  size?: number;
}) {
  const icon = solutionIcons[title.toUpperCase()];
  if (!icon) return null;
  return (
    <Svg width={size} height={size} viewBox={icon.viewBox} accessible={false}>
      <G transform={icon.transform}>
        {icon.paths.map((path, index) => (
          <Path key={index} d={path} fill={colors.primary} />
        ))}
      </G>
    </Svg>
  );
}
