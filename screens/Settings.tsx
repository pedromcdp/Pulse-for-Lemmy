import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Cell } from '@/components/cells';
import { ScrollView } from '@/components/core/ScrollView';

interface ISettingsProps {
  navigation: NativeStackNavigationProp<any, any>;
}

const Settings = ({ navigation }: ISettingsProps) => {
  return (
    <ScrollView
      flex={1}
      backgroundColor="secondaryBG"
      paddingHorizontal="l"
      paddingTop="xl"
    >
      <Cell title="General" icon="ios-cog" index={0} maxIndex={4} />
      <Cell
        title="Appearance"
        icon="ios-color-fill"
        index={1}
        maxIndex={4}
        onPress={() => navigation.navigate('Appearance')}
      />
      <Cell
        title="Face ID & Passcode"
        icon="ios-finger-print"
        index={3}
        maxIndex={4}
      />
      <Cell title="About" icon="ios-at-sharp" index={4} maxIndex={4} />
    </ScrollView>
  );
};

export default Settings;
