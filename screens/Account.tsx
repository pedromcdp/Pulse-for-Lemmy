import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@shopify/restyle';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useCallback, useLayoutEffect } from 'react';
import { ActivityIndicator, Alert, FlatList } from 'react-native';

import { Cell } from '@/components/cells';
import Button from '@/components/core/Button';
import { Text } from '@/components/core/Text';
import { useGetUserDetails } from '@/hooks/useGetUser';
import { useAccountsStore } from '@/stores/AccountsStore';
import type { Theme } from '@/theme/theme';

interface IAccountProps {
  navigation: NativeStackNavigationProp<any, any>;
}

const Account = ({ navigation }: IAccountProps) => {
  dayjs.extend(customParseFormat);
  dayjs.extend(relativeTime);
  dayjs.extend(advancedFormat);
  const theme = useTheme<Theme>();
  const activeAccount = useAccountsStore((state) => state.activeAccount);
  const { data, isLoading, refetch, isError } = useGetUserDetails(
    activeAccount?.jwt,
    activeAccount?.username
  );

  const currentDate = dayjs();

  const daysSinceAccountCreation = currentDate.diff(
    dayjs(data?.person_view.person.published),
    'day'
  );
  const formattedResult = `${daysSinceAccountCreation}d`;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: activeAccount?.username ?? 'Account',
      headerLeft: () => (
        <Button>
          <Text color="blue" fontSize={17} allowFontScaling={false}>
            Accounts
          </Text>
        </Button>
      ),
    });
  }, [navigation, activeAccount]);

  if (!activeAccount) {
    return (
      <Text variant="default" textAlign="center" paddingVertical="l">
        You're not logged in
      </Text>
    );
  }

  if (isLoading || isError) {
    return <ActivityIndicator style={{ paddingVertical: theme.spacing.l }} />;
  }

  interface IHeaderData {
    title: string;
    value: string | number | undefined;
    onPress?: () => void;
  }

  interface IRenderItemsProps {
    item: IHeaderData;
  }

  interface IRenderCellProps {
    item: ICellItem;
    index: number;
  }
  interface ICellItem {
    title: string;
    icon:
      | 'albums-outline'
      | 'chatbubbles-outline'
      | 'chatbubble-outline'
      | 'bookmark-outline';
    onPress?: () => void;
  }
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
      icon: 'albums-outline',
      onPress: () => navigation.push('Posts', { title: 'Posts' }),
    },
    {
      title: 'Comments',
      icon: 'chatbubble-outline',
      onPress: () => navigation.push('Comments', { title: 'Comments' }),
    },
    {
      title: 'Saved',
      icon: 'bookmark-outline',
      onPress: () => navigation.push('SavedPosts', { title: 'Saved' }),
    },
  ];

  const renderHeaderItem = useCallback(({ item }: IRenderItemsProps) => {
    return (
      <Button onPress={item.onPress} flexDirection="column" alignItems="center">
        <Text fontWeight="500" fontSize={23} mb="xs" color="text">
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
    return (
      <Cell
        index={index}
        title={item.title}
        icon={item.icon}
        onPress={item.onPress}
        maxIndex={cellItem.length - 1}
      />
    );
  }, []);

  return (
    <FlatList
      // Remove the refreshControl prop
      ListHeaderComponent={() => (
        <FlatList
          data={headerData}
          renderItem={renderHeaderItem}
          style={{
            justifyContent: 'space-around',
            flexDirection: 'row',
            marginBottom: theme.spacing.xxl,
          }}
          keyExtractor={(item) => item.title}
        />
      )}
      style={{
        flex: 1,
        backgroundColor: theme.colors.secondaryBG,
        paddingHorizontal: theme.spacing.l,
        paddingTop: theme.spacing.xl,
      }}
      data={cellItem}
      keyExtractor={(item) => item.title}
      renderItem={renderCellItem}
    />
  );
};

export default Account;
