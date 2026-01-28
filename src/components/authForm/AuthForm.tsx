import type { IAuthForm } from "./authForm.interface";
import "./authForm.styles.scss";

const AuthForm = ({ title, children }: IAuthForm) => {
  return (
    <main className="authForm">
      <div className="authForm__container">
        <h1 className="authForm__title">{title}</h1>
        <form action="" className="authForm__form">
          {children}
        </form>
      </div>
    </main>
  );
};

export default AuthForm;
