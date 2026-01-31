import { useMemo, useState } from "react";
import List from "../../components/list/List";
import Modal from "../../components/modal/Modal";
import Input from "../../components/input/Input";
import Select from "../../components/select/select";
import Warning from "../../components/warning/Warning";
import Button from "../../components/button/Button";
import { doctorsMock } from "../../mocks/doctor.mock";
import { pacientMock } from "../../mocks/pacient.mock";

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
  const [appointments, setAppointments] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedPacient, setSelectedPacient] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const todayStr = new Date().toLocaleDateString("en-CA");

  const [warning, setWarning] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelAppointment, setCancelAppointment] = useState(null);

  const activePacients = useMemo(
    () => pacientMock.filter((p) => !p.disabled),
    [],
  );
  const activeDoctors = useMemo(
    () => doctorsMock.filter((d) => !d.disabled),
    [],
  );

  const patientHasAppointmentSameDay = useMemo(() => {
    if (!selectedPacient || !selectedDate) return false;
    return appointments.some(
      (a) => a.pacient === selectedPacient && a.date === selectedDate,
    );
  }, [appointments, selectedPacient, selectedDate]);

  const doctorUnavailable = useMemo(() => {
    if (!selectedDoctor || !selectedDate || !selectedHour) return false;
    return appointments.some(
      (a) =>
        a.doctor === selectedDoctor &&
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
        label: d.title ?? "",
        value: d.title ?? "",
      }));
    const booked = new Set(
      appointments
        .filter((a) => a.date === selectedDate && a.hour === selectedHour)
        .map((a) => a.doctor),
    );
    return activeDoctors
      .filter((d) => !booked.has(d.title ?? ""))
      .map((d) => ({ label: d.title ?? "", value: d.title ?? "" }));
  }, [activeDoctors, appointments, selectedDate, selectedHour]);

  const listItems = useMemo(
    () =>
      appointments.map((a) => ({
        ...a,
        title: a.pacient,
        description: `${a.doctor} - ${formatDateBR(a.date)} ${a.hour}`,
      })),
    [appointments],
  );

  const resetForm = () => {
    setSelectedDate("");
    setSelectedHour("");
    setSelectedPacient("");
    setSelectedDoctor("");
  };

  const openRegistration = () => {
    resetForm();
    setIsOpen(true);
  };

  const closeRegistration = () => {
    setIsOpen(false);
    setWarning(null);
  };

  const validateAndSubmit = () => {
    if (!selectedDate) {
      setWarning("Selecione a data da consulta.");
      return;
    }
    if (isSunday(selectedDate)) {
      setWarning("Atendimentos apenas de segunda a sábado.");
      return;
    }
    if (!selectedHour || !withinBusinessHours(selectedHour)) {
      setWarning("Selecione um horário entre 07:00 e 18:00.");
      return;
    }
    if (!selectedPacient) {
      setWarning("Selecione um paciente.");
      return;
    }
    const start = toDateTime(selectedDate, selectedHour);
    if (start.getTime() - Date.now() < 30 * 60 * 1000) {
      setWarning("Agende com pelo menos 30 minutos de antecedência.");
      return;
    }
    if (patientHasAppointmentSameDay) {
      setWarning("Paciente já possui consulta nesse dia.");
      return;
    }

    let doctorToAssign = selectedDoctor;
    const allAvailableDoctors = availableDoctorsForSelection.map(
      (d) => d.value,
    );
    if (!doctorToAssign) {
      doctorToAssign = allAvailableDoctors[0] ?? "";
      if (!doctorToAssign) {
        setWarning("Nenhum médico disponível para esse horário.");
        return;
      }
    }

    const conflict = appointments.some(
      (a) =>
        a.doctor === doctorToAssign &&
        a.date === selectedDate &&
        a.hour === selectedHour,
    );
    if (conflict) {
      setWarning("Médico já possui consulta nesse horário.");
      return;
    }

    setAppointments((prev) => [
      ...prev,
      {
        id: `${selectedDate}-${selectedHour}-${selectedPacient}`,
        pacient: selectedPacient,
        doctor: doctorToAssign,
        date: selectedDate,
        hour: selectedHour,
      },
    ]);

    closeRegistration();
  };

  return (
    <div className="appointment-page">
      <List
        items={listItems}
        hasEditButton={false}
        registrationTitle="Cadastrar Consulta"
        onRegistrationClick={openRegistration}
        onRemoveClick={(item) => {
          const start = toDateTime(item.date, item.hour);
          const canCancel = start.getTime() - Date.now() >= 24 * 60 * 60 * 1000;
          if (!canCancel) {
            setWarning(
              "Cancelamento permitido apenas com 24h de antecedência.",
            );
            return;
          }
          const found = appointments.find((a) => a.id === item.id);
          if (found) {
            setCancelAppointment(found);
            setCancelReason("");
            setCancelModalOpen(true);
          }
        }}
      />

      {isOpen && (
        <Modal
          isOpen={true}
          onClickOutside={closeRegistration}
          onSubmit={validateAndSubmit}
        >
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
              label: p.title ?? "",
              value: p.title ?? "",
              selected: (p.title ?? "") === selectedPacient,
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

          <Button type="submit">Salvar</Button>
        </Modal>
      )}

      {warning && (
        <Warning
          message={warning}
          action="Fechar"
          onActionClick={() => setWarning(null)}
        />
      )}

      {cancelModalOpen && cancelAppointment && (
        <Modal
          isOpen={true}
          onClickOutside={() => {
            setCancelModalOpen(false);
            setCancelAppointment(null);
          }}
          onSubmit={() => {
            if (!cancelReason) {
              setWarning("Informe o motivo do cancelamento.");
              return;
            }
            setAppointments((prev) =>
              prev.filter(
                (a) =>
                  !(
                    a.pacient === cancelAppointment.pacient &&
                    a.doctor === cancelAppointment.doctor &&
                    a.date === cancelAppointment.date &&
                    a.hour === cancelAppointment.hour
                  ),
              ),
            );
            setCancelModalOpen(false);
            setCancelAppointment(null);
          }}
        >
          <Modal.Title>Cancelar Consulta</Modal.Title>

          <Select
            label="Motivo do cancelamento"
            placeholder="Selecione o motivo"
            options={[
              {
                label: "Paciente cancelou",
                value: "pacient",
                selected: cancelReason === "pacient",
              },
              {
                label: "Médico cancelou",
                value: "doctor",
                selected: cancelReason === "doctor",
              },
              {
                label: "Outro",
                value: "other",
                selected: cancelReason === "other",
              },
            ]}
            onChange={(val) => setCancelReason(val)}
          />

          <Button type="submit">Confirmar Cancelamento</Button>
        </Modal>
      )}
    </div>
  );
};

export default AppointmentPage;
