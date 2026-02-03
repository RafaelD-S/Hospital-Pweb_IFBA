import { Fragment, useEffect, useState } from "react";
import Input from "../../components/input/Input";
import Modal from "../../components/modal/Modal";
import Button from "../../components/button/Button";
import Warning from "../../components/warning/Warning";
import { useAuth } from "../../hooks/useAuth";
import ListItem from "../../components/listItem/listItem";
import "./doctorPage.styles.scss";
import Edit from "../../assets/edit.svg";
import Remove from "../../assets/remove.svg";
import Restore from "../../assets/restore.svg";
import { isValidPhone, isValidState, isValidZip } from "../../utils/validators";
import EmptyPage from "../../components/emptyPage/emptyPage";
import { getDoctors, updateDoctor } from "../../services/doctorService";

const DoctorPage = () => {
  const { token, isAdmin } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
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

  const mapDoctor = (doctor) => {
    const address = doctor?.address ?? {};
    return {
      id: doctor?.id ?? doctor?.doctorId ?? doctor?.userId,
      name: doctor?.name ?? "",
      specialty: doctor?.specialty ?? "",
      email: doctor?.email ?? "",
      phone: doctor?.phone ?? "",
      crm: doctor?.crm ?? "",
      address,
      disabled: doctor?.status === false,
    };
  };

  const openEditModal = (doctor) => {
    setSelectedDoctor(doctor);
    setFormName(doctor?.name ?? "");
    setFormPhone(doctor?.phone ?? "");
    setFormStreet(doctor?.address?.street ?? "");
    setFormNumber(doctor?.address?.number ?? "");
    setFormComplement(doctor?.address?.complement ?? "");
    setFormNeighborhood(doctor?.address?.neighborhood ?? "");
    setFormCity(doctor?.address?.city ?? "");
    setFormState(doctor?.address?.state ?? "");
    setFormZipcode(doctor?.address?.zipCode ?? "");
  };

  const closeEditModal = () => {
    setSelectedDoctor(null);
  };

  const handleSave = async () => {
    if (!selectedDoctor) return;
    if (!formName.trim()) return setWarningMessage("Informe o nome do médico.");
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
      const data = await updateDoctor(token, selectedDoctor.id, {
        name: formName.trim(),
        phone: formPhone.trim(),
        status: selectedDoctor.disabled ? false : true,
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
      const updated = data ? mapDoctor(data) : null;
      if (updated) {
        setDoctors((prev) =>
          prev.map((d) => (d.id === updated.id ? updated : d)),
        );
      }
      closeEditModal();
    } catch (error) {
      setWarningMessage(
        error?.message ?? "Não foi possível atualizar o médico.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors(token, true);
        const list = Array.isArray(data)
          ? data.map(mapDoctor)
          : Array.isArray(data?.content)
            ? data.content.map(mapDoctor)
            : [];
        setDoctors(list);
      } catch (error) {
        setWarningMessage(
          error?.message ?? "Não foi possível carregar médicos.",
        );
      }
    };

    if (token) fetchDoctors();
  }, [token]);

  const handleToggleStatus = async (doctor) => {
    if (!doctor?.id) return;
    try {
      const data = await updateDoctor(token, doctor.id, {
        name: doctor.name,
        phone: doctor.phone,
        status: doctor.disabled ? true : false,
        address: {
          street: doctor.address?.street ?? "",
          number: doctor.address?.number ?? "",
          complement: doctor.address?.complement ?? "",
          neighborhood: doctor.address?.neighborhood ?? "",
          city: doctor.address?.city ?? "",
          state: doctor.address?.state ?? "",
          zipCode: doctor.address?.zipCode ?? "",
        },
      });
      const updated = data ? mapDoctor(data) : null;
      if (updated) {
        setDoctors((prev) =>
          prev.map((d) => (d.id === updated.id ? updated : d)),
        );
      } else {
        setDoctors((prev) =>
          prev.map((d) =>
            d.id === doctor.id ? { ...d, disabled: !d.disabled } : d,
          ),
        );
      }
    } catch (error) {
      setWarningMessage(
        error?.message ?? "Não foi possível atualizar o status do médico.",
      );
    }
  };

  return (
    <div className="doctor-page">
      <div className="doctor-page__content">
        {doctors.map((item) => (
          <Fragment key={item.id}>
            <ListItem
              title={item.name}
              subtitle={item.crm}
              description={`${item.specialty ?? ""} • ${item.email}`}
              disabled={item.disabled}
            >
              {isAdmin && (
                <>
                  <img
                    src={Edit}
                    alt="Edit"
                    onClick={() => openEditModal(item)}
                  />
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
                </>
              )}
            </ListItem>

            {selectedDoctor?.id === item.id && (
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

      {doctors.length === 0 && (
        <EmptyPage
          title="Nenhum médico encontrado"
          description="Não há médicos cadastrados no momento."
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

export default DoctorPage;
