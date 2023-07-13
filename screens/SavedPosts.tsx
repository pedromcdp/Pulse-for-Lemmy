import { ActivityIndicator } from 'react-native';

import { Box } from '@/components/core/Box';
import { Text } from '@/components/core/Text';
import { useGetUserSavedPosts } from '@/hooks/useGetUser';
import { useAccountsStore } from '@/stores/AccountsStore';

const SavedPosts = () => {
  const activeAccount = useAccountsStore((state) => state.activeAccount);

  const { data } = useGetUserSavedPosts(activeAccount?.jwt);

  if (!activeAccount) {
    return (
      <Text variant="default" textAlign="center" paddingVertical="l">
        You're not logged in
      </Text>
    );
  }

  if (data?.posts.length === 0) {
    return (
      <Box flex={1} backgroundColor="secondaryBG" justifyContent="center">
        <ActivityIndicator />
      </Box>
    );
  }

  return (
    <Box>
      <Text>SavedPosts</Text>
    </Box>
  );
};

export default SavedPosts;
