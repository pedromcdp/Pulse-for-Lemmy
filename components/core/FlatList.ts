import { createBox } from '@shopify/restyle';
import { FlatList as RNFlatList } from 'react-native/';

import type { Theme } from '@/theme/theme';

const FlatList = createBox<Theme, React.ComponentProps<typeof RNFlatList>>(
  RNFlatList
);

export { FlatList };
