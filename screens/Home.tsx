/* eslint-disable no-restricted-syntax */
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '@shopify/restyle';
import * as Haptics from 'expo-haptics';
import type { PostView } from 'lemmy-js-client';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import {
  ActionSheetIOS,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SFSymbol } from 'react-native-sfsymbols';

import PostCell from '@/components/cells/PostCell';
import { Box } from '@/components/core/Box';
import Button from '@/components/core/Button';
import { Text } from '@/components/core/Text';
import { useGetAllPosts } from '@/hooks/useGetPosts';
import { useAccountsStore } from '@/stores/AccountsStore';
import { useFeedStore } from '@/stores/FeedStore';
import type { Theme } from '@/theme/theme';

interface IHomeProps {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<any>;
}

const Home = ({ navigation, route }: IHomeProps) => {
  const theme = useTheme<Theme>();
  const [showSearchHeader, setShowSearchHeader] = useState(false);
  const handleShowSearchHeader = useCallback((value: boolean) => {
    setShowSearchHeader(value);
  }, []);
  const activeAccount = useAccountsStore((state) => state.activeAccount);
  const { activeType, activeSort } = useFeedStore((state) => state);
  const flatListRef = React.useRef<FlashList<PostView>>(null);
  const {
    data: test,
    hasNextPage,
    fetchNextPage,
    refetch,
    isLoading,
  } = useGetAllPosts(
    activeAccount?.jwt,
    undefined,
    undefined,
    activeSort,
    activeType
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params?.title ?? 'Home',
      freezeOnBlur: true,
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
            py="m"
            px="l"
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
              size={16}
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
      headerBackTitle: route.name === 'Home' ? 'Communities' : undefined,
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
                name="flame"
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
        placeholder: 'Search',
        hideWhenScrolling: true,
      },
    });
  }, [showSearchHeader, navigation]);

  const handleRenderItem = useCallback(({ item }: { item: PostView }) => {
    return <PostCell item={item} />;
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

  return (
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
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        data={test?.pages.map((page) => page.posts).flat(Infinity) as any}
        renderItem={handleRenderItem}
        ListEmptyComponent={renderEmpty}
        estimatedItemSize={800}
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

export default Home;

// Search Results

/* <Box
position="absolute"
left={0}
right={0}
bottom={0}
top={0}
bg="black"
zIndex={1}
opacity={showSearchHeader ? 0.5 : 0}
/> */
