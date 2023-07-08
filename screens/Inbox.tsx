import type { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { useLayoutEffect } from 'react';

import { Box } from '@/components/core/Box';
import { Text } from '@/components/core/Text';
import { useAppearanceStore } from '@/stores/AppearanceStore';

interface IInboxProps {
  navigation: NativeStackNavigationProp<any>;
}

const Inbox = ({ navigation }: IInboxProps) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Boxes',
    });
  }, [navigation]);
  const { systemFont } = useAppearanceStore((state) => state.settings);

  return (
    <Box
      flex={1}
      backgroundColor="secondaryBG"
      paddingHorizontal="l"
      paddingTop="l"
    >
      <Text fontSize={17} allowFontScaling={systemFont}>
        Home
      </Text>
    </Box>
  );
};

export default Inbox;
