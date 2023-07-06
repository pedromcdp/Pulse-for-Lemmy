/* eslint-disable no-restricted-syntax */
import { Ionicons } from '@expo/vector-icons';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import React, { useLayoutEffect } from 'react';
import {
  ActionSheetIOS,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Box } from '@/components/core/Box';
import Button from '@/components/core/Button';
import { Text } from '@/components/core/Text';
import { palette } from '@/constants/colors';
import theme from '@/theme/theme';

interface IHomeProps {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<any>;
}

const Home = ({ navigation, route }: IHomeProps) => {
  const [showSearchHeader, setShowSearchHeader] = React.useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params?.title ?? 'Home',
      headerTitle: ({ children }) =>
        showSearchHeader ? (
          <TextInput
            autoFocus
            placeholder="Comunity..."
            allowFontScaling={false}
            keyboardType="ascii-capable"
            placeholderTextColor={theme.colors.gray}
            style={{
              fontSize: 17,
              marginBottom: theme.spacing.xxxxs,
            }}
          />
        ) : (
          <Button
            flexDirection="row"
            ml="xs"
            onPress={() => setShowSearchHeader(true)}
          >
            <Text
              mb="xxxxs"
              fontWeight="600"
              fontSize={17}
              allowFontScaling={false}
            >
              {children}
            </Text>
            <Ionicons
              name="ios-chevron-down-sharp"
              size={17}
              color="black"
              style={{ marginTop: 2 }}
            />
          </Button>
        ),
      headerShadowVisible: false,
      headerTransparent: false,
      headerTitleAlign: 'center',
      headerBackTitle: route.name === 'Home' ? 'Communities' : undefined,
      headerRight: () =>
        showSearchHeader ? (
          <Button
            flexDirection="row"
            ml="xs"
            onPress={() => setShowSearchHeader(false)}
            // ml="xs"
            // backgroundColor="red"
          >
            <Text fontSize={17} allowFontScaling={false} color="blue">
              Cancel
            </Text>
          </Button>
        ) : (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              onPressIn={() =>
                ActionSheetIOS.showActionSheetWithOptions(
                  {
                    options: [
                      'Cancel',
                      'Active',
                      'Hot',
                      'New',
                      'Old',
                      'Top',
                      'Most Comments',
                      'New Comments',
                    ],
                    cancelButtonIndex: 0,
                    message: 'Sort by...',
                  },
                  (buttonIndex) => {
                    if (buttonIndex === 1) {
                      //
                    }
                  }
                )
              }
            >
              <Ionicons
                name="ios-flame-outline"
                size={25}
                color={palette.blue}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons
                name="ios-ellipsis-horizontal-outline"
                size={25}
                color={palette.blue}
              />
            </TouchableOpacity>
          </View>
        ),
      headerSearchBarOptions: {
        placeholder: 'Search',
      },
    });
  }, [navigation, showSearchHeader]);

  return (
    <Box
      flex={1}
      backgroundColor="secondaryBG"
      alignItems="center"
      justifyContent="center"
      onStartShouldSetResponder={() => {
        setShowSearchHeader(false);
        return false;
      }}
      // onStartShouldSetResponder={() => {
      //   setShowSearchHeader(false);
      // }}
    >
      <ActivityIndicator />
    </Box>
  );
};

export default Home;

/* <Ionicons
             name="ios-chevron-down-sharp"
          size={17}
             color="black"
             style={{ marginTop: 2 }}
           />  */
