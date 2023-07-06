import { createTheme } from '@shopify/restyle';
import type { StatusBarStyle } from 'expo-status-bar';

import { palette } from '@/constants/colors';

const theme = createTheme({
  colors: {
    primaryBG: palette.white,
    secondaryBG: palette.ligthGray,
    white: palette.white,
    black: palette.black,
    blue: palette.blue,
    red: palette.red,
    green: palette.green,
    ligthGray: palette.ligthGray,
    gray: palette.gray,
    divider: palette.border,
    sepratorGray: palette.darkGray,
  },
  spacing: {
    xxxxs: 0.5,
    xxxs: 1,
    xxs: 2,
    xs: 4,
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
    xxl: 32,
    xxxl: 40,
    xxxxl: 48,
    xxxxxl: 56,
  },
  borderRadii: {
    0: 0,
    s: 4,
    m: 10,
    l: 25,
    xl: 75,
    full: 100,
  },
  breakpoints: {},
  statusBar: {
    barStyle: 'dark' as StatusBarStyle,
  },
  textVariants: {
    default: {
      fontSize: 20,
      color: 'black',
      fontWeight: '400',
    },
  },
  buttonVariants: {
    primary: {
      backgroundColor: 'text',
      padding: 'm',
      borderRadius: 's',
    },
    secondary: {
      backgroundColor: 'background',
      padding: 'm',
      borderRadius: 's',
    },
    defaults: {
      backgroundColor: 'background',
      padding: 'm',
      borderRadius: 's',
      color: 'text',
    },
  },
});

export type Theme = typeof theme;
export default theme;
