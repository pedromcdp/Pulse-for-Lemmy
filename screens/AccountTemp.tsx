import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useCallback, useLayoutEffect } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet } from 'react-native';

import { Cell } from '@/components/cells';
import Button from '@/components/core/Button';
import { Text } from '@/components/core/Text';
import { useGetUserDetails } from '@/hooks/useGetUser';
import { useAccountsStore } from '@/stores/AccountsStore';
import theme from '@/theme/theme';
import type {
  ICellItem,
  IHeaderData,
  IRenderCellProps,
  IRenderItemsProps,
} from '@/types/AccountTypes';

interface IAccountProps {
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
}

const AccountTemp = ({ navigation, route }: IAccountProps) => {
  dayjs.extend(customParseFormat);
  dayjs.extend(relativeTime);
  dayjs.extend(advancedFormat);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: route.params!.user.name ?? 'Account',
    });
  });

  const currentDate = dayjs();
  const activeAccount = useAccountsStore((state) => state.activeAccount);
  const { data, isLoading, refetch } = useGetUserDetails(
    undefined,
    route.params!.user.name,
    route.params!.user.id
  );

  // Review this
  const daysSinceAccountCreation = currentDate.diff(
    dayjs(data?.person_view.person.published),
    'day'
  );
  const formattedResult = `${daysSinceAccountCreation}d`;

  const headerData: IHeaderData[] = [
    {
      title: 'Comment score',
      value: data?.person_view.counts.comment_score,
    },
    {
      title: 'Post score',
      value: data?.person_view.counts.post_score,
    },
    {
      title: 'Account age',
      value: formattedResult,
      onPress: () =>
        Alert.alert(
          `Account is ${dayjs(data?.person_view.person.published)
            .fromNow(false)
            .replace(' ago', ' old')}`,
          `Created on ${dayjs(data?.person_view.person.published).format(
            'MMMM Do, YYYY, [at] h:mm A'
          )}`
        ),
    },
  ];

  const cellItem: ICellItem[] = [
    {
      title: 'Posts',
      icon: 'ios-albums-outline',
      onPress: () => navigation.navigate('Posts', { title: 'Posts' }),
    },
    {
      title: 'Comments',
      icon: 'ios-chatbubble-outline',
      onPress: () => navigation.navigate('Comments', { title: 'Comments' }),
    },
    {
      title: 'Saved',
      icon: 'ios-bookmark-outline',
      onPress: () => navigation.navigate('SavedPosts', { title: 'Saved' }),
    },
  ];

  const refreshControl = () => {
    return <RefreshControl refreshing={isLoading} onRefresh={refetch} />;
  };

  const renderHeaderItem = useCallback(({ item }: IRenderItemsProps) => {
    return (
      <Button onPress={item.onPress} flexDirection="column" alignItems="center">
        <Text fontWeight="500" fontSize={23} mb="xs">
          {item.value}
        </Text>
        <Text color="gray" fontWeight="500">
          {item.title.split(' ')[0]}
        </Text>
        <Text color="gray" fontWeight="500">
          {item.title.split(' ')[1]}
        </Text>
      </Button>
    );
  }, []);

  const renderCellItem = useCallback(({ item, index }: IRenderCellProps) => {
    if (
      activeAccount?.username !== route.params!.user.name &&
      item.title === 'Saved'
    ) {
      return null;
    }
    return (
      <Cell
        index={index}
        title={item.title}
        icon={item.icon}
        onPress={item.onPress}
        maxIndex={
          activeAccount?.username !== route.params!.user.name
            ? cellItem.length - 2
            : cellItem.length - 1
        }
      />
    );
  }, []);

  return (
    <FlatList
      ListEmptyComponent={() => (
        <Text variant="default" textAlign="center" paddingVertical="l">
          You're not logged in
        </Text>
      )}
      ListHeaderComponent={() => (
        <FlatList
          data={headerData}
          renderItem={renderHeaderItem}
          style={styles.header}
          keyExtractor={(item) => item.title}
        />
      )}
      refreshControl={refreshControl()}
      style={styles.container}
      data={cellItem}
      keyExtractor={(item) => item.title}
      renderItem={renderCellItem}
    />
  );
};

export default AccountTemp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBG,
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.xl,
  },
  header: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    marginBottom: theme.spacing.xxl,
  },
});
