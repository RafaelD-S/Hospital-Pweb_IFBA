export const toDateTime = (date, hour) => new Date(`${date}T${hour}:00`);

export const isSunday = (dateStr) => {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.getDay() === 0;
};

export const withinBusinessHours = (hour) => {
  const h = parseInt(hour.split(":")[0], 10);
  return h >= 7 && h <= 18;
};

export const formatDateBR = (dateTime) => {
  const safeDateTime =
    typeof dateTime === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateTime)
      ? `${dateTime}T00:00:00`
      : dateTime;
  const d = new Date(safeDateTime);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString();
};

export const formatHourBR = (dateTime) => {
  const d = new Date(dateTime);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const parseAppointmentTime = (dateTime) => {
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

export const businessHoursOptions = (dateStr) => {
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
