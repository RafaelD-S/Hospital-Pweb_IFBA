import type ModalTitle from "../views/Modal-Title";

export type ModalProps = {
  children: React.ReactNode;
  isOpen?: boolean;
  onClickOutside?: () => void;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
};

export type ModalComposition = React.FC<ModalProps> & {
  Title: typeof ModalTitle;
};
