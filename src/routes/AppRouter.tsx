import { Route, Routes } from "react-router-dom";
import Layout from "../components/layout/Layout";
import DoctorPage from "../pages/doctorPage/DoctorPage";
import AppointmentPage from "../pages/appointmentPage/AppointmentPage";
import PacientPage from "../pages/PacientPage/PacientPage";

const AppRouter = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<h1>Selecione uma opção</h1>} />
        <Route path="/medicos" element={<DoctorPage />} />
        <Route path="/pacientes" element={<PacientPage />} />
        <Route path="/consultas" element={<AppointmentPage />} />
      </Routes>
    </Layout>
  );
};

export default AppRouter;
