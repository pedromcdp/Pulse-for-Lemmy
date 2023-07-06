import type { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { useLayoutEffect } from 'react';
import { Text } from 'react-native';

import { Box } from '@/components/core/Box';

interface IInboxProps {
  navigation: NativeStackNavigationProp<any>;
}

const Inbox = ({ navigation }: IInboxProps) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Boxes',
    });
  }, [navigation]);

  return (
    <Box flex={1} backgroundColor="secondaryBG">
      <Text>Inbox</Text>
    </Box>
  );
};

export default Inbox;
