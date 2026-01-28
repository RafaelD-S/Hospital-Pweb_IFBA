import type { TListItemType } from "./list.type";

export interface IList {
  items: IListItem[];
  registrationTitle?: string;
  hasEditButton?: boolean;
  onEditClick?: (item: any) => void;
  onRemoveClick?: (item: any) => void;
  onRestoreClick?: (item: any) => void;
  onRegistrationClick?: () => void;
}

export interface IListItem {
  title?: string;
  description?: string;
  disabled?: boolean;
}

export interface IListItemProps extends IListItem {
  type?: TListItemType;
  hasEditButton?: boolean;
  onClick?: () => void;
  onEditClick?: () => void;
  onRemoveClick?: () => void;
  onRestoreClick?: () => void;
}
