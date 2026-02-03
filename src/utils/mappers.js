export const mapDoctor = (doctor) => {
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

export const mapPacient = (pacient) => {
  const address = pacient?.address ?? {};
  return {
    id: pacient?.id ?? pacient?.patientId ?? pacient?.userId,
    name: pacient?.name ?? "",
    email: pacient?.email ?? "",
    cpf: pacient?.cpf ?? "",
    phone: pacient?.phone ?? "",
    address,
    disabled: pacient?.status === false,
  };
};
