import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@shopify/restyle';
import type { CommunityView, ListingType } from 'lemmy-js-client';
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
} from 'react-native';

import { CellSeparator, CommunityCell } from '@/components/cells';
import { Box } from '@/components/core/Box';
import { palette } from '@/constants/colors';
import { SortAndOrderAlphabetically } from '@/helpers/Sort&OrderAlphabetically';
import type { IAlphabeticlyOrderedCommunities } from '@/hooks/useGetComunites';
import { useSubcribedComunitesList } from '@/hooks/useGetComunites';
import Storage from '@/services/Storage';
import { useAccountsStore } from '@/stores/AccountsStore';
// import { useAppearanceStore } from '@/stores/AppearanceStore';
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
  const theme = useTheme<Theme>();
  const { activeAccount } = useAccountsStore();
  const { data, refetch } = useSubcribedComunitesList(activeAccount?.jwt);
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
    navigation.push('Home');
  }, []);

  useEffect(() => {
    Storage.get('newUserCommunities').then((res) => {
      if (res) {
        setAlphabeticallySorted(res);
      }
    });
  }, []);

  const CommunitiesFeed: {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    iconBgColor: keyof Theme['colors'];
    listType: ListingType;
  }[] = [
    {
      title: 'Home',
      subtitle: 'Posts from subscriptions',
      icon: <Ionicons name="home" size={22} color={palette.white} />,
      iconBgColor: 'red',
      listType: 'Subscribed',
    },
    {
      title: 'All',
      subtitle: 'Posts from all federated communities',
      icon: <Ionicons name="library" size={22} color={palette.white} />,
      iconBgColor: 'blue',
      listType: 'All',
    },
    {
      title: 'Local',
      subtitle: 'Posts from communities in your instance',
      icon: <Ionicons name="people" size={22} color={palette.white} />,
      iconBgColor: 'green',
      listType: 'Local',
    },
  ];

  useEffect(() => {
    if (data) {
      if (data.length > 0) {
        const sorted = SortAndOrderAlphabetically(data);
        Storage.set('newUserCommunities', sorted);
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

  interface IRenderHeaderItemsProps {
    item: {
      title: string;
      subtitle: string;
      icon: React.ReactNode;
      iconBgColor: keyof Theme['colors'];
      listType: ListingType;
    };
    index: number;
  }

  const handleRenderHeaderItem = useCallback(
    ({ item, index }: IRenderHeaderItemsProps) => {
      return (
        <CommunityCell
          key={index}
          index={index}
          maxIndex={2}
          icon={item.icon}
          iconBgColor={item.iconBgColor}
          title={item.title}
          subtitle={item.subtitle}
          listType={item.listType}
        />
      );
    },
    []
  );

  const handleRenderItem = useCallback(({ item }: IRenderItemsProps) => {
    return (
      <CommunityCell
        title={item.community.title}
        subtitle={`${item.community.name} · ${
          item.community.actor_id.split('//')[1]?.split('/')[0]
        } `}
        image={item.community.icon}
        community={item.community}
        isCommunity
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
      style={{
        backgroundColor: theme.colors.secondaryBG,
      }}
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={handleRefresh} />
      }
      ListHeaderComponent={() => (
        <FlatList
          data={CommunitiesFeed}
          keyExtractor={(item) => item.title}
          initialNumToRender={3}
          ListEmptyComponent={() => <ActivityIndicator />}
          renderItem={handleRenderHeaderItem}
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
