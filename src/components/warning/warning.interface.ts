export interface IWarning {
  message: string;
  action?: string;
  onActionClick?: () => void;
}
