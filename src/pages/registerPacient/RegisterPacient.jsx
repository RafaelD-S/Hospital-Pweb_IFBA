import { useState } from "react";
import AuthForm from "../../components/authForm/AuthForm";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import "./registerDoctor.styles.scss";
import Warning from "../../components/warning/Warning";
import Modal from "../../components/modal/Modal";
import { useNavigate } from "react-router-dom";
import {
  isValidCpf,
  isValidEmail,
  isValidPhone,
  isValidState,
  isValidZip,
  onlyDigits,
} from "../../utils/validators";
import { registerPatient } from "../../services/authService";

const RegisterPacient = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("Placeholder");
  const [email, setEmail] = useState(
    `${Math.random().toString(36).substring(2, 11)}@example.com`,
  );
  const [phone, setPhone] = useState(
    `(11) 9${Math.floor(10000000 + Math.random() * 90000000)}`,
  );
  const [password, setPassword] = useState("123456");
  const [cpf, setCpf] = useState("");
  const [logradouro, setLogradouro] = useState("Rua das Flores");
  const [numero, setNumero] = useState("200");
  const [complemento, setComplemento] = useState("Casa A");
  const [bairro, setBairro] = useState("Bairro");
  const [cidade, setCidade] = useState("Cidade");
  const [estado, setEstado] = useState("SP");
  const [cep, setCep] = useState("00000-000");
  const [warningMessage, setWarningMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setWarningMessage("Informe o nome.");
    if (!email.trim() || !isValidEmail(email))
      return setWarningMessage(
        "Informe um email válido (ex.: nome@dominio.com).",
      );
    if (!password.trim() || password.length < 6)
      return setWarningMessage("A senha deve ter no mínimo 6 caracteres.");
    if (!phone.trim() || !isValidPhone(phone))
      return setWarningMessage(
        "Informe um telefone válido (ex.: (00) 00000-0000 ou 00000000000).",
      );
    if (!cpf.trim() || !isValidCpf(cpf))
      return setWarningMessage("Informe um CPF válido (11 dígitos).");
    if (!logradouro.trim()) return setWarningMessage("Informe o logradouro.");
    if (!bairro.trim()) return setWarningMessage("Informe o bairro.");
    if (!cidade.trim()) return setWarningMessage("Informe a cidade.");
    if (!estado.trim() || !isValidState(estado))
      return setWarningMessage("Informe a UF com 2 letras (ex.: BA, SP).");
    if (!cep.trim() || !isValidZip(cep))
      return setWarningMessage("Informe um CEP válido (00000-000).");

    setWarningMessage("");
    setIsSubmitting(true);

    try {
      await registerPatient({
        email: email.trim(),
        password,
        name: name.trim(),
        phone: phone.trim(),
        cpf: onlyDigits(cpf),
        address: {
          street: logradouro.trim(),
          number: numero.trim() || null,
          complement: complemento.trim() || null,
          neighborhood: bairro.trim(),
          city: cidade.trim(),
          state: estado.trim().toUpperCase(),
          zipCode: cep.trim(),
        },
      });

      setIsModalOpen(true);
    } catch (error) {
      setWarningMessage(error?.message ?? "Erro ao cadastrar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AuthForm title="Faça seu registro">
        <div className="register__form__inputs">
          <Input
            label="nome"
            placeholder="Digite um nome"
            defaultValue="Placeholder"
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
        <Button type="submit" onClick={formSubmit} disabled={isSubmitting}>
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
