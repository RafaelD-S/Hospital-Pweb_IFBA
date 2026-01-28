import { useState } from "react";
import AuthForm from "../../components/authForm/AuthForm";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import Select from "../../components/select/select";
import type { ISelectOption } from "../../components/select/select.interface";

const Register = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const securityLevels: ISelectOption[] = [
    { label: "Usuário", value: "0", selected: true },
    { label: "Admin", value: "1", selected: false },
  ];

  const isFormValid = name.trim() !== "" && password.trim() !== "";

  return (
    <AuthForm title="Faça seu registro">
      <Input
        label="Nome"
        placeholder="Digite um nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        label="Senha"
        type="password"
        placeholder="Escolha uma senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Select label="Nível de segurança" options={securityLevels} />
      <Button type="submit" disabled={!isFormValid}>
        Registrar
      </Button>
    </AuthForm>
  );
};

export default Register;
