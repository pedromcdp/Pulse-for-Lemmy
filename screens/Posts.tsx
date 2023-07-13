import { ActivityIndicator } from 'react-native';

import { Box } from '@/components/core/Box';
import { Text } from '@/components/core/Text';
import { useGetUserDetails } from '@/hooks/useGetUser';
import { useAccountsStore } from '@/stores/AccountsStore';

const Posts = () => {
  const activeAccount = useAccountsStore((state) => state.activeAccount);

  const { data } = useGetUserDetails(
    activeAccount?.jwt,
    activeAccount?.username
  );

  if (!activeAccount) {
    return (
      <Text variant="default" textAlign="center" paddingVertical="l">
        You're not logged in
      </Text>
    );
  }

  if (data?.comments.length === 0) {
    return (
      <Box flex={1} backgroundColor="secondaryBG" justifyContent="center">
        <ActivityIndicator />
      </Box>
    );
  }

  return (
    <Box>
      <Text>Comments</Text>
    </Box>
  );
};

export default Posts;
