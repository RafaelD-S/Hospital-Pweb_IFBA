export interface ISelectOption {
  label: string;
  value: string;
  selected?: boolean;
}

export interface ISelect {
  label: string;
  options: ISelectOption[];
  value?: string | null;
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}
