import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@shopify/restyle';
import type { CommunityView } from 'lemmy-js-client';
import React, { useLayoutEffect } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';

import { Cell } from '@/components/cells';
import { Box } from '@/components/core/Box';
import { Text } from '@/components/core/Text';
import { useListComunites } from '@/hooks/useGetComunites';
import { useAppearanceStore } from '@/stores/AppearanceStore';
import type { Theme } from '@/theme/theme';

interface ISearchProps {
  navigation: NativeStackNavigationProp<any, any>;
}

const SearchScreen = ({ navigation }: ISearchProps) => {
  const { systemFont } = useAppearanceStore((state) => state.settings);
  const theme = useTheme<Theme>();
  const { data: trendingCommunities, isLoading } = useListComunites({
    type_: 'All',
    sort: 'TopDay',
    limit: 5,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'SearchInputGonnaGoHere',
    });
  }, [navigation]);

  const renderEmptyListComponent = () => {
    if (isLoading) {
      return <ActivityIndicator />;
    }
    return (
      <Box
        flex={1}
        alignItems="center"
        justifyContent="center"
        paddingVertical="xxl"
      >
        <Text color="gray">No communities found</Text>
      </Box>
    );
  };

  const keyExtractor = (item: CommunityView) => item.community.id.toString();

  const renderItem = ({
    item,
    index,
  }: {
    item: CommunityView;
    index: number;
  }) => (
    <Cell
      title={item.community.name}
      subtitle={item.community.actor_id.split('//')[1]?.split('/')[0]}
      icon="trending-up"
      index={index}
      maxIndex={4}
      onPress={() => {
        navigation.push('Community', {
          title: item.community.name,
          community: item.community,
        });
      }}
    />
  );

  // onPress={() => {
  //   navigation.navigate('Community', {
  //     title: community.community.title,
  //   });
  // }}

  return (
    <FlatList
      style={{
        flex: 1,
        backgroundColor: theme.colors.secondaryBG,
        paddingHorizontal: theme.spacing.l,
        paddingVertical: theme.spacing.xxl,
      }}
      data={trendingCommunities}
      ListHeaderComponent={() => (
        <Text
          pb="s"
          textTransform="uppercase"
          color="gray"
          paddingLeft="l"
          variant="caption"
          allowFontScaling={systemFont}
        >
          Trending Communities
        </Text>
      )}
      ListEmptyComponent={renderEmptyListComponent}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
    />
  );
};

export default SearchScreen;
