import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useCallback, useLayoutEffect } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet } from 'react-native';

import { Cell } from '@/components/cells';
import Button from '@/components/core/Button';
import { Text } from '@/components/core/Text';
import { useGetUserDetails } from '@/hooks/useGetUser';
import theme from '@/theme/theme';

interface IAccountProps {
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
}

const Account = ({ navigation, route }: IAccountProps) => {
  dayjs.extend(customParseFormat);
  dayjs.extend(relativeTime);
  dayjs.extend(advancedFormat);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: route.params?.person_view.person.name ?? 'Account',
      headerLeft: () => (
        <Button>
          <Text color="blue" fontSize={17} allowFontScaling={false}>
            Accounts
          </Text>
        </Button>
      ),
    });
  });

  const { data, isLoading } = useGetUserDetails(
    route.params?.person_view.person.name
  );

  const currentDate = dayjs();

  const daysSinceAccountCreation = currentDate.diff(
    dayjs(data?.person_view.person.published),
    'day'
  );
  const formattedResult = `${daysSinceAccountCreation}d`;

  if (!route.params?.person_view) {
    return (
      <Text variant="default" textAlign="center" paddingVertical="l">
        You're not logged in
      </Text>
    );
  }

  if (isLoading) {
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
  interface ICellItem {
    title: string;
    icon:
      | 'ios-albums-outline'
      | 'ios-chatbubbles-outline'
      | 'ios-chatbubble-outline'
      | 'ios-bookmark-outline';
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
      icon: 'ios-albums-outline',
      onPress: () => navigation.navigate('Posts', { title: 'Posts' }),
    },
    {
      title: 'Comments',
      icon: 'ios-chatbubble-outline',
      onPress: () => navigation.navigate('Comments', { title: 'Comments' }),
    },
    {
      title: 'Saved (not implemented)',
      icon: 'ios-bookmark-outline',
      // onPress: () => navigation.navigate('Saved', { title: 'Saved' }),
    },
  ];

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

  return (
    <FlatList
      ListHeaderComponent={() => (
        <FlatList
          data={headerData}
          renderItem={renderHeaderItem}
          style={styles.header}
          keyExtractor={(item) => item.title}
        />
      )}
      style={styles.container}
      data={cellItem}
      keyExtractor={(item) => item.title}
      renderItem={({ item, index }) => (
        <Cell
          index={index}
          title={item.title}
          icon={item.icon}
          onPress={item.onPress}
          maxIndex={cellItem.length - 1}
        />
      )}
    />
  );
};

export default Account;

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

/*

<Box
      flex={1}
      backgroundColor="secondaryBG"
      paddingHorizontal="l"
      paddingTop="xl"
    >
      <Box justifyContent="space-around" flexDirection="row">
        <Box justifyContent="center" alignItems="center" flexDirection="column">
          <Text fontWeight="500" fontSize={23} mb="s">
            {data?.person_view.counts.comment_score}
          </Text>
          <Text color="gray" fontWeight="500">
            Comment score
          </Text>
        </Box>
        <Box justifyContent="center" alignItems="center" flexDirection="column">
          <Text fontWeight="500" fontSize={23} mb="s">
            {data?.person_view.counts.post_score}
          </Text>
          <Text color="gray" fontWeight="500">
            Post score
          </Text>
        </Box>
        <Box justifyContent="center" alignItems="center" flexDirection="column">
          <Text fontWeight="500" fontSize={23} mb="s">
            {formattedResult}
          </Text>
          <Text color="gray" fontWeight="500">
            Account age
          </Text>
        </Box>
      </Box>
    </Box>
*/
