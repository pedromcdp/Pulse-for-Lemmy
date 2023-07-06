import { Box } from '../core/Box';
import { Text } from '../core/Text';

interface ICellSeparatorProps {
  letter: string;
}

const CellSeparator = ({ letter }: ICellSeparatorProps) => {
  return (
    <Box paddingVertical="xs" paddingHorizontal="l" backgroundColor="ligthGray">
      <Text fontWeight="500" fontSize={15} color="gray">
        {letter}
      </Text>
    </Box>
  );
};

export { CellSeparator };
