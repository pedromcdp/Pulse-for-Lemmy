import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';

import theme from '@/theme/theme';

import { Box } from '../core/Box';
import Button from '../core/Button';
import { Text } from '../core/Text';

interface ICellProps {
  title: string;
  subtitle?: string;
  icon?:
    | 'ios-people-outline'
    | 'ios-chatbubbles-outline'
    | 'ios-planet-outline'
    | 'ios-people-circle-outline'
    | 'ios-people-circle-sharp'
    | 'ios-planet-sharp'
    | 'ios-chatbubbles-sharp'
    | 'ios-chatbubble-outline'
    | 'ios-bookmark-outline'
    | 'ios-chatbubbles'
    | 'ios-people'
    | 'ios-planet'
    | 'ios-people-circle'
    | 'ios-trending-up'
    | 'ios-list'
    | 'ios-albums-outline'
    | 'ios-chatbubbles-outline'
    | 'ios-cog';
  index?: number;
  maxIndex?: number;
  onPress?: () => void;
  showChevron?: boolean;
  customRight?: React.ReactNode;
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
  }: ICellProps) => {
    return (
      <Button
        flexDirection="row"
        width="100%"
        paddingLeft="l"
        alignItems="center"
        backgroundColor="white"
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
        {/* </Box> */}

        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          paddingVertical={subtitle ? 's' : 'm'}
          flexGrow={1}
          paddingRight="l"
          marginLeft={icon ? 'l' : undefined}
          borderBottomWidth={index !== maxIndex ? 1 : 0}
          borderBottomColor="divider"
        >
          <Box>
            <Text fontSize={17} paddingBottom="xxs">
              {title}
            </Text>
            {subtitle && (
              <Text fontSize={15} color="gray">
                {subtitle}
              </Text>
            )}
          </Box>
          {!customRight ? (
            <Ionicons
              name="ios-chevron-forward"
              size={20}
              color={theme.colors.gray}
            />
          ) : (
            customRight
          )}
        </Box>
      </Button>
    );
  }
);

export { Cell };
