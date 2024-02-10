import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';

import { useAppearanceStore } from '@/stores/AppearanceStore';
import theme from '@/theme/theme';

import { Box } from '../core/Box';
import Button from '../core/Button';
import { Text } from '../core/Text';

interface ICellProps {
  title: string;
  subtitle?: string;
  icon?:
    | 'people-outline'
    | 'chatbubbles-outline'
    | 'planet-outline'
    | 'people-circle-outline'
    | 'people-circle-sharp'
    | 'planet-sharp'
    | 'chatbubbles-sharp'
    | 'chatbubble-outline'
    | 'bookmark-outline'
    | 'chatbubbles'
    | 'people'
    | 'planet'
    | 'people-circle'
    | 'trending-up'
    | 'list'
    | 'albums-outline'
    | 'chatbubbles-outline'
    | 'cog'
    | 'color-fill';
  index?: number;
  maxIndex?: number;
  onPress?: () => void;
  showChevron?: boolean;
  customRight?: React.ReactNode;
  smallPadding?: boolean;
}

const Cell = memo(
  ({
    title,
    subtitle,
    icon,
    index,
    maxIndex,
    customRight = false,
    onPress,
    smallPadding,
  }: ICellProps) => {
    const { systemFont } = useAppearanceStore((state) => state.settings);
    const Component = onPress ? Button : Box;

    return (
      <Component
        flexDirection="row"
        width="100%"
        paddingLeft="l"
        alignItems="center"
        backgroundColor="primaryBG"
        borderTopStartRadius={index === 0 ? 'm' : undefined}
        borderTopEndRadius={index === 0 ? 'm' : undefined}
        borderBottomEndRadius={index === maxIndex ? 'm' : undefined}
        borderBottomStartRadius={index === maxIndex ? 'm' : undefined}
        onPress={onPress}
      >
        {/* <Box
        backgroundColor="gray"
        alignItems="center"
        justifyContent="center"
        borderRadius="full"
        // width={30}
        // height={30}
        padding="xxs"
      > */}
        {icon && <Ionicons name={icon} size={24} color={theme.colors.blue} />}
        {/* <SFSymbol
          name="faceid"
          size={17}
          scale="large"
          color={theme.colors.blue}
        /> */}
        {/* </Box> */}

        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          paddingVertical={subtitle ?? smallPadding ? 's' : 'm'}
          flexGrow={1}
          paddingRight="l"
          marginLeft={icon ? 'l' : undefined}
          borderBottomWidth={index !== maxIndex ? 1 : 0}
          borderBottomColor="divider"
        >
          <Box>
            <Text
              variant="default"
              color="text"
              paddingBottom="xxs"
              allowFontScaling={systemFont}
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                variant="subtitle"
                color="gray"
                allowFontScaling={systemFont}
              >
                {subtitle}
              </Text>
            )}
          </Box>
          {!customRight ? (
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.gray}
            />
          ) : (
            customRight
          )}
        </Box>
      </Component>
    );
  }
);

export { Cell };
