import type { ParamListBase } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { memo } from 'react';

import { useAppearanceStore } from '@/stores/AppearanceStore';
import type { Theme } from '@/theme/theme';
import theme from '@/theme/theme';

import { Box } from '../core/Box';
import Button from '../core/Button';
import { Text } from '../core/Text';

interface ICommunityCellProps {
  icon?: React.ReactNode;
  iconBgColor?: keyof Theme['colors'];
  title: string;
  subtitle?: string;
  image?: string;
  index?: number;
  maxIndex?: number;
}

const CommunityCell = memo(
  ({
    icon,
    iconBgColor,
    title,
    subtitle,
    image,
    index,
    maxIndex,
  }: ICommunityCellProps) => {
    const navigation =
      useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const { showIcons, systemFont } = useAppearanceStore(
      (state) => state.settings
    );

    return (
      <Button
        flexDirection="row"
        backgroundColor="primaryBG"
        width="100%"
        paddingLeft="l"
        alignItems="center"
        onPress={() =>
          navigation.navigate(icon ? 'Home' : 'Community', { title })
        }
      >
        {icon && (
          <Box
            backgroundColor={iconBgColor}
            alignItems="center"
            justifyContent="center"
            width={40}
            height={40}
            borderRadius="full"
            mr="l"
          >
            {icon ?? null}
          </Box>
        )}
        {showIcons && image && (
          <Image
            source={{ uri: image }}
            contentFit="contain"
            style={{
              width: 35,
              height: 35,
              borderRadius: 20,
              marginRight: theme.spacing.l,
            }}
          />
        )}
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          paddingVertical="m"
          flexGrow={1}
          paddingRight="l"
          borderBottomWidth={index !== maxIndex ? 1 : 0}
          borderBottomColor="ligthGray"
        >
          <Box>
            <Text
              fontSize={16}
              paddingBottom="xxs"
              allowFontScaling={systemFont}
              color="text"
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                fontSize={15}
                color="subtitle"
                allowFontScaling={systemFont}
              >
                {subtitle}
              </Text>
            )}
          </Box>
          {/* <Ionicons
            name="ios-star"
            size={20}
            color={theme.colors.sepratorGray}
          /> */}
        </Box>
      </Button>
    );
  }
);

export { CommunityCell };

/*
   <Button
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      borderBottomColor="gray"
      paddingVertical="l"
      paddingRight="m"
      marginLeft="l"
      borderBottomWidth={0.2}
      onPressIn={() => navigation.navigate('Home')}
    >
      <Box flexDirection="row" alignContent="center">
        <Box
          backgroundColor="red"
          alignItems="center"
          justifyContent="center"
          width={35}
          height={35}
          borderRadius="full"
          mr="m"
        >
          <Ionicons name="ios-home" size={20} color="white" />
        </Box>
        <Box justifyContent="center">
          <Text fontSize={15}>Home</Text>
          <Text color="gray">Posts from your subscriptions</Text>
        </Box>
      </Box>
      <Ionicons name="ios-chevron-forward" size={23} color="gray" />
    </Button>// */
