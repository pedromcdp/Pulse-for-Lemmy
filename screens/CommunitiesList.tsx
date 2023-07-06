import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CommunityView } from 'lemmy-js-client';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SectionList,
  StyleSheet,
} from 'react-native';

import { CellSeparator, CommunityCell } from '@/components/cells';
import { Box } from '@/components/core/Box';
import { palette } from '@/constants/colors';
import { SortAndOrderAlphabetically } from '@/helpers/Sort&OrderAlphabetically';
import type { IAlphabeticlyOrderedCommunities } from '@/hooks/useGetComunites';
import { useSubcribedComunitesList } from '@/hooks/useGetComunites';
import { lemmyAuthToken } from '@/services/LemmyService';
import { get, set } from '@/services/Storage';
import type { Theme } from '@/theme/theme';

interface ICommunitiesProps {
  navigation: NativeStackNavigationProp<any>;
}

interface IRenderItemsProps {
  item: CommunityView;
}

interface ISectionListProps {
  section: { letter: string };
}

const CommunitiesList = ({ navigation }: ICommunitiesProps) => {
  const { data, refetch } = useSubcribedComunitesList();
  const [alphabeticallySorted, setAlphabeticallySorted] = useState<
    IAlphabeticlyOrderedCommunities[] | undefined
  >();
  const [isFetching, setIsFetching] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Communities',
      headerShadowVisible: true,
    });
  }, [navigation]);

  useEffect(() => {
    navigation.navigate('Home');
  }, []);

  useEffect(() => {
    get('userCommunities').then((res) => {
      if (res) {
        const retrievedData = JSON.parse(res);
        setAlphabeticallySorted(retrievedData);
      }
    });
  }, []);

  const CommunitiesFeed: {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    iconBgColor: keyof Theme['colors'];
  }[] = [
    {
      title: 'Home',
      subtitle: 'Posts from subscriptions',
      icon: <Ionicons name="ios-home" size={22} color={palette.white} />,
      iconBgColor: 'red',
    },
    {
      title: 'All',
      subtitle: 'Posts from all federated communities',
      icon: <Ionicons name="ios-library" size={22} color={palette.white} />,
      iconBgColor: 'blue',
    },
    {
      title: 'Local',
      subtitle: 'Posts from communities in your instance',
      icon: <Ionicons name="ios-people" size={22} color={palette.white} />,
      iconBgColor: 'green',
    },
  ];

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [lemmyAuthToken])
  );

  useEffect(() => {
    if (data) {
      if (data.length > 0) {
        const sorted = SortAndOrderAlphabetically(data);
        set('userCommunities', JSON.stringify(sorted));
        setAlphabeticallySorted(sorted);
      }
    }
  }, [data]);

  const handleRefresh = useCallback(() => {
    setIsFetching(true);
    refetch().then(() => {
      setIsFetching(false);
    });
  }, [refetch]);

  const handleRenderItem = useCallback(({ item }: IRenderItemsProps) => {
    return (
      <CommunityCell
        title={item.community.title}
        subtitle={`${item.community.name} · ${
          item.community.actor_id.split('//')[1]?.split('/')[0]
        } `}
        image={item.community.icon}
      />
    );
  }, []);

  const handleRenderSectionHeader = useCallback(
    ({ section: { letter } }: ISectionListProps) => {
      return <CellSeparator letter={letter} />;
    },
    []
  );

  return (
    <SectionList
      style={style.container}
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={handleRefresh} />
      }
      ListHeaderComponent={() => (
        <FlatList
          data={CommunitiesFeed}
          keyExtractor={(item) => item.title}
          // ItemSeparatorComponent={() => (
          //   <Box height={1} backgroundColor="ligthGray" marginLeft="xxl" />
          // )}
          ListEmptyComponent={() => <ActivityIndicator />}
          renderItem={({ item, index }) => (
            <CommunityCell
              key={index}
              index={index}
              maxIndex={2}
              icon={item.icon}
              iconBgColor={item.iconBgColor}
              title={item.title}
              subtitle={item.subtitle}
            />
          )}
        />
      )}
      sections={alphabeticallySorted ?? []}
      ListEmptyComponent={() => (
        <ActivityIndicator style={{ paddingTop: 10 }} />
      )}
      ItemSeparatorComponent={() => (
        <Box height={1} backgroundColor="ligthGray" marginLeft="l" />
      )}
      keyExtractor={(item) => item.community.id.toString()}
      renderItem={handleRenderItem}
      renderSectionHeader={handleRenderSectionHeader}
    />
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
});

export default CommunitiesList;

/*

 <FlatList
      refreshing={false}
      onRefresh={() => fetchCommunities()}
      ListHeaderComponent={() => (
        <FlatList
          data={CommunitiesFeed}
          initialNumToRender={3}
          ListEmptyComponent={() => <ActivityIndicator />}
          renderItem={({ item, index }) => (
            <CommunityCell
              key={index}
              icon={item.icon}
              iconBgColor={item.iconBgColor}
              title={item.title}
              subtitle={item.subtitle}
            />
          )}
        />
      )}
      style={style.container}
      data={lemmyData}
      initialNumToRender={2}
      renderItem={({ item }) => (
        <CommunityCell
          title={item.community.title}
          subtitle={`${item.community.name} · ${
            item.community.actor_id.split('//')[1]?.split('/')[0]
          } `}
          image={item.community.icon}
        />
      )}
      keyExtractor={(item) => item.community.id.toString()}
    /> */

// const alphabeticalCommunities = res.communities.sort((a, b) => {
//   return a.community.name.localeCompare(b.community.name);
// });
// setLemmyData(alphabeticalCommunities);

// useEffect(() => {
//   if (data) {
//     const sorted = SortAndOrderAlphabetically(data);
//     setAlphabeticallySorted(sorted);
//   }
// }, [data]);

// const fetchCommunities = async () => {
//   if (!lemmyAuthToken) {
//     return;
//   }
//   await LemmyClient.listCommunities({
//     auth: lemmyAuthToken,
//     type_: 'Subscribed',
//     limit: 10,
//   })
//     .then((res) => {
//       const sorted = SortAndOrderAlphabetically(res.communities);
//       setAlphabeticallySorted(sorted);
//     })
//     .catch((e) => {
//       Alert.alert('Error', e.message);
//     });
// };
