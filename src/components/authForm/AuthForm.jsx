import "./authForm.styles.scss";

const AuthForm = ({ title, children }) => {
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
