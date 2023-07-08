import type { StatusBarStyle } from 'expo-status-bar';

import { palette } from '@/constants/colors';

import type { Theme } from './theme';
import theme from './theme';

const darkTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    primaryBG: palette.black,
    secondaryBG: palette.black,
    accent: palette.blue,
    text: palette.white,
    subtitle: palette.gray,
    divider: palette.darkGray,
    cellColor: palette.black,
  },
  statusBar: {
    barStyle: 'light' as StatusBarStyle,
  },
};

export default darkTheme;
