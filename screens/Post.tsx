/* eslint-disable no-nested-ternary */
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '@shopify/restyle';
import dayjs from 'dayjs';
import * as Haptics from 'expo-haptics';
import type { CommentView, PostView } from 'lemmy-js-client';
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import {
  ActionSheetIOS,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  View,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { SFSymbol } from 'react-native-sfsymbols';

import { Box } from '@/components/core/Box';
import { Text } from '@/components/core/Text';
import PostHead from '@/components/postItems/PostHead';
import { useGetComments } from '@/hooks/useGetComments';
import { useAppearanceStore } from '@/stores/AppearanceStore';
// import { useAppearanceStore } from '@/stores/AppearanceStore';
import type { Theme } from '@/theme/theme';

interface IPostProps {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<any, any>;
}

const Post = ({ navigation, route }: IPostProps) => {
  const theme = useTheme<Theme>();
  const item = route.params!.item as PostView;
  const {
    settings: { systemFont },
  } = useAppearanceStore();
  const flatListRef = React.useRef<FlashList<CommentView>>(null);
  const { data: comments, refetch } = useGetComments({ post_id: item.post.id });
  const [refreshing, setRefreshing] = useState(false);
  // const [scrollIndex, setScrollIndex] = useState(0);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  useLayoutEffect(() => {
    navigation.setOptions({
      // not working
      headerTitle: `${
        comments ? comments.comments.length : route.params!.title
      } ${route.params!.title === 1 ? 'Comment' : 'Comments'}`,
      headerTransparent: false,
      headerShadowVisible: false,
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            onPressIn={() => {
              ActionSheetIOS.showActionSheetWithOptions(
                {
                  options: [
                    'Cancel',
                    'Active',
                    'Hot',
                    'New',
                    'Old',
                    'Top',
                    'Most Comments',
                    'New Comments',
                  ],
                  cancelButtonIndex: 0,
                  message: 'Sort by...',
                },
                (buttonIndex) => {
                  if (buttonIndex === 1) {
                    //
                  }
                }
              );
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
          >
            <SFSymbol
              name="arrow.up.to.line"
              weight="light"
              scale="small"
              color={theme.colors.accent}
              size={30}
              resizeMode="center"
              multicolor={false}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <SFSymbol
              name="ellipsis"
              weight="light"
              scale="small"
              color={theme.colors.accent}
              size={30}
              resizeMode="center"
              multicolor={false}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
        </View>
      ),
      headerSearchBarOptions: {
        placeholder: 'Find in Comments',
      },
    });
  }, [navigation, comments]);
  // const activeAccount = useAccountsStore((state) => state.activeAccount);
  // const { data } = useGetPost(route.params!.id, activeAccount?.jwt);

  const renderHeader = useCallback(() => {
    return <PostHead item={item} />;
  }, [item]);

  const renderItem = useMemo(
    () =>
      ({ item: comment }: { item: CommentView }) => {
        return (
          <Box
            pt="m"
            pb="xs"
            ml="l"
            borderBottomColor="divider"
            borderBottomWidth={1}
            pr="l"
            backgroundColor="primaryBG"
          >
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box flexDirection="row" alignItems="center" id="name&upvote">
                <TouchableOpacity
                  onPress={() =>
                    navigation.push('Account', { user: comment.creator })
                  }
                >
                  <Text
                    variant="title"
                    fontWeight="500"
                    color={
                      item.creator.id === comment.creator.id ? 'accent' : 'text'
                    }
                  >
                    {comment.creator.name}
                  </Text>
                </TouchableOpacity>
                <SFSymbol
                  name="arrow.up"
                  size={12}
                  scale="large"
                  color={theme.colors.subtitle}
                  style={{
                    width: 12,
                    height: 12,
                    marginLeft: theme.spacing.s,
                    marginRight: theme.spacing.xs,
                  }}
                />
                <Text variant="default" color="subtitle">
                  {comment.counts.upvotes}
                </Text>
              </Box>
              <Box flexDirection="row" alignItems="center">
                <TouchableOpacity
                  onPressIn={() =>
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
                  }
                >
                  <SFSymbol
                    name="ellipsis"
                    size={15}
                    scale="large"
                    weight="bold"
                    color={theme.colors.subtitle}
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: theme.spacing.s,
                    }}
                  />
                </TouchableOpacity>
                <Text variant="default" color="subtitle">
                  {dayjs(comment.comment.published).fromNow(true)}
                </Text>
              </Box>
            </Box>
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
              {comment.comment.content}
            </Markdown>
          </Box>
        );
      },
    [item]
  );

  const renderEmpty = useCallback(() => {
    if (comments) {
      return (
        <Box
          justifyContent="center"
          alignItems="center"
          backgroundColor="secondaryBG"
          pt="xxl"
        >
          <Text
            variant="default"
            color="linkDark"
            fontWeight="500"
            allowFontScaling={systemFont}
          >
            No Comments
          </Text>
          <Text
            pt="s"
            variant="default"
            color="linkLight"
            allowFontScaling={systemFont}
          >
            It's quiet... too quiet...
          </Text>
        </Box>
      );
    }
    return (
      <Box
        justifyContent="center"
        alignItems="center"
        backgroundColor="secondaryBG"
        pt="xxl"
      >
        <ActivityIndicator />
      </Box>
    );
  }, [comments]);

  return (
    <Box flex={1} bg="secondaryBG" position="relative">
      <FlashList
        ref={flatListRef}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        estimatedItemSize={200}
        renderItem={renderItem}
        data={comments?.comments}
        contentContainerStyle={{ backgroundColor: theme.colors.primaryBG }}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
      />
      {/* <Button
        position="absolute"
        width={45}
        height={45}
        bg="accent"
        bottom={theme.spacing.l}
        right={theme.spacing.l}
        justifyContent="center"
        alignItems="center"
        borderRadius={'full'}
        zIndex={1000}
        onPress={() => {
          console.log('pressed');
          if (scrollIndex === comments!.comments.length - 1) {
            flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
            setScrollIndex(0);
          } else {
            flatListRef.current?.scrollToItem({
              animated: true,
              item: comments?.comments[scrollIndex + 1],
              viewPosition: 0,
            });
            setScrollIndex(scrollIndex + 1);
          }
        }}
      >
        <SFSymbol
          name="chevron.down"
          size={20}
          color={theme.colors.white}
          resizeMode="center"
          weight="regular"
          scale="medium"
          style={{ marginTop: 2 }}
        />
      </Button> */}
    </Box>
  );
};

export default Post;
