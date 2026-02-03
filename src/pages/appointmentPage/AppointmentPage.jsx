import { Fragment, useEffect, useMemo, useState } from "react";
import Button from "../../components/button/Button";
import Modal from "../../components/modal/Modal";
import Input from "../../components/input/Input";
import Select from "../../components/select/select";
import Remove from "../../assets/remove.svg";
import Confirm from "../../assets/confirm.svg";

import Warning from "../../components/warning/Warning";
import { useAuth } from "../../hooks/useAuth";
import { getDoctors } from "../../services/doctorService";
import { getPatients } from "../../services/patientService";
import {
  createAppointment,
  deleteAppointment,
  completeAppointment,
  getAppointments,
} from "../../services/appointmentService";
import ListItem from "../../components/listItem/listItem";
import EmptyPage from "../../components/emptyPage/emptyPage";
import "./appointmentPage.styles.scss";

const toDateTime = (date, hour) => new Date(`${date}T${hour}:00`);

const isSunday = (dateStr) => {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.getDay() === 0;
};

const withinBusinessHours = (hour) => {
  const h = parseInt(hour.split(":")[0], 10);
  return h >= 7 && h <= 18;
};

const formatDateBR = (dateStr) => {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString();
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

const AppointmentPage = () => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [pacients, setPacients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelAppointment, setCancelAppointment] = useState(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedPacient, setSelectedPacient] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const todayStr = new Date().toLocaleDateString("en-CA");

  const parseAppointmentTime = (dateTime) => {
    if (!dateTime) return { date: "", hour: "" };
    const d = new Date(dateTime);
    if (Number.isNaN(d.getTime())) return { date: "", hour: "" };
    const date = d.toLocaleDateString("en-CA");
    const hour = d.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return { date, hour };
  };

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

  const mapPacient = (pacient) => {
    const address = pacient?.address ?? {};
    return {
      id: pacient?.id ?? pacient?.patientId ?? pacient?.userId,
      name: pacient?.name ?? "",
      email: pacient?.email ?? "",
      phone: pacient?.phone ?? "",
      cpf: pacient?.cpf ?? "",
      address,
      disabled: pacient?.status === false,
    };
  };

  const mapAppointment = (appointment) => {
    const patient = appointment?.patient ?? appointment?.pacient;
    const doctor = appointment?.doctor ?? {};
    const time =
      appointment?.appointmentTime ??
      appointment?.dateTime ??
      appointment?.time;
    const { date, hour } = parseAppointmentTime(time);

    console.log(appointment);

    return {
      id: appointment?.id ?? appointment?.appointmentId,
      pacientId: patient?.id ?? appointment?.patientId,
      doctorCrm: doctor?.crm ?? appointment?.doctorCrm,
      pacient: patient?.name ?? appointment?.patientName ?? "",
      doctor: doctor?.name ?? appointment?.doctorName ?? "",
      status: appointment?.status ?? "",
      date,
      hour,
    };
  };

  useEffect(() => {
    const normalizeList = (data) =>
      Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
          ? data.content
          : [];

    const fetchAll = async () => {
      try {
        const [doctorData, pacientData, appointmentData] = await Promise.all([
          getDoctors(token, true),
          getPatients(token, true),
          getAppointments(token),
        ]);

        setDoctors(normalizeList(doctorData).map(mapDoctor));
        setPacients(normalizeList(pacientData).map(mapPacient));
        setAppointments(normalizeList(appointmentData).map(mapAppointment));
      } catch (error) {
        setWarningMessage(error?.message ?? "Não foi possível carregar dados.");
      }
    };

    if (token) fetchAll();
  }, [token]);

  const activePacients = useMemo(
    () => pacients.filter((p) => !p.disabled),
    [pacients],
  );
  const activeDoctors = useMemo(
    () => doctors.filter((d) => !d.disabled),
    [doctors],
  );

  const patientHasAppointmentSameDay = useMemo(() => {
    if (!selectedPacient || !selectedDate) return false;
    return appointments.some(
      (a) =>
        String(a.pacientId) === String(selectedPacient) &&
        a.date === selectedDate,
    );
  }, [appointments, selectedPacient, selectedDate]);

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
        label: d.name ? `${d.name} (${d.crm})` : (d.crm ?? ""),
        value: d.crm ?? "",
      }));
  }, [activeDoctors, appointments, selectedDate, selectedHour]);

  const listItems = useMemo(
    () =>
      appointments.map((a) => ({
        ...a,
        title: a.pacient,
        subtitle: a.doctor,
        description: `${formatDateBR(a.date)} ${a.hour}`,
      })),
    [appointments],
  );

  const openCreateModal = () => {
    setSelectedDate("");
    setSelectedHour("");
    setSelectedPacient("");
    setSelectedDoctor("");
    setIsModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsModalOpen(false);
  };

  const openCancelModal = (appointment) => {
    setCancelAppointment(appointment);
    setCancelReason("");
    setCancelModalOpen(true);
  };

  const handleCreateAppointment = async () => {
    if (!selectedDate)
      return setWarningMessage("Selecione a data da consulta.");
    if (isSunday(selectedDate))
      return setWarningMessage("Atendimentos apenas de segunda a sábado.");
    if (!selectedHour || !withinBusinessHours(selectedHour))
      return setWarningMessage("Selecione um horário entre 07:00 e 18:00.");
    if (!selectedPacient) return setWarningMessage("Selecione um paciente.");

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
        patientId: Number(selectedPacient),
        appointmentTime: `${selectedDate}T${selectedHour}:00`,
      };
      if (doctorToAssign) payload.doctorCrm = doctorToAssign;

      const data = await createAppointment(token, payload);
      if (data) {
        setAppointments((prev) => [mapAppointment(data), ...prev]);
      } else {
        const list = await getAppointments(token);
        setAppointments(Array.isArray(list) ? list.map(mapAppointment) : []);
      }

      closeCreateModal();
    } catch (error) {
      setWarningMessage(error?.message ?? "Erro ao agendar consulta.");
    }
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
      setWarningMessage(
        error?.message ?? "Erro ao concluir consulta.",
      );
    }
  };

  return (
    <div className="appointment-page">
      <header className="appointment-page__header">
        <h2 className="appointment-page__title">Consultas</h2>
        <Button onClick={openCreateModal}>Nova consulta</Button>
      </header>

      <div className="appointment-page__content">
        {listItems.map((item) => {
          const textClasses = [];
          if (item.status === "CANCELLED")
            textClasses.push("appointment-page__cancelled");
          if (item.status === "COMPLETED")
            textClasses.push("appointment-page__completed");
          if (item.status === "SCHEDULED")
            textClasses.push("appointment-page__scheduled");

          return (
            <Fragment key={item.id}>
              <ListItem
                title={item.title}
                subtitle={item.subtitle}
                description={item.description}
              >
                <div className={textClasses.join(" ")}>{item.status}</div>
                {item.status === "SCHEDULED" && (
                  <>
                    <img
                      src={Confirm}
                      alt="Confirm"
                      onClick={() => handleCompleteAppointment(item)}
                    />
                    <img
                      src={Remove}
                      alt="Remove"
                      onClick={() => openCancelModal(item)}
                    />
                  </>
                )}
              </ListItem>
            </Fragment>
          );
        })}
      </div>

      {listItems.length === 0 && (
        <EmptyPage
          title="Nenhuma consulta encontrada"
          description="Não há consultas cadastradas no momento."
        />
      )}

      {isModalOpen && (
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
            label="Paciente"
            options={activePacients.map((p) => ({
              label: p.name ?? "",
              value: String(p.id ?? ""),
              selected: String(p.id ?? "") === String(selectedPacient),
            }))}
            onChange={(val) => setSelectedPacient(val)}
          />

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

export default AppointmentPage;
