import { Children, isValidElement } from "react";
import ModalTitle from "./views/Modal-Title";
import "./modal.styles.scss";
import Input from "../input/Input";
import Select from "../select/select";
import Button from "../button/Button";
import ModalParagraph from "./views/Modal-Paragraph";

export const Modal = ({
  children,
  isOpen = true,
  onClickOutside = () => {},
  onSubmit,
}) => {
  const childrenArray = Children.toArray(children);

  const Title = childrenArray.find(
    (child) => isValidElement(child) && child.type === ModalTitle,
  );

  const Paragraph = childrenArray.find(
    (child) => isValidElement(child) && child.type === ModalParagraph,
  );

  const ButtonsComponent = childrenArray.filter(
    (child) => isValidElement(child) && child.type === Button,
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
      <form
        className="modal__container"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(e);
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__title">{Title}</div>
        {Paragraph}
        <div className="modal__inputs">
          {Inputs} {Selects}
        </div>
        <div className="modal__buttons">{ButtonsComponent}</div>
      </form>
    </div>
  );
};

Modal.Title = ModalTitle;
Modal.Paragraph = ModalParagraph;

export default Modal;
