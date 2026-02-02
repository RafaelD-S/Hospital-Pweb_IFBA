import { useEffect, useMemo, useState } from "react";
import Modal from "../../components/modal/Modal";
import Input from "../../components/input/Input";
import Select from "../../components/select/select";
import Warning from "../../components/warning/Warning";
import Button from "../../components/button/Button";
import { useAuth } from "../../hooks/useAuth";

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
    () => pacients.filter((p) => !p.disabled),
    [pacients],
  );
  const activeDoctors = useMemo(
    () => doctors.filter((d) => !d.disabled),
    [doctors],
  );

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
      title: doctor?.name ?? "",
      description: doctor?.specialty ?? "",
      email: doctor?.email ?? "",
      telefone: doctor?.phone ?? "",
      crm: doctor?.crm ?? "",
      logradouro: address?.street ?? "",
      numero: address?.number ?? "",
      complemento: address?.complement ?? "",
      bairro: address?.neighborhood ?? "",
      cidade: address?.city ?? "",
      estado: address?.state ?? "",
      cep: address?.zipCode ?? "",
      disabled: doctor?.enabled === false || doctor?.active === false,
    };
  };

  const mapPacient = (pacient) => {
    const address = pacient?.address ?? {};
    return {
      id: pacient?.id ?? pacient?.patientId ?? pacient?.userId,
      title: pacient?.name ?? "",
      email: pacient?.email ?? "",
      telefone: pacient?.phone ?? "",
      cpf: pacient?.cpf ?? "",
      logradouro: address?.street ?? "",
      numero: address?.number ?? "",
      complemento: address?.complement ?? "",
      bairro: address?.neighborhood ?? "",
      cidade: address?.city ?? "",
      estado: address?.state ?? "",
      cep: address?.zipCode ?? "",
      disabled: pacient?.enabled === false || pacient?.active === false,
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

    return {
      id: appointment?.id ?? appointment?.appointmentId,
      pacientId: patient?.id ?? appointment?.patientId,
      doctorCrm: doctor?.crm ?? appointment?.doctorCrm,
      pacient: patient?.name ?? appointment?.patientName ?? "",
      doctor: doctor?.name ?? appointment?.doctorName ?? "",
      date,
      hour,
    };
  };

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

    const fetchDoctors = async () => {
      const response = await fetch(`${apiUrl}/doctors`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Não foi possível carregar médicos.");
      const data = await response.json();
      setDoctors(Array.isArray(data) ? data.map(mapDoctor) : []);
    };

    const fetchPacients = async () => {
      const response = await fetch(`${apiUrl}/patients`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Não foi possível carregar pacientes.");
      const data = await response.json();
      setPacients(Array.isArray(data) ? data.map(mapPacient) : []);
    };

    const fetchAppointments = async () => {
      const response = await fetch(`${apiUrl}/appointments`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Não foi possível carregar consultas.");
      const data = await response.json();
      setAppointments(Array.isArray(data) ? data.map(mapAppointment) : []);
    };

    const fetchAll = async () => {
      try {
        await Promise.all([
          fetchDoctors(),
          fetchPacients(),
          fetchAppointments(),
        ]);
      } catch (error) {
        setWarning(error?.message ?? "Não foi possível carregar dados.");
      }
    };

    if (token) fetchAll();
  }, [token]);

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
        label: d.title ? `${d.title} (${d.crm})` : (d.crm ?? ""),
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
        label: d.title ? `${d.title} (${d.crm})` : (d.crm ?? ""),
        value: d.crm ?? "",
      }));
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
        a.doctorCrm === doctorToAssign &&
        a.date === selectedDate &&
        a.hour === selectedHour,
    );
    if (conflict) {
      setWarning("Médico já possui consulta nesse horário.");
      return;
    }

    const registerAppointment = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
        const body = {
          patientId: Number(selectedPacient),
          appointmentTime: `${selectedDate}T${selectedHour}:00`,
        };
        if (doctorToAssign) body.doctorCrm = doctorToAssign;

        const response = await fetch(`${apiUrl}/appointments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          let message = "Erro ao agendar consulta.";
          try {
            const data = await response.json();
            message = data?.message ?? message;
          } catch {
            // noop
          }
          throw new Error(message);
        }

        const data = await response.json();
        if (data) {
          setAppointments((prev) => [mapAppointment(data), ...prev]);
        } else {
          const refresh = await fetch(`${apiUrl}/appointments`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (refresh.ok) {
            const list = await refresh.json();
            setAppointments(
              Array.isArray(list) ? list.map(mapAppointment) : [],
            );
          }
        }

        closeRegistration();
      } catch (error) {
        setWarning(error?.message ?? "Erro ao agendar consulta.");
      }
    };

    registerAppointment();
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
            const cancelApi = async () => {
              try {
                const apiUrl =
                  import.meta.env.VITE_API_URL ?? "http://localhost:8080";
                const response = await fetch(
                  `${apiUrl}/appointments/${cancelAppointment.id}`,
                  {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  },
                );

                if (!response.ok) {
                  let message = "Erro ao cancelar consulta.";
                  try {
                    const data = await response.json();
                    message = data?.message ?? message;
                  } catch {
                    // noop
                  }
                  throw new Error(message);
                }

                setAppointments((prev) =>
                  prev.filter((a) => a.id !== cancelAppointment.id),
                );
                setCancelModalOpen(false);
                setCancelAppointment(null);
              } catch (error) {
                setWarning(error?.message ?? "Erro ao cancelar consulta.");
              }
            };

            cancelApi();
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
