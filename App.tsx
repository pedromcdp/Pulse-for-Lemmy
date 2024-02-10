import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@shopify/restyle';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

import { Box } from './components/core/Box';
import TabRoutes from './navigation/TabController';
import { connect } from './services/LemmyService';
import { useAccountsStore } from './stores/AccountsStore';
import { useAppearanceStore } from './stores/AppearanceStore';
import darkTheme from './theme/DarkTheme';
import theme from './theme/theme';

SplashScreen.preventAutoHideAsync();

export default function App() {
  dayjs.extend(customParseFormat);
  dayjs.extend(relativeTime);
  dayjs.extend(advancedFormat);
  const systemColoScheme = useColorScheme();
  const { settings } = useAppearanceStore((state) => state);
  const { setActiveAccount, addAccount } = useAccountsStore();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
          },
        },
      })
  );

  const [loaded, error] = useFonts({
    ...Ionicons.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  interface Response {
    instance: string;
    username: string;
    jwt: string;
  }

  useEffect(() => {
    connect()
      .then((rees) => {
        const res = rees as Response;
        setActiveAccount(res);
        addAccount(res);
      })
      .catch((err) => {
        console.log('Error connecting to Lemmy', err);
      });
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (loaded) {
      await SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const whatTheme = settings.systemColorMode ? systemColoScheme : 'light';

  return (
    <Box flex={1} onLayout={onLayoutRootView}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={whatTheme === 'dark' ? darkTheme : theme}>
          <NavigationContainer>
            <TabRoutes />
          </NavigationContainer>
        </ThemeProvider>
      </QueryClientProvider>
    </Box>
  );
}
