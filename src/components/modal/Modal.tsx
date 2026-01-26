import { Children, isValidElement } from "react";
import ModalTitle from "./views/Modal-Title";
import ModalButton from "./views/Modal-Button";
import "./modal.styles.scss";
import Input from "../input/Input";
import Select from "../select/select";
import type { ModalComposition } from "./models/modal.type";

export const Modal: ModalComposition = ({
  children,
  isOpen = true,
  onClickOutside = () => {},
}) => {
  const childrenArray = Children.toArray(children);

  const Title = childrenArray.find(
    (child) => isValidElement(child) && child.type === ModalTitle,
  );

  const Button = childrenArray.find(
    (child) => isValidElement(child) && child.type === ModalButton,
  );

  const Inputs = childrenArray.filter(
    (child) => isValidElement(child) && child.type === Input,
  );

  const Selects = childrenArray.filter(
    (child) => isValidElement(child) && child.type === Select,
  );

  if (!isOpen) return null;
  return (
    <div className="modal" onClick={onClickOutside}>
      <form className="modal__container" onClick={(e) => e.stopPropagation()}>
        <div className="modal__title">{Title}</div>
        <div className="modal__inputs">
          {Inputs} {Selects}
        </div>
        {Button}
      </form>
    </div>
  );
};

Modal.Title = ModalTitle;
Modal.Button = ModalButton;

export default Modal;
