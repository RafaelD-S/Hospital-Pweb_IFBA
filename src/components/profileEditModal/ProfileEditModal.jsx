import { useEffect, useState } from "react";
import Modal from "../modal/Modal";
import Input from "../input/Input";
import Button from "../button/Button";
import Warning from "../warning/Warning";
import { isValidPhone, isValidState, isValidZip } from "../../utils/validators";

const ProfileEditModal = ({
  isOpen,
  title = "Editar perfil",
  initialValues,
  onClose,
  onSubmit,
  isSaving,
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [warningMessage, setWarningMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setName(initialValues?.name ?? "");
    setPhone(initialValues?.phone ?? "");
    setStreet(initialValues?.address?.street ?? "");
    setNumber(initialValues?.address?.number ?? "");
    setComplement(initialValues?.address?.complement ?? "");
    setNeighborhood(initialValues?.address?.neighborhood ?? "");
    setCity(initialValues?.address?.city ?? "");
    setState(initialValues?.address?.state ?? "");
    setZipCode(initialValues?.address?.zipCode ?? "");
    setWarningMessage("");
  }, [initialValues, isOpen]);

  const handleSave = async () => {
    if (!name.trim()) return setWarningMessage("Informe o nome.");
    if (!phone.trim() || !isValidPhone(phone))
      return setWarningMessage(
        "Informe um telefone válido (ex.: (00) 00000-0000 ou 00000000000).",
      );
    if (!street.trim()) return setWarningMessage("Informe o logradouro.");
    if (!neighborhood.trim()) return setWarningMessage("Informe o bairro.");
    if (!city.trim()) return setWarningMessage("Informe a cidade.");
    if (!state.trim() || !isValidState(state))
      return setWarningMessage("Informe a UF com 2 letras (ex.: BA, SP).");
    if (!zipCode.trim() || !isValidZip(zipCode))
      return setWarningMessage("Informe um CEP válido (00000-000).");

    setWarningMessage("");
    await onSubmit({
      name: name.trim(),
      phone: phone.trim(),
      address: {
        street: street.trim(),
        number: number.trim() || null,
        complement: complement.trim() || null,
        neighborhood: neighborhood.trim(),
        city: city.trim(),
        state: state.trim(),
        zipCode: zipCode.trim(),
      },
    });
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={true} onClickOutside={onClose}>
      <Modal.Title>{title}</Modal.Title>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        label="Nome"
        placeholder="Digite o nome"
      />
      <Input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        label="Telefone"
        placeholder="Digite o telefone"
      />
      <Input
        value={street}
        onChange={(e) => setStreet(e.target.value)}
        label="Logradouro"
        placeholder="Digite o logradouro"
      />
      <Input
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        label="Número"
        placeholder="Digite o número"
      />
      <Input
        value={complement}
        onChange={(e) => setComplement(e.target.value)}
        label="Complemento"
        placeholder="Digite o complemento"
      />
      <Input
        value={neighborhood}
        onChange={(e) => setNeighborhood(e.target.value)}
        label="Bairro"
        placeholder="Digite o bairro"
      />
      <Input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        label="Cidade"
        placeholder="Digite a cidade"
      />
      <Input
        value={state}
        onChange={(e) => setState(e.target.value)}
        label="Estado"
        placeholder="Digite o estado"
      />
      <Input
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
        label="CEP"
        placeholder="Digite o CEP"
      />
      {warningMessage && (
        <Warning
          message={warningMessage}
          action="Fechar"
          onActionClick={() => setWarningMessage("")}
        />
      )}
      <Button onClick={handleSave} disabled={isSaving}>
        Salvar
      </Button>
    </Modal>
  );
};

export default ProfileEditModal;
