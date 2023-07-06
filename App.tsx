import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@shopify/restyle';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';

import TabRoutes from './navigation/TabController';
import { connect } from './services/LemmyService';
import theme from './theme/theme';

export default function App() {
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

  useEffect(() => {
    connect()
      .then(() => {
        console.log('Connected to Lemmy');
      })
      .catch((err) => {
        console.log('Error connecting to Lemmy', err);
      });
  }, []);

  if (!loaded) {
    return null;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <StatusBar style={theme.statusBar.barStyle} />
          <TabRoutes />
        </NavigationContainer>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
