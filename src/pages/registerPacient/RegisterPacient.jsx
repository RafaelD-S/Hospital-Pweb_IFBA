import { useState } from "react";
import AuthForm from "../../components/authForm/AuthForm";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import "./registerDoctor.styles.scss";
import Warning from "../../components/warning/Warning";
import Modal from "../../components/modal/Modal";
import { useNavigate } from "react-router-dom";

const RegisterPacient = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [cpf, setCpf] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cep, setCep] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formSubmit = (e) => {
    e.preventDefault();
    const registerData = {
      name,
      email,
      phone,
      password,
      cpf,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      cep,
    };

    const isAllFieldsFilled = Object.values(registerData).every(
      (value) => value.trim() !== "",
    );

    if (isAllFieldsFilled) setIsModalOpen(true);
    else setWarningMessage("Preencha todos os campos corretamente");
  };

  return (
    <>
      <AuthForm title="Faça seu registro">
        <div className="register__form__inputs">
          <Input
            label="nome"
            placeholder="Digite um nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="email"
            placeholder="Digite um email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="telefone"
            type="text"
            placeholder="Digite um telefone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            label="CPF"
            placeholder="Digite o CPF"
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
          <Input
            label="CEP"
            placeholder="Digite o CEP"
            type="text"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
          />
          <Input
            label="Logradouro"
            placeholder="Digite o logradouro"
            value={logradouro}
            onChange={(e) => setLogradouro(e.target.value)}
          />
          <Input
            label="Número"
            placeholder="Digite o número"
            type="text"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
          <Input
            label="Complemento"
            placeholder="Digite o complemento"
            value={complemento}
            onChange={(e) => setComplemento(e.target.value)}
          />
          <Input
            label="Bairro"
            placeholder="Digite o bairro"
            type="text"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
          />
          <Input
            label="Cidade"
            placeholder="Digite a cidade"
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
          />
          <Input
            label="Estado"
            placeholder="Digite o estado"
            type="text"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          />
        </div>
        <Input
          label="Senha"
          type="password"
          placeholder="Escolha uma senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" onClick={formSubmit} disabled={false}>
          Registrar
        </Button>
      </AuthForm>

      {warningMessage && (
        <Warning
          message={warningMessage}
          action="Fechar"
          onActionClick={() => setWarningMessage("")}
        />
      )}

      {isModalOpen && (
        <Modal isOpen={true}>
          <Modal.Title>Registro bem-sucedido!</Modal.Title>
          <Modal.Paragraph>
            Seu registro foi mandado para ser aprovado. O seu progresso será
            informado pelo email fornecido.
          </Modal.Paragraph>
          <Button onClick={() => navigate("/login")}>Fechar</Button>
        </Modal>
      )}
    </>
  );
};

export default RegisterPacient;
