export interface IHeaderData {
  title: string;
  value: string | number | undefined;
  onPress?: () => void;
}

export interface IRenderItemsProps {
  item: IHeaderData;
}

export interface IRenderCellProps {
  item: ICellItem;
  index: number;
}
export interface ICellItem {
  title: string;
  icon:
    | 'ios-albums-outline'
    | 'ios-chatbubbles-outline'
    | 'ios-chatbubble-outline'
    | 'ios-bookmark-outline';
  onPress?: () => void;
}
