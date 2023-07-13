import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CommunityView } from 'lemmy-js-client';
import React, { useLayoutEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';

import { Cell } from '@/components/cells';
import { Box } from '@/components/core/Box';
import { Text } from '@/components/core/Text';
import { useListComunites } from '@/hooks/useGetComunites';
import { useAppearanceStore } from '@/stores/AppearanceStore';
import theme from '@/theme/theme';

interface ISearchProps {
  navigation: NativeStackNavigationProp<any, any>;
}

const SearchScreen = ({ navigation }: ISearchProps) => {
  const { systemFont } = useAppearanceStore((state) => state.settings);
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
      icon="ios-trending-up"
      index={index}
      maxIndex={4}
      onPress={() => {
        navigation.navigate('Community', {
          title: item.community.title,
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
      style={styles.container}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBG,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xxl,
  },
});

export default SearchScreen;
