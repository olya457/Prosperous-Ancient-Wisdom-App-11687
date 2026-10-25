import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors } from '../theme';
export function Icon({
  name,
  size = 22,
  color = colors.accent,
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  const paths: Record<string, string> = {
    wisdom:
      'M12 3l2.3 6.7L21 12l-6.7 2.3L12 21l-2.3-6.7L3 12l6.7-2.3Z M20 2v5 M17.5 4.5h5',
    decisions: 'M16 8l-3 5-5 3 3-5Z',
    lessons: 'M12 5C8 2 3 4 3 4v15s5-2 9 1c4-3 9-1 9-1V4s-5-2-9 1v15',
    balance:
      'M12 21V10 M12 14C4 14 4 8 4 8s8-1 8 6 M12 10c0-7 8-7 8-7s1 8-8 7 M6 21h12',
    journal: 'M4 21l5-5 M7 17C4 8 17 1 21 3c1 5-5 17-14 14Z M8 16l8-8',
    bookmark: 'M6 3h12v18l-6-4-6 4Z',
    back: 'M19 12H5 M11 6l-6 6 6 6',
    arrow: 'M5 12h14 M13 6l6 6-6 6',
    chevron: 'M9 5l7 7-7 7',
    check: 'M5 12l4 4L19 6',
    layers: 'M3 8l9-5 9 5-9 5Z M3 12l9 5 9-5 M3 16l9 5 9-5',
    clock: 'M12 6v6l4 2',
    heart: 'M12 20S2 14 2 7c0-5 7-6 10-1 3-5 10-4 10 1 0 7-10 13-10 13Z',
    plus: 'M12 5v14 M5 12h14',
    close: 'M6 6l12 12 M18 6L6 18',
    trash: 'M4 6h16 M9 6V3h6v3 M6 6l1 15h10l1-15 M10 10v7 M14 10v7',
    search: 'M16 16l5 5',
  };
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {['decisions', 'clock'].includes(name) && (
        <Circle cx="12" cy="12" r="9" />
      )}
      {name === 'search' && <Circle cx="10" cy="10" r="6" />}
      <Path d={paths[name] || paths.wisdom} />
    </Svg>
  );
}
