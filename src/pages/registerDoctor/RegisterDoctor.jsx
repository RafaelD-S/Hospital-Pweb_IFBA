import { useEffect, useState } from "react";
import AuthForm from "../../components/authForm/AuthForm";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import "./registerDoctor.styles.scss";
import Select from "../../components/select/select";
import Warning from "../../components/warning/Warning";
import Modal from "../../components/modal/Modal";
import { useNavigate } from "react-router-dom";

const specialtyLabels = {
  ORTHOPEDICS: "Ortopedia",
  CARDIOLOGY: "Cardiologia",
  GYNECOLOGY: "Ginecologia",
  DERMATOLOGY: "Dermatologia",
};

const RegisterDoctor = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("Placeholder");
  const [email, setEmail] = useState(
    `${Math.random().toString(36).substring(2, 11)}@example.com`,
  );
  const [phone, setPhone] = useState(
    `(11) 9${Math.floor(10000000 + Math.random() * 90000000)}`,
  );
  const [password, setPassword] = useState("123456");
  const [specialty, setSpecialty] = useState("");
  const [crm, setCrm] = useState(
    `CRM/BA ${Math.floor(100000 + Math.random() * 900000)}`,
  );
  const [logradouro, setLogradouro] = useState("Rua das Flores");
  const [numero, setNumero] = useState("200");
  const [complemento, setComplemento] = useState("Casa A");
  const [bairro, setBairro] = useState("Bairro");
  const [cidade, setCidade] = useState("Cidade");
  const [estado, setEstado] = useState("SP");
  const [cep, setCep] = useState("12345-678");
  const [warningMessage, setWarningMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specialties, setSpecialties] = useState([]);

  const onlyDigits = (value) => value.replace(/\D/g, "");
  const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value);
  const isValidPhone = (value) => {
    const digits = onlyDigits(value);
    return digits.length === 10 || digits.length === 11;
  };
  const isValidZip = (value) => /^\d{5}-?\d{3}$/.test(value);
  const isValidState = (value) => /^[A-Za-z]{2}$/.test(value);
  const isValidCrm = (value) => /^CRM\/([A-Za-z]{2})\s\d{6}$/.test(value);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
        const response = await fetch(`${apiUrl}/auth/specialties`);
        if (!response.ok) return;
        const data = await response.json();
        if (Array.isArray(data)) setSpecialties(data);
      } catch {
        // noop
      }
    };

    fetchSpecialties();
  }, []);

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
    if (!specialty.trim())
      return setWarningMessage("Selecione uma especialidade.");
    if (!crm.trim() || !isValidCrm(crm))
      return setWarningMessage("Informe um CRM válido (CRM/UF 000000).");
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
      const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
      const response = await fetch(`${apiUrl}/auth/register/medico`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          name: name.trim(),
          phone: phone.trim(),
          crm: crm.trim(),
          specialty,
          address: {
            street: logradouro.trim(),
            number: numero.trim() || null,
            complement: complemento.trim() || null,
            neighborhood: bairro.trim(),
            city: cidade.trim(),
            state: estado.trim().toUpperCase(),
            zipCode: cep.trim(),
          },
        }),
      });

      if (!response.ok) {
        let message = "Erro ao cadastrar. Verifique os dados.";
        try {
          const data = await response.json();
          message = data?.message ?? message;
        } catch {
          // noop
        }
        throw new Error(message);
      }

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
          <Select
            label="Especialidade"
            onChange={(item) => setSpecialty(item)}
            options={specialties.map((value) => ({
              label: specialtyLabels[value] ?? value,
              value,
              selected: value === specialty,
            }))}
          />
          <Input
            label="CRM"
            placeholder="Digite o CRM"
            type="text"
            value={crm}
            onChange={(e) => setCrm(e.target.value)}
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

export default RegisterDoctor;
