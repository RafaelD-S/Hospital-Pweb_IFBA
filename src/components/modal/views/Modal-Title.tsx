import type { ReactNode } from "react";

const ModalTitle = ({ children }: { children: ReactNode }) => {
  return <h2 className="modal__title">{children}</h2>;
};

export default ModalTitle;
