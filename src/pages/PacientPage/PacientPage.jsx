import { Fragment, useEffect, useState } from "react";
import Warning from "../../components/warning/Warning";
import { useAuth } from "../../hooks/useAuth";
import ListItem from "../../components/listItem/listItem";
import "./pacientPage.styles.scss";

import Remove from "../../assets/remove.svg";
import Restore from "../../assets/restore.svg";
import Edit from "../../assets/edit.svg";
import { getPatients, updatePatient } from "../../services/patientService";
import EmptyPage from "../../components/emptyPage/emptyPage";
import { mapPacient } from "../../utils/mappers";
import { normalizeList } from "../../utils/normalizers";
import ProfileEditModal from "../../components/profileEditModal/ProfileEditModal";

const PacientPage = () => {
  const { token } = useAuth();
  const [pacients, setPacients] = useState([]);
  const [selectedPacient, setSelectedPacient] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const openEditModal = (pacient) => {
    setSelectedPacient(pacient);
  };

  const closeEditModal = () => {
    setSelectedPacient(null);
  };

  const handleSave = async (values) => {
    if (!selectedPacient) return;
    setIsSaving(true);
    try {
      const data = await updatePatient(token, selectedPacient.id, {
        name: values.name,
        phone: values.phone,
        status: selectedPacient.disabled ? false : true,
        address: values.address,
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

        const list = normalizeList(data).map(mapPacient);
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
              <ProfileEditModal
                isOpen={true}
                title={`Editar ${item.name}`}
                initialValues={item}
                onClose={closeEditModal}
                onSubmit={handleSave}
                isSaving={isSaving}
              />
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
