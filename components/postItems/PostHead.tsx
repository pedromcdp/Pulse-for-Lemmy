import type { ParamListBase } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { useTheme } from '@shopify/restyle';
import dayjs from 'dayjs';
import type { PostView } from 'lemmy-js-client';
import { memo, useMemo } from 'react';
import { Dimensions, Pressable } from 'react-native';
import FastImage from 'react-native-fast-image';
import Markdown from 'react-native-markdown-display';
import { SFSymbol } from 'react-native-sfsymbols';

import { ExtensionType, getLinkInfo } from '@/helpers/LinkHelper';
import { useAppearanceStore } from '@/stores/AppearanceStore';
import type { Theme } from '@/theme/theme';

import { Box } from '../core/Box';
import Button from '../core/Button';
import { Text } from '../core/Text';
import LinkItem from './LinkItem';

interface IPostHeadProps {
  item: PostView;
}

const PostHead = memo(({ item }: IPostHeadProps) => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { systemFont } = useAppearanceStore((state) => state.settings);

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

  const image = useMemo(() => {
    if (isImage && thumbnailUrl) {
      return (
        <Box position="relative">
          <FastImage
            source={{ uri: thumbnailUrl }}
            resizeMode="contain"
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              minWidth: Dimensions.get('window').width,
              maxHeight: 300,
              aspectRatio: 1,
              backgroundColor: theme.colors.secondaryBG,
            }}
          />
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
      );
    }
    return null;
  }, [thumbnailUrl, isImage]);

  return (
    <Box
      borderBottomWidth={1}
      borderBottomColor="divider"
      backgroundColor="primaryBG"
    >
      {image}
      <Text
        mx="l"
        pt="s"
        fontWeight="500"
        fontSize={17}
        allowFontScaling={false}
        color="text"
      >
        {item.post.name}
      </Text>
      {item.post.body && (
        <Box mx="l" pt="xxs">
          <Markdown
            style={{
              body: {
                color: theme.colors.text,
                fontSize: 17,
                lineHeight: 20,
              },
              heading1: {
                color: theme.colors.text,
                fontSize: 24,
                fontWeight: '600',
              },
              heading2: {
                color: theme.colors.text,
                fontSize: 20,
                fontWeight: '600',
              },
              heading3: {
                color: theme.colors.text,
                fontSize: 18,
                fontWeight: '600',
              },
              heading4: {
                color: theme.colors.text,
                fontSize: 16,
                fontWeight: '600',
              },
              heading5: {
                color: theme.colors.text,
                fontSize: 14,
                fontWeight: '600',
              },
              heading6: {
                color: theme.colors.text,
                fontSize: 12,
                fontWeight: '600',
              },
              strong: {
                fontWeight: '600',
              },
              em: {
                fontStyle: 'italic',
              },
              del: {
                textDecorationLine: 'line-through',
              },
              blockquote: {
                backgroundColor: theme.colors.secondaryBG,
                padding: theme.spacing.s,
                margin: theme.spacing.s,
                borderRadius: 4,
              },
              link: {
                color: theme.colors.accent,
              },
              text: {
                color: theme.colors.text,
              },
              list: {
                color: theme.colors.text,
              },
              listItem: {
                color: theme.colors.text,
              },
              listUnorderedItemIcon: {
                color: theme.colors.text,
              },
              listOrderedItemIcon: {
                color: theme.colors.text,
              },
              listUnorderedItemText: {
                color: theme.colors.text,
              },
              listOrderedItemText: {
                color: theme.colors.text,
              },
              codeBlock: {
                backgroundColor: theme.colors.secondaryBG,
                padding: theme.spacing.s,
                margin: theme.spacing.s,
                borderRadius: 4,
              },
              codeInline: {
                backgroundColor: theme.colors.secondaryBG,
                padding: theme.spacing.s,
                margin: theme.spacing.s,
                borderRadius: 4,
              },
              table: {
                backgroundColor: theme.colors.secondaryBG,
                padding: theme.spacing.s,
                margin: theme.spacing.s,
                borderRadius: 4,
              },
              tableHeaderCell: {
                backgroundColor: theme.colors.secondaryBG,
                padding: theme.spacing.s,
                margin: theme.spacing.s,
                borderRadius: 4,
              },
              tableHeaderCellLast: {
                backgroundColor: theme.colors.secondaryBG,
                padding: theme.spacing.s,
                margin: theme.spacing.s,
                borderRadius: 4,
              },
              tableCell: {
                backgroundColor: theme.colors.secondaryBG,
                padding: theme.spacing.s,
                margin: theme.spacing.s,
                borderRadius: 4,
              },
              tableCellLast: {
                backgroundColor: theme.colors.secondaryBG,
                padding: theme.spacing.s,
                margin: theme.spacing.s,
                borderRadius: 4,
              },
              tableCellContent: {
                backgroundColor: theme.colors.secondaryBG,
                padding: theme.spacing.s,
                margin: theme.spacing.s,
                borderRadius: 4,
              },
              tableCellContentLast: {
                backgroundColor: theme.colors.secondaryBG,
                padding: theme.spacing.s,
                margin: theme.spacing.s,
                borderRadius: 4,
              },
            }}
          >
            {item.post.body}
          </Markdown>
        </Box>
      )}
      {showLink && (
        <LinkItem
          link={url.link!}
          thumbnail={item.post.thumbnail_url}
          isPostPage
        />
      )}
      <Button mx="l" pt="s" flexDirection="row" alignItems="center">
        {item.creator.admin || item.post.featured_community ? (
          <Box mr="xs" style={{ marginBottom: -2.8 }}>
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
        <Text variant="subtitle" color="subtitle" allowFontScaling={systemFont}>
          in{' '}
          <Pressable
            style={{ marginBottom: -2.8 }}
            onPress={() => {
              navigation.push('Community', {
                title: item.community.name,
                community: item.community,
              });
            }}
          >
            <Text
              variant="subtitle"
              color="subtitle"
              allowFontScaling={systemFont}
              fontWeight="500"
            >
              {item.community.name}
            </Text>
          </Pressable>
          <Text> by </Text>
          <Pressable
            style={{ marginBottom: -2.8 }}
            onPress={() => {
              navigation.push('Account', {
                user: item.creator,
              });
            }}
          >
            <Text
              variant="subtitle"
              color={item.creator.admin ? 'green' : 'subtitle'}
              allowFontScaling={systemFont}
              fontWeight="500"
            >
              {item.creator.name}
            </Text>
          </Pressable>
        </Text>
      </Button>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-start"
        alignContent="center"
        mx="l"
        pt="s"
      >
        <Box flexDirection="row" alignItems="center" mr="s">
          <SFSymbol
            name="arrow.up"
            weight="regular"
            scale="medium"
            color={item.my_vote === 1 ? theme.colors.orange : theme.colors.gray}
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
            name="face.smiling"
            weight="regular"
            scale="medium"
            color={theme.colors.gray}
            size={12}
            resizeMode="center"
            multicolor={false}
            style={{ width: 14, height: 14, transform: [{ scaleX: -1 }] }}
          />
          <Text ml="xs" fontSize={14} color="gray">
            {Math.floor(
              (item.counts.upvotes * 100) /
                (item.counts.upvotes + item.counts.downvotes) || 0
            )}
            %
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
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        mx="l"
        mt="m"
        py="ss"
        borderTopWidth={1}
        borderTopColor="divider"
      >
        <Button
          width={38}
          height={38}
          justifyContent="center"
          alignItems="center"
          borderRadius="ss"
          backgroundColor={item.my_vote === 1 ? 'orange' : undefined}
        >
          <SFSymbol
            name="arrow.up"
            color={
              item.my_vote === 1 ? theme.colors.white : theme.colors.accent
            }
            size={20}
            resizeMode="center"
            scale="large"
            style={{ width: 38, height: 38 }}
          />
        </Button>
        <Button
          width={30}
          height={30}
          justifyContent="center"
          alignItems="center"
          borderRadius="ss"
          // backgroundColor="orange"
        >
          <SFSymbol
            name="arrow.down"
            color={theme.colors.accent}
            size={20}
            resizeMode="center"
            scale="large"
            style={{ width: 30, height: 30 }}
          />
        </Button>
        <Button
          width={30}
          height={30}
          justifyContent="center"
          alignItems="center"
          borderRadius="s"
          // backgroundColor="orange"
        >
          <SFSymbol
            name="bookmark"
            color={theme.colors.accent}
            size={20}
            resizeMode="center"
            scale="large"
            style={{ width: 30, height: 30 }}
          />
        </Button>
        <Button
          width={30}
          height={30}
          justifyContent="center"
          alignItems="center"
          borderRadius="ss"
          // backgroundColor="orange"
        >
          <SFSymbol
            name="arrowshape.turn.up.left"
            color={theme.colors.accent}
            size={20}
            resizeMode="center"
            scale="large"
            style={{ width: 30, height: 30 }}
          />
        </Button>
        <Button
          width={30}
          height={30}
          justifyContent="center"
          alignItems="center"
          borderRadius="ss"
          // backgroundColor="orange"
        >
          <SFSymbol
            name="square.and.arrow.up"
            color={theme.colors.accent}
            size={20}
            resizeMode="center"
            scale="large"
            style={{ width: 30, height: 30 }}
          />
        </Button>
      </Box>
    </Box>
  );
});

export default PostHead;
