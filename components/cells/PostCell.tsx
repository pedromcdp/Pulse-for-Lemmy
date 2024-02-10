/* eslint-disable no-param-reassign */
import type { ParamListBase } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@shopify/restyle';
import dayjs from 'dayjs';
import UpdateLocate from 'dayjs/plugin/updateLocale';
import * as Haptics from 'expo-haptics';
import type { PostView } from 'lemmy-js-client';
import React, { memo, useMemo, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import type { OnLoadEvent } from 'react-native-fast-image';
import FastImage from 'react-native-fast-image';
import {
  ContextMenuButton,
  ContextMenuView,
} from 'react-native-ios-context-menu';
import { SFSymbol } from 'react-native-sfsymbols';

import { ExtensionType, getLinkInfo } from '@/helpers/LinkHelper';
import { useAppearanceStore } from '@/stores/AppearanceStore';
import type { Theme } from '@/theme/theme';

import { Box } from '../core/Box';
import Button from '../core/Button';
import { Text } from '../core/Text';
import LinkItem from '../postItems/LinkItem';

interface IPostCellProps {
  item: PostView;
  isCommunityItem?: boolean;
  recycled: React.MutableRefObject<{}>;
  postId: number;
}

const PostCell = memo(
  ({ item, isCommunityItem = false, recycled, postId }: IPostCellProps) => {
    const theme = useTheme<Theme>();
    const navigation =
      useNavigation<NativeStackNavigationProp<ParamListBase>>();
    dayjs.extend(UpdateLocate);
    dayjs.updateLocale('en', {
      relativeTime: {
        future: 'in %s',
        past: '%s ago',
        s: '1s',
        ss: '%ss',
        m: '1m',
        mm: '%dm',
        h: '1h',
        hh: '%dh',
        d: '1d',
        dd: '%dd',
        M: '1m',
        MM: '%dM',
        y: '1y',
        yy: '%dY',
      },
    });

    const url = getLinkInfo(item.post.url);
    const isImage = url.extType === ExtensionType.IMAGE;

    const showLink =
      url.extType === ExtensionType.VIDEO ||
      url.extType === ExtensionType.GENERIC;

    const thumbnailUrl = useMemo(() => {
      if (url.extType === ExtensionType.IMAGE) {
        return item.post.url;
      }
      return null;
    }, [item.post.url]);

    const { systemFont } = useAppearanceStore((state) => state.settings);
    const [ratio, setRatio] = useState<string | number>(1);

    const lastPostId = useRef(postId);
    if (recycled && postId !== lastPostId.current) {
      recycled.current = {
        ...(recycled.current as { [key: number]: { ratio: number } }),
        [lastPostId.current]: {
          ratio,
        },
      };

      if (postId in recycled.current) {
        const currentPost = recycled.current[postId];
        setRatio(currentPost.ratio);
      }

      lastPostId.current = postId;
    }
    // useEffect(() => {
    //   if (item.post.url && isImage) {
    //     RNImage.getSize(item.post.url, (width, height) => {
    //       setRatio(width / height);
    //     });
    //   }
    // }, [isImage, item.post.url]);

    const onLoad = (e: OnLoadEvent) => {
      const { width, height } = e.nativeEvent;
      setRatio(width / height);
      FastImage.clearMemoryCache();
    };

    const Footer = () => {
      return (
        <Box
          px="l"
          mt="s"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="flex-start"
          >
            <Button
              mb={isCommunityItem ? 'xs' : 's'}
              onPress={() =>
                isCommunityItem
                  ? navigation.push('Account', { user: item.creator })
                  : navigation.push('Community', {
                      title: item.community.name,
                      community: item.community,
                    })
              }
            >
              {isCommunityItem ? (
                <Box flexDirection="row" alignItems="center">
                  {item.creator.admin || item.post.featured_community ? (
                    <Box mr="xs">
                      <SFSymbol
                        name="megaphone.fill"
                        weight="regular"
                        scale="medium"
                        color={theme.colors.green}
                        size={12}
                        resizeMode="bottom"
                        style={{ width: 12, height: 12 }}
                      />
                    </Box>
                  ) : null}
                  <Text
                    variant="subtitle"
                    color={item.creator.admin ? 'green' : 'subtitle'}
                    allowFontScaling={systemFont}
                    mb="xxs"
                  >
                    by{' '}
                    <Text
                      variant="subtitle"
                      color={item.creator.admin ? 'green' : 'gray'}
                      allowFontScaling={systemFont}
                      fontWeight="500"
                    >
                      {item.creator.name}
                    </Text>
                  </Text>
                </Box>
              ) : (
                <Text
                  variant="subtitle"
                  color="gray"
                  allowFontScaling={systemFont}
                  fontWeight="500"
                >
                  {item.community.name}
                </Text>
              )}
            </Button>
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="flex-start"
              alignContent="center"
            >
              <Box flexDirection="row" alignItems="center" mr="s">
                <SFSymbol
                  name="arrow.up"
                  weight="regular"
                  scale="medium"
                  color={
                    item.my_vote === 1 ? theme.colors.orange : theme.colors.gray
                  }
                  size={12}
                  resizeMode="center"
                  multicolor={false}
                  style={{ width: 14, height: 14 }}
                />
                <Text
                  ml="xxs"
                  fontSize={14}
                  color={item.my_vote === 1 ? 'orange' : 'gray'}
                >
                  {item.counts.upvotes}
                </Text>
              </Box>
              <Box flexDirection="row" alignItems="center" mr="s">
                <SFSymbol
                  name="message"
                  weight="regular"
                  scale="medium"
                  color={theme.colors.gray}
                  size={12}
                  resizeMode="center"
                  multicolor={false}
                  style={{ width: 14, height: 14, transform: [{ scaleX: -1 }] }}
                />
                <Text ml="xs" fontSize={14} color="gray">
                  {item.counts.comments}
                </Text>
              </Box>
              <Box flexDirection="row" alignItems="center">
                <SFSymbol
                  name="clock"
                  weight="regular"
                  scale="medium"
                  color={theme.colors.gray}
                  size={12}
                  resizeMode="center"
                  multicolor={false}
                  style={{ width: 14, height: 14, transform: [{ scaleX: -1 }] }}
                />
                <Text ml="xxs" fontSize={14} color="gray">
                  {dayjs(item.post.published).fromNow(true)}
                </Text>
              </Box>
            </Box>
          </Box>
          <Box flexDirection="row">
            <ContextMenuButton
              isMenuPrimaryAction
              onPressMenuItem={({ nativeEvent }) => {
                switch (nativeEvent.actionKey) {
                  case 'user':
                    navigation.push('Account', { user: item.creator });
                    break;
                  case 'community':
                    navigation.push('Community', {
                      title: item.community.name,
                      community: item.community,
                    });
                    break;
                  default:
                    break;
                }
              }}
              menuConfig={{
                menuTitle: '',
                menuItems: [
                  {
                    actionKey: 'upvote',
                    actionTitle: 'Upvote',
                    icon: {
                      iconType: 'SYSTEM',
                      iconValue: 'arrow.up',
                    },
                  },
                  {
                    actionKey: 'downvote',
                    actionTitle: 'Downvote',
                    icon: {
                      iconType: 'SYSTEM',
                      iconValue: 'arrow.down',
                    },
                  },
                  {
                    actionKey: 'save',
                    actionTitle: 'Save',
                    icon: {
                      iconType: 'SYSTEM',
                      iconValue: 'bookmark',
                    },
                  },
                  {
                    actionKey: 'hide',
                    actionTitle: 'Hide',
                    icon: {
                      iconType: 'SYSTEM',
                      iconValue: 'eye.slash',
                    },
                  },
                  {
                    actionKey: 'user',
                    actionTitle: item.creator.name,
                    icon: {
                      iconType: 'SYSTEM',
                      iconValue: 'person.crop.circle',
                    },
                  },
                  {
                    actionKey: 'community',
                    actionTitle: `${item.community.name}@${
                      item.community.actor_id.split('//')[1]!.split('/')[0]
                    }`,
                    icon: {
                      iconType: 'SYSTEM',
                      iconValue: 'person.2',
                    },
                  },
                  {
                    actionKey: 'share',
                    actionTitle: 'Share',
                    icon: {
                      iconType: 'SYSTEM',
                      iconValue: 'square.and.arrow.up',
                    },
                  },
                  {
                    actionKey: 'report',
                    actionTitle: 'Report',
                    icon: {
                      iconType: 'SYSTEM',
                      iconValue: 'exclamationmark.bubble',
                    },
                  },
                ],
              }}
            >
              <Button
                mt="s"
                width={30}
                height={30}
                justifyContent="center"
                alignItems="center"
                // backgroundColor="red"
                borderRadius="s"
                mr="xs"
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
              >
                <SFSymbol
                  name="ellipsis"
                  weight="medium"
                  scale="large"
                  color={theme.colors.gray}
                  size={15}
                  resizeMode="center"
                  multicolor={false}
                  style={{ width: 30, height: 30 }}
                />
              </Button>
            </ContextMenuButton>
            <Button
              mt="s"
              width={30}
              height={30}
              justifyContent="center"
              alignItems="center"
              backgroundColor={item.my_vote === 1 ? 'orange' : undefined}
              borderRadius="s"
              mr="xs"
            >
              <SFSymbol
                name="arrow.up"
                weight="medium"
                scale="large"
                color={
                  item.my_vote === 1 ? theme.colors.white : theme.colors.gray
                }
                size={15}
                resizeMode="center"
                multicolor={false}
                style={{ width: 30, height: 30 }}
              />
            </Button>
            <Button
              mt="s"
              width={30}
              height={30}
              justifyContent="center"
              alignItems="center"
              borderRadius="s"
              mr="xs"
            >
              <SFSymbol
                name="arrow.down"
                weight="medium"
                scale="large"
                color={theme.colors.gray}
                size={15}
                resizeMode="center"
                multicolor={false}
                style={{ width: 30, height: 30 }}
              />
            </Button>
          </Box>
        </Box>
      );
    };

    // const ratio = useMemo(() => {
    //   if (isImage) {
    //     return ration;
    //   }
    //   return 1;
    // }, [item.post.url, isImage, ration]);

    const image = useMemo(() => {
      if (isImage && thumbnailUrl) {
        return (
          <FastImage
            source={{ uri: thumbnailUrl }}
            resizeMode="contain"
            onLoad={onLoad}
            style={{
              width: Dimensions.get('window').width,
              aspectRatio: ratio ?? 1,
            }}
          />
        );
      }
      return null;
    }, [thumbnailUrl, isImage, ratio]);

    return (
      <Box flexDirection="column">
        <ContextMenuView
          shouldWaitForMenuToHideBeforeFiringOnPressMenuItem={false}
          onPressMenuItem={({ nativeEvent }) => {
            switch (nativeEvent.actionKey) {
              case 'user':
                navigation.push('Account', { user: item.creator });
                break;
              case 'community':
                navigation.push('Community', {
                  title: item.community.name,
                  community: item.community,
                });
                break;
              default:
                break;
            }
          }}
          menuConfig={{
            menuTitle: '',
            menuItems: [
              {
                actionKey: 'upvote',
                actionTitle: 'Upvote',
                icon: {
                  iconType: 'SYSTEM',
                  iconValue: 'arrow.up',
                },
              },
              {
                actionKey: 'downvote',
                actionTitle: 'Downvote',
                icon: {
                  iconType: 'SYSTEM',
                  iconValue: 'arrow.down',
                },
              },
              {
                actionKey: 'save',
                actionTitle: 'Save',
                icon: {
                  iconType: 'SYSTEM',
                  iconValue: 'bookmark',
                },
              },
              {
                actionKey: 'hide',
                actionTitle: 'Hide',
                icon: {
                  iconType: 'SYSTEM',
                  iconValue: 'eye.slash',
                },
              },
              {
                actionKey: 'user',
                actionTitle: item.creator.name,
                icon: {
                  iconType: 'SYSTEM',
                  iconValue: 'person.crop.circle',
                },
              },
              {
                actionKey: 'community',
                actionTitle: `${item.community.name}@${
                  item.community.actor_id.split('//')[1]!.split('/')[0]
                }`,
                icon: {
                  iconType: 'SYSTEM',
                  iconValue: 'person.2',
                },
              },
              {
                actionKey: 'share',
                actionTitle: 'Share',
                icon: {
                  iconType: 'SYSTEM',
                  iconValue: 'square.and.arrow.up',
                },
              },
              {
                actionKey: 'report',
                actionTitle: 'Report',
                icon: {
                  iconType: 'SYSTEM',
                  iconValue: 'exclamationmark.bubble',
                },
              },
            ],
          }}
        >
          <Button
            backgroundColor="cellColor"
            py="m"
            onPress={() =>
              navigation.push('Post', {
                id: item.post.id,
                title: item.counts.comments,
                item,
              })
            }
          >
            <Text
              variant="default"
              allowFontScaling={systemFont}
              color={item.read ? 'gray' : 'text'}
              px="l"
            >
              {item.post.name}{' '}
            </Text>
            {/* NFSW TAG */}
            {item.post.nsfw && (
              <Box
                mt="xxs"
                backgroundColor="red"
                py="xxs"
                borderRadius={'ss'}
                width={45}
                mx="l"
                flexGrow={0}
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize={14} color="white" fontWeight="500">
                  NSFW
                </Text>
              </Box>
            )}
            {isImage && (
              <Box position="relative" mt="s">
                {image}
                {thumbnailUrl!.split('.').pop() === 'gif' && (
                  <Box
                    position="absolute"
                    backgroundColor="white"
                    px="s"
                    py="xs"
                    borderRadius="s"
                    bottom={theme.spacing.s}
                    right={theme.spacing.s}
                    opacity={0.95}
                  >
                    <Text fontWeight="500" fontSize={16}>
                      GIF
                    </Text>
                  </Box>
                )}
              </Box>
            )}
            {item.post.body && (
              <Text
                px="l"
                mt={isImage ? 'm' : 's'}
                variant="subtitle"
                color="subtitle"
                allowFontScaling={systemFont}
              >
                {item.post.body.substring(0, 100)}...
              </Text>
            )}
            {showLink && (
              <LinkItem link={url.link!} thumbnail={item.post.thumbnail_url} />
            )}
            <Footer />
          </Button>
        </ContextMenuView>
        <Box
          py="xs"
          backgroundColor="secondaryBG"
          style={{ width: Dimensions.get('window').width }}
        />
      </Box>
    );
  }
);

export default PostCell;
