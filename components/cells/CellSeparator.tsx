import { useAppearanceStore } from '@/stores/AppearanceStore';

import { Box } from '../core/Box';
import { Text } from '../core/Text';

interface ICellSeparatorProps {
  letter: string;
}

const CellSeparator = ({ letter }: ICellSeparatorProps) => {
  const { systemFont } = useAppearanceStore((state) => state.settings);
  return (
    <Box paddingVertical="xs" paddingHorizontal="l" backgroundColor="ligthGray">
      <Text
        fontWeight="500"
        fontSize={15}
        color="subtitle"
        allowFontScaling={systemFont}
      >
        {letter}
      </Text>
    </Box>
  );
};

export { CellSeparator };
