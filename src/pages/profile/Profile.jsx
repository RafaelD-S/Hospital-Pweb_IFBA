import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Warning from "../../components/warning/Warning";
import { useAuth } from "../../hooks/useAuth";
import { getMe } from "../../services/authService";
import {
  createAppointment,
  deleteAppointment,
  completeAppointment,
  getDoctorAppointments,
  getPatientAppointments,
} from "../../services/appointmentService";
import { getDoctors } from "../../services/doctorService";
import ListItem from "../../components/listItem/listItem";
import EmptyPage from "../../components/emptyPage/emptyPage";
import Button from "../../components/button/Button";
import Modal from "../../components/modal/Modal";
import Input from "../../components/input/Input";
import Select from "../../components/select/select";
import Remove from "../../assets/remove.svg";
import Confirm from "../../assets/confirm.svg";
import "./profile.styles.scss";

const formatDateBR = (dateTime) => {
  const d = new Date(dateTime);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString();
};

const formatHourBR = (dateTime) => {
  const d = new Date(dateTime);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const toDateTime = (date, hour) => new Date(`${date}T${hour}:00`);

const isSunday = (dateStr) => {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.getDay() === 0;
};

const withinBusinessHours = (hour) => {
  const h = parseInt(hour.split(":")[0], 10);
  return h >= 7 && h <= 18;
};

const businessHoursOptions = (dateStr) => {
  const opts = [];
  for (let h = 7; h <= 18; h++) {
    const label = `${String(h).padStart(2, "0")}:00`;
    if (dateStr) {
      const start = toDateTime(dateStr, label);
      const diff = start.getTime() - Date.now();
      if (diff < 30 * 60 * 1000) continue;
    }
    opts.push({ label, value: label });
  }
  return opts;
};

const Profile = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [warningMessage, setWarningMessage] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelAppointment, setCancelAppointment] = useState(null);
  const todayStr = new Date().toLocaleDateString("en-CA");

  const normalizeList = (data) =>
    Array.isArray(data)
      ? data
      : Array.isArray(data?.content)
        ? data.content
        : [];

  const mapAppointment = (appointment) => {
    const patient = appointment?.patient ?? appointment?.pacient;
    const doctor = appointment?.doctor ?? {};
    const time =
      appointment?.appointmentTime ??
      appointment?.dateTime ??
      appointment?.time;

    return {
      id: appointment?.id ?? appointment?.appointmentId,
      pacientId: patient?.id ?? appointment?.patientId,
      doctorCrm: doctor?.crm ?? appointment?.doctorCrm,
      patientName: patient?.name ?? "",
      doctorName: doctor?.name ?? "",
      status: appointment?.status ?? "",
      date: formatDateBR(time),
      hour: formatHourBR(time),
    };
  };

  const mapDoctor = (doctor) => ({
    id: doctor?.id ?? doctor?.doctorId ?? doctor?.userId,
    name: doctor?.name ?? "",
    crm: doctor?.crm ?? "",
    specialty: doctor?.specialty ?? "",
    disabled: doctor?.status === false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMe(token);
        setProfile(data);

        if (data?.role === "PATIENT" && data?.patient?.id) {
          const list = await getPatientAppointments(token, data.patient.id);
          setAppointments(normalizeList(list).map(mapAppointment));
          const doctorData = await getDoctors(token, true);
          setDoctors(normalizeList(doctorData).map(mapDoctor));
        } else if (data?.role === "DOCTOR" && data?.doctor?.id) {
          const list = await getDoctorAppointments(token, data.doctor.id);
          setAppointments(normalizeList(list).map(mapAppointment));
        } else {
          setAppointments([]);
        }
      } catch (error) {
        setWarningMessage(
          error?.message ?? "Não foi possível carregar perfil.",
        );
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const userInfo = useMemo(() => {
    if (!profile) return null;
    if (profile.role === "PATIENT") return profile.patient;
    if (profile.role === "DOCTOR") return profile.doctor;
    return null;
  }, [profile]);

  const activeDoctors = useMemo(
    () => doctors.filter((d) => !d.disabled),
    [doctors],
  );

  const patientHasAppointmentSameDay = useMemo(() => {
    if (!profile?.patient?.id || !selectedDate) return false;
    return appointments.some(
      (a) =>
        String(a.pacientId) === String(profile.patient.id) &&
        a.date === selectedDate,
    );
  }, [appointments, profile, selectedDate]);

  const doctorUnavailable = useMemo(() => {
    if (!selectedDoctor || !selectedDate || !selectedHour) return false;
    return appointments.some(
      (a) =>
        a.doctorCrm === selectedDoctor &&
        a.date === selectedDate &&
        a.hour === selectedHour,
    );
  }, [appointments, selectedDoctor, selectedDate, selectedHour]);

  const hourOptions = useMemo(() => {
    if (!selectedDate || isSunday(selectedDate)) return [];
    const todayStr = new Date().toLocaleDateString("en-CA");
    const useDateForThirtyMin =
      selectedDate === todayStr ? selectedDate : undefined;
    return businessHoursOptions(useDateForThirtyMin);
  }, [selectedDate]);

  const availableDoctorsForSelection = useMemo(() => {
    if (!selectedDate || !selectedHour)
      return activeDoctors.map((d) => ({
        label: `${d.name} - ${d.specialty}`,
        value: d.crm ?? "",
      }));
    const booked = new Set(
      appointments
        .filter((a) => a.date === selectedDate && a.hour === selectedHour)
        .map((a) => a.doctorCrm),
    );
    return activeDoctors
      .filter((d) => !booked.has(d.crm ?? ""))
      .map((d) => ({
        label: d.name ? `${d.name} (${d.specialty})` : (d.crm ?? ""),
        value: d.crm ?? "",
      }));
  }, [activeDoctors, appointments, selectedDate, selectedHour]);

  const openCreateModal = () => {
    setSelectedDate("");
    setSelectedHour("");
    setSelectedDoctor("");
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const openCancelModal = (appointment) => {
    setCancelAppointment(appointment);
    setCancelReason("");
    setCancelModalOpen(true);
  };

  const handleCreateAppointment = async () => {
    if (!profile?.patient?.id) return;
    if (!selectedDate)
      return setWarningMessage("Selecione a data da consulta.");
    if (isSunday(selectedDate))
      return setWarningMessage("Atendimentos apenas de segunda a sábado.");
    if (!selectedHour || !withinBusinessHours(selectedHour))
      return setWarningMessage("Selecione um horário entre 07:00 e 18:00.");

    const start = toDateTime(selectedDate, selectedHour);
    if (start.getTime() - Date.now() < 30 * 60 * 1000)
      return setWarningMessage(
        "Agende com pelo menos 30 minutos de antecedência.",
      );

    if (patientHasAppointmentSameDay)
      return setWarningMessage("Paciente já possui consulta nesse dia.");

    let doctorToAssign = selectedDoctor;
    if (!doctorToAssign) {
      doctorToAssign = availableDoctorsForSelection[0]?.value ?? "";
      if (!doctorToAssign)
        return setWarningMessage("Nenhum médico disponível para esse horário.");
    }

    if (doctorUnavailable)
      return setWarningMessage("Médico já possui consulta nesse horário.");

    try {
      const payload = {
        patientId: profile.patient.id,
        appointmentTime: `${selectedDate}T${selectedHour}:00`,
      };
      if (doctorToAssign) payload.doctorCrm = doctorToAssign;

      const data = await createAppointment(token, payload);
      if (data) {
        setAppointments((prev) => [mapAppointment(data), ...prev]);
      } else {
        const list = await getPatientAppointments(token, profile.patient.id);
        setAppointments(normalizeList(list).map(mapAppointment));
      }

      closeCreateModal();
    } catch (error) {
      setWarningMessage(error?.message ?? "Erro ao agendar consulta.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleCompleteAppointment = async (appointment) => {
    try {
      const data = await completeAppointment(token, appointment.id);
      const updated = data ? mapAppointment(data) : null;
      if (updated) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === updated.id ? updated : a)),
        );
      } else {
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === appointment.id ? { ...a, status: "COMPLETED" } : a,
          ),
        );
      }
    } catch (error) {
      setWarningMessage(error?.message ?? "Erro ao concluir consulta.");
    }
  };

  return (
    <div className="profile">
      <header className="profile__header">
        <h2 className="profile__title">Perfil</h2>
        <div className="profile__actions">
          <Button value="error" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </header>

      {profile && (
        <section className="profile__card">
          <div className="profile__row">
            <strong>Nome:</strong>
            <span>{profile.name}</span>
          </div>
          <div className="profile__row">
            <strong>Email:</strong>
            <span>{profile.email}</span>
          </div>
          <div className="profile__row">
            <strong>Role:</strong>
            <span>{profile.role}</span>
          </div>

          {userInfo && (
            <>
              {userInfo.phone && (
                <div className="profile__row">
                  <strong>Telefone:</strong>
                  <span>{userInfo.phone}</span>
                </div>
              )}
              {userInfo.cpf && (
                <div className="profile__row">
                  <strong>CPF:</strong>
                  <span>{userInfo.cpf}</span>
                </div>
              )}
              {userInfo.crm && (
                <div className="profile__row">
                  <strong>CRM:</strong>
                  <span>{userInfo.crm}</span>
                </div>
              )}
              {userInfo.specialty && (
                <div className="profile__row">
                  <strong>Especialidade:</strong>
                  <span>{userInfo.specialty}</span>
                </div>
              )}
              {userInfo.address && (
                <div className="profile__row">
                  <strong>Endereço:</strong>
                  <span>
                    {userInfo.address.street}
                    {userInfo.address.number
                      ? `, ${userInfo.address.number}`
                      : ""}
                    {userInfo.address.complement
                      ? ` - ${userInfo.address.complement}`
                      : ""}
                    {userInfo.address.neighborhood
                      ? `, ${userInfo.address.neighborhood}`
                      : ""}
                    {userInfo.address.city ? ` - ${userInfo.address.city}` : ""}
                    {userInfo.address.state ? `/${userInfo.address.state}` : ""}
                    {userInfo.address.zipCode
                      ? `, ${userInfo.address.zipCode}`
                      : ""}
                  </span>
                </div>
              )}
              {typeof userInfo.status === "boolean" && (
                <div className="profile__row">
                  <strong>Status:</strong>
                  <span>{userInfo.status ? "Ativo" : "Inativo"}</span>
                </div>
              )}
            </>
          )}
        </section>
      )}

      {profile?.role !== "ADMIN" && (
        <section className="profile__appointments">
          <div className="profile__appointments__header">
            <h3 className="profile__subtitle">Minhas consultas</h3>
            {profile?.role === "PATIENT" && (
              <Button onClick={openCreateModal}>Nova consulta</Button>
            )}
          </div>
          <div className="profile__list">
            {appointments.map((item) => (
              <ListItem
                key={item.id}
                title={item.patientName || profile?.name}
                subtitle={item.doctorName}
                description={`${item.date} ${item.hour}`}
              >
                <span
                  className={`profile__status profile__status--${item.status?.toLowerCase()}`}
                >
                  {item.status}
                </span>
                {profile?.role === "DOCTOR" && item.status === "SCHEDULED" && (
                  <img
                    src={Confirm}
                    alt="Confirm"
                    onClick={() => handleCompleteAppointment(item)}
                  />
                )}
                {item.status === "SCHEDULED" && (
                  <img
                    src={Remove}
                    alt="Remove"
                    onClick={() => openCancelModal(item)}
                  />
                )}
              </ListItem>
            ))}
          </div>
          {appointments.length === 0 && (
            <EmptyPage
              title="Nenhuma consulta encontrada"
              description="Não há consultas associadas ao seu perfil."
            />
          )}
        </section>
      )}

      {warningMessage && (
        <Warning
          message={warningMessage}
          action="Fechar"
          onActionClick={() => setWarningMessage("")}
        />
      )}

      {isCreateModalOpen && (
        <Modal isOpen={true} onClickOutside={closeCreateModal}>
          <Modal.Title>Cadastrar Consulta</Modal.Title>

          <Input
            label="Data"
            type="date"
            placeholder="Selecione a data"
            defaultValue={selectedDate}
            min={todayStr}
            onChange={(e) => {
              const v = e.target.value;
              setSelectedDate(v);
              setSelectedHour("");
            }}
          />

          <Select
            label="Hora"
            placeholder={
              !selectedDate ||
              isSunday(selectedDate) ||
              patientHasAppointmentSameDay
                ? "Selecione a data primeiro"
                : "Selecione o horário"
            }
            disabled={
              !selectedDate ||
              isSunday(selectedDate) ||
              patientHasAppointmentSameDay
            }
            options={hourOptions.map((o) => ({
              ...o,
              selected: o.value === selectedHour,
            }))}
            onChange={(val) => setSelectedHour(val)}
          />

          {patientHasAppointmentSameDay && (
            <Warning message="Paciente já possui consulta neste dia." />
          )}

          <Select
            label="Médico (opcional)"
            placeholder="Qualquer disponível"
            options={[
              {
                label: "Qualquer disponível",
                value: "",
                selected: selectedDoctor === "",
              },
              ...availableDoctorsForSelection.map((d) => ({
                ...d,
                selected: d.value === selectedDoctor,
              })),
            ]}
            onChange={(val) => setSelectedDoctor(val)}
            disabled={doctorUnavailable}
          />

          {doctorUnavailable && (
            <Warning message="Médico já possui consulta neste horário." />
          )}

          <Button onClick={handleCreateAppointment}>Salvar</Button>
        </Modal>
      )}

      {cancelModalOpen && cancelAppointment && (
        <Modal
          isOpen={true}
          onClickOutside={() => {
            setCancelModalOpen(false);
            setCancelAppointment(null);
          }}
        >
          <Modal.Title>Cancelar Consulta</Modal.Title>
          <Input
            label="Motivo"
            placeholder="Informe o motivo do cancelamento"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
          <Button
            onClick={async () => {
              if (!cancelReason.trim()) {
                setWarningMessage("Informe o motivo do cancelamento.");
                return;
              }
              const start = toDateTime(
                cancelAppointment.date,
                cancelAppointment.hour,
              );
              const canCancel =
                start.getTime() - Date.now() >= 24 * 60 * 60 * 1000;
              if (!canCancel) {
                setWarningMessage(
                  "Cancelamento permitido apenas com 24h de antecedência.",
                );
                return;
              }
              try {
                await deleteAppointment(
                  token,
                  cancelAppointment.id,
                  cancelReason.trim(),
                );
                setAppointments((prev) =>
                  prev.filter((a) => a.id !== cancelAppointment.id),
                );
                setCancelModalOpen(false);
                setCancelAppointment(null);
              } catch (error) {
                setWarningMessage(
                  error?.message ?? "Erro ao cancelar consulta.",
                );
              }
            }}
          >
            Confirmar Cancelamento
          </Button>
        </Modal>
      )}
    </div>
  );
};

export default Profile;
