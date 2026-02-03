import { Fragment, useEffect, useState } from "react";
import Warning from "../../components/warning/Warning";
import { useAuth } from "../../hooks/useAuth";
import ListItem from "../../components/listItem/listItem";
import "./doctorPage.styles.scss";
import Edit from "../../assets/edit.svg";
import Remove from "../../assets/remove.svg";
import Restore from "../../assets/restore.svg";
import EmptyPage from "../../components/emptyPage/emptyPage";
import { getDoctors, updateDoctor } from "../../services/doctorService";
import { mapDoctor } from "../../utils/mappers";
import { normalizeList } from "../../utils/normalizers";
import ProfileEditModal from "../../components/profileEditModal/ProfileEditModal";

const DoctorPage = () => {
  const { token, isAdmin } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const openEditModal = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const closeEditModal = () => {
    setSelectedDoctor(null);
  };

  const handleSave = async (values) => {
    if (!selectedDoctor) return;
    setIsSaving(true);
    try {
      const data = await updateDoctor(token, selectedDoctor.id, {
        name: values.name,
        phone: values.phone,
        status: selectedDoctor.disabled ? false : true,
        address: values.address,
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
        const list = normalizeList(data).map(mapDoctor);
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
