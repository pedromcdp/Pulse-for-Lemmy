import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@shopify/restyle';
import { StatusBar } from 'expo-status-bar';
import type { GetPersonDetailsResponse } from 'lemmy-js-client';
import { Fragment, useEffect, useState } from 'react';

import { Box } from '@/components/core/Box';
import { useGetUserDetails } from '@/hooks/useGetUser';
import Account from '@/screens/Account';
import Appearance from '@/screens/Appearance';
import CommunitiesList from '@/screens/CommunitiesList';
import Community from '@/screens/Community';
import Home from '@/screens/Home';
import Inbox from '@/screens/Inbox';
import Search from '@/screens/Search';
import Settings from '@/screens/Settings';
import Storage from '@/services/Storage';
import { useAppearanceStore } from '@/stores/AppearanceStore';
import type { Theme } from '@/theme/theme';

const TabCobtroller = createBottomTabNavigator();
const FeedStack = createNativeStackNavigator();
const InboxStack = createNativeStackNavigator();
const AccountStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();

const TabRoutes = () => {
  const { data: userData } = useGetUserDetails('pmcdp');
  const [user, setUser] = useState<GetPersonDetailsResponse | null>(null);
  const { setSettings } = useAppearanceStore((state) => state);
  const theme = useTheme<Theme>();

  useEffect(() => {
    if (userData) {
      Storage.set('user', JSON.stringify(userData));
      setUser(userData);
    }
  }, [userData]);

  useEffect(() => {
    const getUser = async () => {
      const storedUser = await Storage.get('user').then((res) =>
        JSON.parse(res)
      );
      if (storedUser) {
        setUser(storedUser);
      }
    };
    getUser();
  }, []);

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
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="ios-home" size={size} color={color} />
            ),
          }}
        >
          {() => (
            <Box
              flex={1}
              backgroundColor="primaryBG"
              position="absolute"
              width={'100%'}
              height={'100%'}
              opacity={1}
            >
              <FeedStack.Navigator>
                <FeedStack.Group
                  screenOptions={{
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
                  <FeedStack.Screen name="Community" component={Community} />
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
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="ios-mail" size={size} color={color} />
            ),
            // tabBarBadge: 18,
            // freezeOnBlur: true,
          }}
        >
          {() => (
            <InboxStack.Navigator>
              <InboxStack.Screen name="Inbox" component={Inbox} />
            </InboxStack.Navigator>
          )}
        </TabCobtroller.Screen>
        <TabCobtroller.Screen
          name="AccountTab"
          options={{
            headerShown: false,
            tabBarLabel: user ? user.person_view.person.name : 'Account',
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="ios-person-circle-outline"
                size={size}
                color={color}
              />
            ),
          }}
        >
          {() => (
            <AccountStack.Navigator>
              <AccountStack.Screen
                name="Account"
                component={Account}
                initialParams={userData}
                options={{
                  title: user ? user.person_view.person.name : 'Account',
                }}
              />
              {/* Change for correct Screens */}
              <AccountStack.Screen name="Comments" component={Home} />
              <AccountStack.Screen name="Posts" component={Home} />
            </AccountStack.Navigator>
          )}
        </TabCobtroller.Screen>
        <TabCobtroller.Screen
          name="SearchTab"
          options={{
            headerShown: false,
            tabBarLabel: 'Search',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="ios-search" size={size} color={color} />
            ),
          }}
        >
          {() => (
            <SearchStack.Navigator initialRouteName="Search">
              <SearchStack.Group>
                <SearchStack.Screen name="Search" component={Search} />
                <SearchStack.Screen name="Community" component={Community} />
              </SearchStack.Group>
            </SearchStack.Navigator>
          )}
        </TabCobtroller.Screen>
        <TabCobtroller.Screen
          name="SettingsTab"
          options={{
            headerShown: false,
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="ios-cog" size={size} color={color} />
            ),
          }}
        >
          {() => (
            <SettingsStack.Navigator>
              <SettingsStack.Screen name="Settings" component={Settings} />
              <SettingsStack.Screen name="Appearance" component={Appearance} />
            </SettingsStack.Navigator>
          )}
        </TabCobtroller.Screen>
      </TabCobtroller.Navigator>
    </Fragment>
  );
};

export default TabRoutes;
