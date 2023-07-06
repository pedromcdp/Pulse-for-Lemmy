import type { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { useLayoutEffect } from 'react';

import { Box } from '@/components/core/Box';
import { Text } from '@/components/core/Text';

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
    <Box
      flex={1}
      backgroundColor="secondaryBG"
      paddingHorizontal="l"
      paddingTop="l"
    >
      <Text fontSize={17} paddingBottom="xxs" allowFontScaling={false}>
        Use System Light/Dark Mode
      </Text>
    </Box>
  );
};

export default Inbox;
