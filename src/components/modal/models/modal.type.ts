import type ModalButton from "../views/Modal-Button";
import type ModalTitle from "../views/Modal-Title";

export type ModalProps = {
  children: React.ReactNode;
  isOpen?: boolean;
  onClickOutside?: () => void;
};

export type ModalComposition = React.FC<ModalProps> & {
  Title: typeof ModalTitle;
  Button: typeof ModalButton;
};
