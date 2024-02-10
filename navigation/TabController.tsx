import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@shopify/restyle';
import { StatusBar } from 'expo-status-bar';
import { Fragment, useEffect, useState } from 'react';
import { Text } from 'react-native';
import { SFSymbol } from 'react-native-sfsymbols';

import { Box } from '@/components/core/Box';
import { useListComunites } from '@/hooks/useGetComunites';
import { useGetUserDetails, useGetUserUnreadCount } from '@/hooks/useGetUser';
import About from '@/screens/About';
import Account from '@/screens/Account';
import AccountTemp from '@/screens/AccountTemp';
import Appearance from '@/screens/Appearance';
import Comments from '@/screens/Comments';
import CommunitiesList from '@/screens/CommunitiesList';
import CommunityScreen from '@/screens/Community';
import Home from '@/screens/Home';
import Inbox from '@/screens/Inbox';
import Post from '@/screens/Post';
import Posts from '@/screens/Posts';
import SavedPosts from '@/screens/SavedPosts';
import Search from '@/screens/Search';
import Settings from '@/screens/Settings';
import Storage from '@/services/Storage';
import { useAccountsStore } from '@/stores/AccountsStore';
import { useAppearanceStore } from '@/stores/AppearanceStore';
import type { Theme } from '@/theme/theme';

const TabCobtroller = createBottomTabNavigator();
const FeedStack = createNativeStackNavigator();
const InboxStack = createNativeStackNavigator();
const AccountStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();

