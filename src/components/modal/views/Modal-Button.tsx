import type { IModalButton } from "../models/modal.interface";

const ModalButton = ({ children, ...rest }: IModalButton) => {
  return (
    <button className="modal__button" {...rest}>
      {children}
    </button>
  );
};

export default ModalButton;
