import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { MainTabParamList } from './types';
const paths: Record<keyof MainTabParamList, string> = {
  Home: 'M3 10 12 3 21 10 M5 9v12h5v-7h4v7h5V9',
  Solutions: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  Projects: 'M3 6h7l2 3h9v12H3z',
  ClientsTab:
    'M4 21v-4a4 4 0 018 0v4M8 3a4 4 0 100 8 4 4 0 000-8M15 4a3 3 0 010 6M16 14a4 4 0 014 4v3',
  ContactTab: 'M3 5h18v14H3zM3 5l9 7 9-7',
};
export function TabIcon({
  name,
  color,
  size,
}: {
  name: keyof MainTabParamList;
  color: string;
  size: number;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      <Path
        d={paths[name]}
        stroke={color}
        strokeWidth={1.8}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
