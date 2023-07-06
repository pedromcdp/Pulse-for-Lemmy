import { createBox } from '@shopify/restyle';
import { ScrollView as RNScrollView } from 'react-native/';

import type { Theme } from '@/theme/theme';

const ScrollView = createBox<Theme, React.ComponentProps<typeof RNScrollView>>(
  RNScrollView
);

export { ScrollView };
