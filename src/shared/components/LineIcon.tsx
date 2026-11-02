import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors } from '../../design-system/tokens/colors';
export type IconName =
  | 'mail'
  | 'lock'
  | 'user'
  | 'check'
  | 'phone'
  | 'pin'
  | 'menu'
  | 'bell'
  | 'arrow'
  | 'briefcase'
  | 'file-text'
  | 'wallet'
  | 'calendar'
  | 'clipboard'
  | 'building';
const paths: Record<IconName, string> = {
  briefcase: 'M3 7h18v14H3z M8 7V3h8v4 M3 12l9 3 9-3 M12 12v5',
  'file-text': 'M5 2h9l5 5v15H5z M14 2v6h5 M8 12h8 M8 16h8',
  wallet: 'M3 6h18v15H3z M3 6V3h15v3 M16 11h5v5h-5z',
  calendar: 'M3 5h18v16H3z M7 2v6 M17 2v6 M3 10h18 M7 14h3 M14 14h3',
  clipboard: 'M8 4H4v18h16V4h-4 M8 2h8v5H8z M8 12h8 M8 16h6',
  building:
    'M4 22V3h16v19 M9 22v-5h6v5 M8 7h1 M15 7h1 M8 11h1 M15 11h1 M2 22h20',
  mail: 'M3 5h18v14H3z M3 5l9 7 9-7',
  lock: 'M6 10h12v11H6z M8 10V6a4 4 0 018 0v4',
  user: 'M4 21v-2a8 8 0 0116 0v2 M12 3a4 4 0 100 8 4 4 0 000-8',
  check: 'M5 12l4 4L19 6',
  phone: 'M5 3H3v4c0 8 6 14 14 14h4v-5l-5-2-2 3c-4-1-6-3-7-7l3-2-2-5z',
  pin: 'M12 22s8-9 8-14a8 8 0 00-16 0c0 5 8 14 8 14z M12 5a3 3 0 100 6 3 3 0 000-6',
  menu: 'M3 6h18M3 12h18M3 18h18',
  bell: 'M5 17h14l-2-3V8a5 5 0 00-10 0v6z M10 21h4',
  arrow: 'M4 12h16M14 6l6 6-6 6',
};
export function LineIcon({
  name,
  size = 24,
  color = colors.primary,
  badge = false,
}: {
  name: IconName;
  size?: number;
  color?: string;
  badge?: boolean;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      {badge && <Circle cx={12} cy={12} r={11} stroke={color} fill="none" />}
      <Path
        d={paths[name]}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
