import { Ionicons } from '@expo/vector-icons';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useLayoutEffect } from 'react';
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  View,
} from 'react-native';

import { Box } from '@/components/core/Box';
import { palette } from '@/constants/colors';

interface ICommunityProps {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<any, any>;
}

const Community = ({ navigation, route }: ICommunityProps) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params!.title,
      headerShadowVisible: false,
      headerTransparent: false,
      headerTitleAlign: 'center',
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            onPressIn={() =>
              ActionSheetIOS.showActionSheetWithOptions(
                {
                  options: ['Cancel', 'Best'],
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
              name="ios-trophy-outline"
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
        placeholder: `Search c/${route.params!.title}`,
      },
    });
  }, [navigation]);

  useEffect(() => {
    Alert.alert('Hold on tiger!', 'The feed is not implmented yet.');
  }, []);

  return (
    <Box
      flex={1}
      backgroundColor="secondaryBG"
      alignItems="center"
      justifyContent="center"
    >
      <ActivityIndicator />
    </Box>
  );
};

export default Community;
