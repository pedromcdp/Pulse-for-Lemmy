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
    | 'albums-outline'
    | 'chatbubbles-outline'
    | 'chatbubble-outline'
    | 'bookmark-outline';
  onPress?: () => void;
}
