import { nativeApplicationVersion } from 'expo-application';
import React from 'react';

import { Cell } from '@/components/cells';
import { ScrollView } from '@/components/core/ScrollView';
import { Text } from '@/components/core/Text';

export default function About() {
  return (
    <ScrollView flex={1} backgroundColor="secondaryBG" px="l" pt="l">
      <Cell
        title="Version"
        index={0}
        maxIndex={0}
        customRight={
          <Text variant="default" color="subtitle">
            {nativeApplicationVersion}
          </Text>
        }
      />
    </ScrollView>
  );
}
