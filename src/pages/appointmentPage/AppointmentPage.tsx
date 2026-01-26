import List from "../../components/list/List";

const AppointmentPage = () => {
  const appointmentMock = [
    {
      title: "Ortopedista",
      description: "Dr. João Silva - 10/10/2024",
    },
    {
      title: "Cardiologista",
      description: "Dra. Maria Oliveira - 12/10/2024",
    },
    {
      title: "Neurologista",
      description: "Dr. Pedro Santos - 15/10/2024",
    },
  ];

  return (
    <div className="appointment-page">
      <List items={appointmentMock} registrationTitle="Cadastrar Consulta" />
    </div>
  );
};

export default AppointmentPage;
