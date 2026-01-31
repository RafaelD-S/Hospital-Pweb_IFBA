import { useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";

import "./login.styles.scss";
import { useAuth } from "../../hooks/useAuth";
import AuthForm from "../../components/authForm/AuthForm";
import { useState } from "react";
import Warning from "../../components/warning/Warning";
import Modal from "../../components/modal/Modal";

const Login = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!token) setWarningMessage("Nome ou senha inválidos");
    else if (token) navigate("/medicos");
    else if (nome.trim() === "" || senha.trim() === "")
      setWarningMessage("Preencha todos os campos");
    else setWarningMessage("");
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <>
      <AuthForm title="Faça o Login">
        <div className="login__form__inputs">
          <Input
            label="Email"
            placeholder="Digite seu email"
            type="email"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <Input
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <p className="login__form__register">
            Não possui uma conta?{" "}
            <a
              className="login__form__register__link"
              onClick={handleRegisterClick}
            >
              Registre-se
            </a>
          </p>
        </div>

        <Button type="submit" onClick={handleSubmit}>
          Login
        </Button>

        {warningMessage && (
          <Warning
            message={warningMessage}
            action="Fechar"
            onActionClick={() => setWarningMessage("")}
          />
        )}
      </AuthForm>
      {isModalOpen && (
        <Modal
          isOpen={true}
          onClickOutside={() => {
            console.log("clicked outside");
            setIsModalOpen(false);
          }}
        >
          <Modal.Title>Você é médico ou paciente?</Modal.Title>
          <Button onClick={() => navigate("/register/pacient")}>
            Paciente
          </Button>
          <Button onClick={() => navigate("/register/doctor")}>Médico</Button>
        </Modal>
      )}
    </>
  );
};

export default Login;
