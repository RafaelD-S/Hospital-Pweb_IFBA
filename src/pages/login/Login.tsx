import { useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";

import "./login.styles.scss";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token) navigate("/medicos");
  };

  return (
    <main className="login">
      <div className="login__container">
        <h1 className="login__title">Faça o Login</h1>
        <form action="" className="login__form">
          <div className="login__form__inputs">
            <Input label="Nome" placeholder="Digite seu nome" type="email" />

            <Input
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
            />
          </div>

          <Button type="submit" onClick={handleSubmit}>
            Login
          </Button>
        </form>
      </div>
    </main>
  );
};

export default Login;
