import { Route, Routes } from "react-router-dom";
import DoctorPage from "../pages/doctorPage/DoctorPage";
import AppointmentPage from "../pages/appointmentPage/AppointmentPage";
import PacientPage from "../pages/PacientPage/PacientPage";
import ProtectedRoutes from "../components/protectedRoutes/ProtectedRoutes";
import Login from "../pages/login/Login";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="*"
        element={
          <ProtectedRoutes>
            <Routes>
              <Route path="/medicos" element={<DoctorPage />} />
              <Route path="/pacientes" element={<PacientPage />} />
              <Route path="/consultas" element={<AppointmentPage />} />
            </Routes>
          </ProtectedRoutes>
        }
      />
    </Routes>
  );
};

export default AppRouter;
