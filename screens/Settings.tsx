import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLayoutEffect } from 'react';

import { Cell } from '@/components/cells';
import { ScrollView } from '@/components/core/ScrollView';

interface ISettingsProps {
  navigation: NativeStackNavigationProp<any, any>;
}

const Settings = ({ navigation }: ISettingsProps) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Settings',
    });
  }, [navigation]);

  return (
    <ScrollView
      flex={1}
      backgroundColor="secondaryBG"
      paddingHorizontal="l"
      paddingTop="xl"
    >
      <Cell title="General" icon="cog" index={0} maxIndex={4} />
      <Cell
        title="Appearance"
        icon="color-fill"
        index={1}
        maxIndex={4}
        onPress={() => navigation.push('Appearance')}
      />
      <Cell
        title="Face ID & Passcode"
        icon="finger-print"
        index={3}
        maxIndex={4}
      />
      <Cell
        title="About"
        icon="at-sharp"
        index={4}
        maxIndex={4}
        onPress={() => navigation.push('About')}
      />
    </ScrollView>
  );
};

export default Settings;
