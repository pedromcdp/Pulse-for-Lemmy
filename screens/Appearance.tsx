import React from 'react';
import { Switch } from 'react-native';

import { Cell } from '@/components/cells';
import { ScrollView } from '@/components/core/ScrollView';
import { Text } from '@/components/core/Text';
import { useAppearanceStore } from '@/stores/AppearanceStore';

const Appearance = () => {
  const { settings, setSettings } = useAppearanceStore((state) => state);
  // const [value, setValue] = useState(0); // State to store the current value of the slider

  // marks = [0, 25, 50, 75, 100];

  // const renderMark = (mark) => (
  //   <View
  //     key={mark - 20}
  //     style={{
  //       position: 'absolute',
  //       left: `${mark}%`,
  //       height: '30%',
  //       top: '60%',
  //       width: 1.1,
  //       backgroundColor: theme.colors.gray,
  //       zIndex: 0,
  //       marginLeft: 16,
  //     }}
  //   />
  // );
  return (
    <ScrollView
      flex={1}
      backgroundColor="secondaryBG"
      paddingTop="xl"
      paddingHorizontal="l"
    >
      <Text
        pb="xs"
        textTransform="uppercase"
        color="gray"
        paddingLeft="l"
        variant="caption"
        allowFontScaling={settings.systemFont}
      >
        System
      </Text>
      <Cell
        title="Use System Light/Dark Mode"
        index={0}
        maxIndex={0}
        smallPadding
        customRight={
          <Switch
            value={settings.systemColorMode}
            onValueChange={(value) =>
              setSettings({ ...settings, systemColorMode: value })
            }
          />
        }
      />

      <Text
        pt="l"
        pb="xs"
        textTransform="uppercase"
        color="gray"
        paddingLeft="l"
        variant="caption"
        allowFontScaling={settings.systemFont}
      >
        Text Size
      </Text>
      <Cell
        title="Use System Text Size"
        index={0}
        maxIndex={0}
        smallPadding
        customRight={
          <Switch
            value={settings.systemFont}
            onValueChange={(value) =>
              setSettings({ ...settings, systemFont: value })
            }
          />
        }
      />

      <Text
        pt="l"
        pb="xs"
        textTransform="uppercase"
        color="gray"
        paddingLeft="l"
        variant="caption"
        allowFontScaling={settings.systemFont}
      >
        Communities list
      </Text>
      <Cell
        title="Show Community Icons"
        index={0}
        maxIndex={0}
        smallPadding
        customRight={
          <Switch
            value={settings.showIcons}
            onValueChange={(value) =>
              setSettings({ ...settings, showIcons: value })
            }
          />
        }
      />
      {/* <Box
        backgroundColor="white"
        paddingVertical="s"
        borderBottomEndRadius="m"
        borderBottomStartRadius="m"
        paddingHorizontal="xl"
        width={'100%'}
        position="relative"
      >
        <Slider
          style={{ zIndex: 1 }}
          value={value}
          onValueChange={(newValue) => setValue(newValue)}
          step={25} // Step value for each change in the slider
          minimumValue={0}
          maximumValue={100}
          thumbTintColor={theme.colors.white} // Customize the color of the thumb
          minimumTrackTintColor="#d3d3d3" // Customize the color of the track before the thumb
          maximumTrackTintColor="#d3d3d3" // Customize the color of the track after the thumb
        />
        {marks.map((mark) => renderMark(mark))}
      </Box> */}
    </ScrollView>
  );
};

export default Appearance;
