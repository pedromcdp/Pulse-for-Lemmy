import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlashList } from '@shopify/flash-list';
import type { PostView } from 'lemmy-js-client';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  ActionSheetIOS,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { SFSymbol } from 'react-native-sfsymbols';

import PostCell from '@/components/cells/PostCell';
import { Box } from '@/components/core/Box';
import Button from '@/components/core/Button';
import { Text } from '@/components/core/Text';
import { useGetAllPosts } from '@/hooks/useGetPosts';
import { useAccountsStore } from '@/stores/AccountsStore';
import theme from '@/theme/theme';

interface ICommunityProps {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<any, any>;
}

const CommunityScreen = ({ navigation, route }: ICommunityProps) => {
  const recycled = useRef({});
  const [showSearchHeader, setShowSearchHeader] = useState<boolean>(false);
  const activeAccount = useAccountsStore((state) => state.activeAccount);
  const flatListRef = React.useRef<FlashList<PostView>>(null);
  const handleShowSearchHeader = useCallback((value: boolean) => {
    setShowSearchHeader(value);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params!.title,
      // headerBackTitle: 'Back',
      headerBackTitleVisible: !(route.params!.title.length > 14),
      headerTitle: ({ children }) =>
        showSearchHeader ? (
          <TextInput
            autoFocus
            placeholder="Comunity..."
            allowFontScaling={false}
            keyboardType="ascii-capable"
            placeholderTextColor={theme.colors.gray}
            style={{
              fontSize: 17,
              marginBottom: theme.spacing.xxxxs,
            }}
          />
        ) : (
          <Button
            flexDirection="row"
            ml="xs"
            onPressIn={() => handleShowSearchHeader(true)}
            alignItems="center"
          >
            <Text variant="title" allowFontScaling={false} color="text">
              {children}
            </Text>
            <SFSymbol
              name="chevron.down"
              weight="medium"
              scale="small"
              color={theme.colors.text}
              size={14}
              resizeMode="center"
              multicolor={false}
              style={{ width: 17, height: 17, marginTop: 2 }}
            />
            {/* <Ionicons
            name="ios-chevron-down-sharp"
            size={17}
            color={theme.colors.text}
            style={{ marginTop: 2 }}
          /> */}
          </Button>
        ),
      headerShadowVisible: false,
      headerTransparent: false,
      headerTitleAlign: 'center',
      headerRight: () =>
        showSearchHeader ? (
          <Button
            flexDirection="row"
            ml="xs"
            onPress={() => handleShowSearchHeader(false)}
          >
            <Text fontSize={17} allowFontScaling={false} color="accent">
              Cancel
            </Text>
          </Button>
        ) : (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              onPressIn={() =>
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
                )
              }
            >
              <SFSymbol
                name="flame"
                weight="regular"
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
                weight="medium"
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
        placeholder: `Search c/${route.params!.community.name}`,
        hideWhenScrolling: true,
      },
    });
  }, [navigation, showSearchHeader]);

  useEffect(() => {
    FastImage.clearMemoryCache();
  }, []);

  const renderEmpty = useCallback(() => {
    return (
      <Box
        flexGrow={1}
        flex={1}
        justifyContent="center"
        alignItems="center"
        height={Dimensions.get('screen').height / 1.5}
      >
        <ActivityIndicator />
      </Box>
    );
  }, []);

  const handleRenderItem = useCallback(({ item }: { item: PostView }) => {
    return (
      <PostCell
        item={item}
        isCommunityItem
        recycled={recycled}
        postId={item.post.id}
      />
    );
  }, []);

  const { data, hasNextPage, fetchNextPage, refetch, isLoading } =
    useGetAllPosts(
      activeAccount?.jwt,
      route.params!.community.id,
      undefined,
      'Hot',
      undefined
    );

  const refreshControl = () => {
    return <RefreshControl refreshing={isLoading} onRefresh={refetch} />;
  };

  return (
    <Box flex={1} backgroundColor="secondaryBG">
      <FlashList
        ref={flatListRef}
        refreshControl={refreshControl()}
        ListEmptyComponent={renderEmpty}
        data={data?.pages.map((page) => page.posts).flat() as any}
        renderItem={handleRenderItem}
        estimatedItemSize={500}
        keyExtractor={(_, index) => _.post.id.toString() + index.toString()}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
      />
    </Box>
  );
};

export default CommunityScreen;

/*

 <Box
      flex={1}
      backgroundColor="secondaryBG"
      onStartShouldSetResponder={() => {
        handleShowSearchHeader(false);
        return false;
      }}
    >
      <FlashList
        ref={flatListRef}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        data={test?.pages.map((page) => page.posts).flat() as any}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={() => (
          <Box py="xs" backgroundColor="secondaryBG" />
        )}
        renderItem={handleRenderItem}
        estimatedItemSize={500}
        keyExtractor={(_, index) => _.post.id.toString() + index.toString()}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
      />
    </Box>
*/
