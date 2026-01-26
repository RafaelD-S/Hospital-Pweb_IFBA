export interface ITab {
  items: ITabItem[];
  onClick?: (item: ITabItem) => void;
}

export interface ITabItem {
  label: string;
  value: string;
  active?: boolean;
}
