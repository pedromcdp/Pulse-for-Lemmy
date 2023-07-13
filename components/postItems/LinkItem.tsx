import { useTheme } from '@shopify/restyle';
import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {} from 'react-native';
import { SFSymbol } from 'react-native-sfsymbols';

import type { Theme } from '@/theme/theme';

import { Box } from '../core/Box';
import Button from '../core/Button';
import { Text } from '../core/Text';

interface ILinkItemProps {
  link: string;
  thumbnail: string | undefined;
  isPostPage?: boolean;
}

function LinkItem({ link, thumbnail, isPostPage }: ILinkItemProps) {
  const theme = useTheme<Theme>();

  const truncateLink = (): string => {
    const truncatedlink = link.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '');

    if (truncatedlink.length <= 33) return truncatedlink;

    return `${truncatedlink.slice(0, 30)}...`;
  };

  const handlePressButtonAsync = (): void => {
    WebBrowser.openBrowserAsync(link, {
      dismissButtonStyle: 'done',
      controlsColor: theme.colors.accent,
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      // readerMode: true, // TODO: Add reader mode
      toolbarColor: theme.colors.primaryBG,
    }).then(() => {
      WebBrowser.dismissBrowser();
    });
  };

  return (
    <Button
      mx="l"
      borderRadius={'m'}
      mt="m"
      mb="xs"
      pb="s"
      bg="secondaryBG"
      onPress={handlePressButtonAsync}
    >
      {!isPostPage && thumbnail && (
        <Image
          style={{
            width: '100%',
            height: 190,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
          source={{
            uri: thumbnail,
          }}
        />
      )}
      <Box
        flexDirection="row"
        alignItems="center"
        mx="s"
        pt="s"
        justifyContent="space-between"
      >
        <Box flexDirection="row" alignItems="center">
          {isPostPage && thumbnail ? (
            <Image
              style={{
                width: 32,
                height: 32,
                marginRight: 10,
                borderRadius: theme.borderRadii.ss,
              }}
              source={{
                uri: thumbnail,
              }}
            />
          ) : (
            <SFSymbol
              name="safari.fill"
              weight="thin"
              scale="large"
              color={theme.colors.gray}
              size={25}
              resizeMode="center"
              style={{
                width: 32,
                height: 32,
                marginRight: 10,
              }}
            />
          )}
          <Box
            borderLeftWidth={0.2}
            borderColor="gray"
            height={32}
            justifyContent="center"
            flexGrow={0}
          >
            <Text
              pl="m"
              color="linkDark"
              variant="subtitle"
              allowFontScaling={false}
            >
              {truncateLink().split('/')[0]}
              <Text
                color="linkLight"
                variant="subtitle"
                allowFontScaling={false}
              >
                /{truncateLink().split('/').slice(1).join('/').toLowerCase()}
              </Text>
            </Text>
          </Box>
        </Box>
        <Box flexShrink={0} flexGrow={0} justifyContent="center" pr="xxs">
          <SFSymbol
            name="chevron.right"
            weight="medium"
            scale="medium"
            color={theme.colors.gray}
            size={16}
            resizeMode="center"
            style={{
              width: 16,
              height: 32,
            }}
          />
        </Box>
      </Box>
    </Button>
  );
}

export default LinkItem;
