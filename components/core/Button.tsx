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
import { TouchableOpacity } from 'react-native';

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
  children?: React.ReactNode;
};

const Button = ({ onPress, onPressIn, children, ...rest }: Props) => {
  const props = useRestyle(restyleFunctions, rest);

  return (
    <TouchableOpacity onPress={onPress} onPressIn={onPressIn}>
      <Box {...props}>{children}</Box>
    </TouchableOpacity>
  );
};

export default Button;
