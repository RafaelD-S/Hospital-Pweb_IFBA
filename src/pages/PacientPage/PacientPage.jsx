import { Fragment, useEffect, useState } from "react";
import Warning from "../../components/warning/Warning";
import { useAuth } from "../../hooks/useAuth";
import ListItem from "../../components/listItem/listItem";
import "./pacientPage.styles.scss";

import Remove from "../../assets/remove.svg";
import Restore from "../../assets/restore.svg";
import Edit from "../../assets/edit.svg";
import Modal from "../../components/modal/Modal";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import { isValidPhone, isValidState, isValidZip } from "../../utils/validators";
import { getPatients, updatePatient } from "../../services/patientService";
import EmptyPage from "../../components/emptyPage/emptyPage";

const PacientPage = () => {
  const { token } = useAuth();
  const [pacients, setPacients] = useState([]);
  const [selectedPacient, setSelectedPacient] = useState(null);
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formStreet, setFormStreet] = useState("");
  const [formNumber, setFormNumber] = useState("");
  const [formComplement, setFormComplement] = useState("");
  const [formNeighborhood, setFormNeighborhood] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formState, setFormState] = useState("");
  const [formZipcode, setFormZipcode] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const mapPacient = (pacient) => {
    return {
      id: pacient?.id,
      name: pacient?.name ?? "",
      email: pacient?.email ?? "",
      cpf: pacient?.cpf ?? "",
      phone: pacient?.phone ?? "",
      disabled: pacient?.status === false,
      address: pacient?.address ?? {},
    };
  };

  const openEditModal = (pacient) => {
    setSelectedPacient(pacient);
    setFormName(pacient?.name ?? "");
    setFormPhone(pacient?.phone ?? "");
    setFormStreet(pacient?.address?.street ?? "");
    setFormNumber(pacient?.address?.number ?? "");
    setFormComplement(pacient?.address?.complement ?? "");
    setFormNeighborhood(pacient?.address?.neighborhood ?? "");
    setFormCity(pacient?.address?.city ?? "");
    setFormState(pacient?.address?.state ?? "");
    setFormZipcode(pacient?.address?.zipCode ?? "");
  };

  const closeEditModal = () => {
    setSelectedPacient(null);
  };

  const handleSave = async () => {
    if (!selectedPacient) return;
    if (!formName.trim())
      return setWarningMessage("Informe o nome do paciente.");
    if (!formPhone.trim() || !isValidPhone(formPhone))
      return setWarningMessage(
        "Informe um telefone válido (ex.: (00) 00000-0000 ou 00000000000).",
      );
    if (!formStreet.trim()) return setWarningMessage("Informe o logradouro.");
    if (!formNeighborhood.trim()) return setWarningMessage("Informe o bairro.");
    if (!formCity.trim()) return setWarningMessage("Informe a cidade.");
    if (!formState.trim() || !isValidState(formState))
      return setWarningMessage("Informe a UF com 2 letras (ex.: BA, SP).");
    if (!formZipcode.trim() || !isValidZip(formZipcode))
      return setWarningMessage("Informe um CEP válido (00000-000).");

    setIsSaving(true);
    try {
      const data = await updatePatient(token, selectedPacient.id, {
        name: formName.trim(),
        phone: formPhone.trim(),
        status: selectedPacient.disabled ? false : true,
        address: {
          street: formStreet.trim(),
          number: formNumber.trim(),
          complement: formComplement.trim(),
          neighborhood: formNeighborhood.trim(),
          city: formCity.trim(),
          state: formState.trim(),
          zipCode: formZipcode.trim(),
        },
      });
      const updated = data ? mapPacient(data) : null;
      if (updated) {
        setPacients((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p)),
        );
      }
      closeEditModal();
    } catch (error) {
      setWarningMessage(
        error?.message ?? "Não foi possível atualizar o paciente.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (pacient) => {
    if (!pacient?.id) return;
    try {
      const data = await updatePatient(token, pacient.id, {
        name: pacient.name,
        phone: pacient.phone,
        status: pacient.disabled ? true : false,
        address: {
          street: pacient.address?.street ?? "",
          number: pacient.address?.number ?? "",
          complement: pacient.address?.complement ?? "",
          neighborhood: pacient.address?.neighborhood ?? "",
          city: pacient.address?.city ?? "",
          state: pacient.address?.state ?? "",
          zipCode: pacient.address?.zipCode ?? "",
        },
      });
      const updated = data ? mapPacient(data) : null;
      if (updated) {
        setPacients((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p)),
        );
      } else {
        setPacients((prev) =>
          prev.map((p) =>
            p.id === pacient.id ? { ...p, disabled: !p.disabled } : p,
          ),
        );
      }
    } catch (error) {
      setWarningMessage(
        error?.message ?? "Não foi possível atualizar o status do paciente.",
      );
    }
  };

  useEffect(() => {
    const fetchPacients = async () => {
      try {
        const data = await getPatients(token, true);
        console.log(data);

        const list = Array.isArray(data)
          ? data.map(mapPacient)
          : Array.isArray(data?.content)
            ? data.content.map(mapPacient)
            : [];
        setPacients(list);
      } catch (error) {
        setWarningMessage(
          error?.message ?? "Não foi possível carregar pacientes.",
        );
      }
    };

    if (token) fetchPacients();
  }, [token]);

  return (
    <div className="pacient-page">
      <div className="pacient-page__content">
        {pacients.map((item) => (
          <Fragment key={item.id}>
            <ListItem
              title={item.name}
              subtitle={item.cpf}
              description={item.email}
              disabled={item.disabled}
            >
              <img src={Edit} alt="Edit" onClick={() => openEditModal(item)} />

              {item.disabled ? (
                <img
                  src={Restore}
                  alt="Restore"
                  onClick={() => handleToggleStatus(item)}
                />
              ) : (
                <img
                  src={Remove}
                  alt="Remove"
                  onClick={() => handleToggleStatus(item)}
                />
              )}
            </ListItem>

            {selectedPacient?.id === item.id && (
              <Modal isOpen={true} onClickOutside={closeEditModal}>
                <Modal.Title>Editar {item.name}</Modal.Title>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  label="Nome"
                  placeholder="Digite o nome"
                />
                <Input
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  label="Telefone"
                  placeholder="Digite o telefone"
                />
                <Input
                  value={formStreet}
                  onChange={(e) => setFormStreet(e.target.value)}
                  label="Logradouro"
                  placeholder="Digite o logradouro"
                />
                <Input
                  value={formNumber}
                  onChange={(e) => setFormNumber(e.target.value)}
                  label="Número"
                  placeholder="Digite o número"
                />
                <Input
                  value={formComplement}
                  onChange={(e) => setFormComplement(e.target.value)}
                  label="Complemento"
                  placeholder="Digite o complemento"
                />
                <Input
                  value={formNeighborhood}
                  onChange={(e) => setFormNeighborhood(e.target.value)}
                  label="Bairro"
                  placeholder="Digite o bairro"
                />
                <Input
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
                  label="Cidade"
                  placeholder="Digite a cidade"
                />
                <Input
                  value={formState}
                  onChange={(e) => setFormState(e.target.value)}
                  label="Estado"
                  placeholder="Digite o estado"
                />
                <Input
                  value={formZipcode}
                  onChange={(e) => setFormZipcode(e.target.value)}
                  label="CEP"
                  placeholder="Digite o CEP"
                />
                <Button onClick={handleSave} disabled={isSaving}>
                  Salvar
                </Button>
              </Modal>
            )}
          </Fragment>
        ))}
      </div>

      {pacients.length === 0 && (
        <EmptyPage
          title="Nenhum paciente encontrado."
          description="Não há pacientes cadastrados no momento. Atualize a página para verificar novamente."
        />
      )}

      {warningMessage && (
        <Warning
          message={warningMessage}
          action="Fechar"
          onActionClick={() => setWarningMessage("")}
        />
      )}
    </div>
  );
};

export default PacientPage;
