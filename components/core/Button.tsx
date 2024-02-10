import type {
  BackgroundColorProps,
  BorderProps,
  BoxProps,
  SpacingProps,
} from '@shopify/restyle';
import {
  backgroundColor,
  border,
  composeRestyleFunctions,
  spacing,
  useRestyle,
} from '@shopify/restyle';
import React from 'react';
import { Pressable } from 'react-native';

import type { Theme } from '@/theme/theme';

import { Box } from './Box';

type RestyleProps = SpacingProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme> &
  BoxProps<Theme>;

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([
  spacing,
  border,
  backgroundColor,
]);

type Props = RestyleProps & {
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  children?: React.ReactNode;
};

const Button = ({
  onPress,
  onPressIn,
  onPressOut,
  children,
  ...rest
}: Props) => {
  const props = useRestyle(restyleFunctions, rest);

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Box {...props}>{children}</Box>
    </Pressable>
  );
};

export default Button;
