import { Ionicons } from '@expo/vector-icons';
import type { ParamListBase } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CommunityView } from 'lemmy-js-client';

import theme from '@/theme/theme';

import { Box } from '../core/Box';
import Button from '../core/Button';
import { Text } from '../core/Text';

interface ICellProps {
  community: CommunityView;
  index: number;
}

const DefaultCell = ({ community, index }: ICellProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    <Button
      flexDirection="row"
      width="100%"
      paddingLeft="l"
      alignItems="center"
      backgroundColor="white"
      borderTopStartRadius={index === 0 ? 'm' : undefined}
      borderTopEndRadius={index === 0 ? 'm' : undefined}
      borderBottomEndRadius={index + 1 === 5 ? 'm' : undefined}
      borderBottomStartRadius={index + 1 === 5 ? 'm' : undefined}
      onPress={() => {
        navigation.navigate('Community', {
          title: community.community.title,
        });
      }}
    >
      <Ionicons name="trending-up" size={23} color={theme.colors.blue} />
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingVertical="s"
        flexGrow={1}
        paddingRight="l"
        paddingLeft="m"
        borderBottomWidth={1}
        borderBottomColor="divider"
      >
        <Box>
          <Text fontSize={20} paddingBottom="xxs">
            {community.community.name}
          </Text>
          <Text fontSize={15} color="gray">
            {community.community.actor_id.split('//')[1]?.split('/')[0]}
          </Text>
        </Box>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.gray} />
      </Box>
    </Button>
  );
};

export { DefaultCell };