const TabRoutes = () => {
  const currentAccount = useAccountsStore((state) => state.activeAccount);
  const { data } = useGetUserUnreadCount(currentAccount?.jwt);
  useGetUserDetails(currentAccount?.jwt, currentAccount?.username);
  useListComunites({
    type_: 'All',
    sort: 'TopDay',
    limit: 5,
  });
  const { setSettings } = useAppearanceStore((state) => state);
  const theme = useTheme<Theme>();
  const [unreadCount, setUnreadCount] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (data) {
      setUnreadCount(data.mentions + data.replies + data.private_messages);
    }
  }, [data]);

  useEffect(() => {
    Storage.get('appearance').then((res) => {
      if (res) {
        setSettings(res);
      }
    });
  }, []);

  return (
    <Fragment>
      <StatusBar style={theme.statusBar.barStyle} />
      <TabCobtroller.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: theme.colors.primaryBG },
        }}
      >
        <TabCobtroller.Screen
          name="HomeTab"
          options={{
            headerShown: false,
            title: 'Posts',
            tabBarLabel: ({ children, color }) => (
              <Text style={{ color, fontSize: 11 }} allowFontScaling={false}>
                {children}
              </Text>
            ),
            tabBarIcon: ({ color, size }) => (
              <SFSymbol name="doc.text.image" size={size - 2} color={color} />
            ),
          }}
        >
          {() => (
            <Box
              flex={1}
              backgroundColor="secondaryBG"
              position="absolute"
              width={'100%'}
              height={'100%'}
              opacity={1}
            >
              <FeedStack.Navigator>
                <FeedStack.Group
                  screenOptions={{
                    headerTitleStyle: {
                      color: theme.colors.text,
                    },
                    headerStyle: {
                      backgroundColor: theme.colors.primaryBG,
                    },
                  }}
                >
                  <FeedStack.Screen
                    name="ComunitiesList"
                    component={CommunitiesList}
                  />
                  <FeedStack.Screen name="Home" component={Home} />
                  <FeedStack.Screen
                    name="Community"
                    component={CommunityScreen}
                  />
                  <FeedStack.Screen name="Account" component={AccountTemp} />
                  <FeedStack.Screen name="Post" component={Post} />
                </FeedStack.Group>
              </FeedStack.Navigator>
            </Box>
          )}
        </TabCobtroller.Screen>
        <TabCobtroller.Screen
          name="InboxTab"
          options={{
            headerShown: false,
            title: 'Inbox',
            tabBarLabel: ({ children, color }) => (
              <Text style={{ color, fontSize: 11 }} allowFontScaling={false}>
                {children}
              </Text>
            ),
            tabBarIcon: ({ color, size }) => (
              <SFSymbol name="envelope.fill" size={size - 2} color={color} />
            ),
            tabBarBadge: unreadCount === 0 ? undefined : unreadCount,
            // freezeOnBlur: true,
          }}
        >
          {() => (
            <InboxStack.Navigator
              screenOptions={{
                headerTitleStyle: {
                  color: theme.colors.text,
                },
                headerStyle: {
                  backgroundColor: theme.colors.primaryBG,
                },
              }}
            >
              <InboxStack.Screen name="Inbox" component={Inbox} />
            </InboxStack.Navigator>
          )}
        </TabCobtroller.Screen>
        <TabCobtroller.Screen
          name="AccountTab"
          options={{
            headerShown: false,
            title: currentAccount?.username ?? 'Account',
            tabBarLabel: ({ children, color }) => (
              <Text style={{ color, fontSize: 11 }} allowFontScaling={false}>
                {children}
              </Text>
            ),
            tabBarIcon: ({ color, size }) => (
              <SFSymbol
                name="person.crop.circle"
                size={size - 2}
                weight="light"
                color={color}
              />
            ),
          }}
        >
          {() => (
            <AccountStack.Navigator
              screenOptions={{
                headerTitleStyle: {
                  color: theme.colors.text,
                },
                headerStyle: {
                  backgroundColor: theme.colors.primaryBG,
                },
              }}
            >
              <AccountStack.Screen
                name="Account"
                component={Account}
                options={{
                  title: currentAccount ? currentAccount.username : 'Account',
                }}
              />
              {/* Change for correct Screens */}
              <AccountStack.Screen name="Comments" component={Comments} />
              <AccountStack.Screen name="Posts" component={Posts} />
              <AccountStack.Screen name="SavedPosts" component={SavedPosts} />
            </AccountStack.Navigator>
          )}
        </TabCobtroller.Screen>
        <TabCobtroller.Screen
          name="SearchTab"
          options={{
            headerShown: false,
            title: 'Search',
            tabBarLabel: ({ children, color }) => (
              <Text style={{ color, fontSize: 11 }} allowFontScaling={false}>
                {children}
              </Text>
            ),
            tabBarIcon: ({ color, size }) => (
              <SFSymbol name="magnifyingglass" size={size - 2} color={color} />
            ),
          }}
        >
          {() => (
            <SearchStack.Navigator
              initialRouteName="Search"
              screenOptions={{
                headerTitleStyle: {
                  color: theme.colors.text,
                },
                headerStyle: {
                  backgroundColor: theme.colors.primaryBG,
                },
              }}
            >
              <SearchStack.Group>
                <SearchStack.Screen name="Search" component={Search} />
                <SearchStack.Screen
                  name="Community"
                  component={CommunityScreen}
                />
                <SearchStack.Screen name="Account" component={AccountTemp} />
                <SearchStack.Screen name="Post" component={Post} />
              </SearchStack.Group>
            </SearchStack.Navigator>
          )}
        </TabCobtroller.Screen>
        <TabCobtroller.Screen
          name="SettingsTab"
          options={{
            headerShown: false,
            title: 'Settings',
            tabBarLabel: ({ children, color }) => (
              <Text style={{ color, fontSize: 11 }} allowFontScaling={false}>
                {children}
              </Text>
            ),
            tabBarIcon: ({ color, size }) => (
              <SFSymbol name="gear" size={size - 2} color={color} />
            ),
          }}
        >
          {() => (
            <SettingsStack.Navigator
              screenOptions={{
                headerTitleStyle: {
                  color: theme.colors.text,
                },
                headerStyle: {
                  backgroundColor: theme.colors.primaryBG,
                },
              }}
            >
              <SettingsStack.Screen name="Settings" component={Settings} />
              <SettingsStack.Screen name="Appearance" component={Appearance} />
              <SettingsStack.Screen name="About" component={About} />
            </SettingsStack.Navigator>
          )}
        </TabCobtroller.Screen>
      </TabCobtroller.Navigator>
    </Fragment>
  );
};

export default TabRoutes;
