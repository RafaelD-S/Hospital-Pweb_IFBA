import { Route, Routes, useNavigate } from "react-router-dom";
import DoctorPage from "../pages/doctorPage/DoctorPage";
import AppointmentPage from "../pages/appointmentPage/AppointmentPage";
import PacientPage from "../pages/PacientPage/PacientPage";
import ProtectedRoutes from "../components/protectedRoutes/ProtectedRoutes";
import Login from "../pages/login/Login";
import Warning from "../components/warning/Warning";
import Register from "../pages/register/Register";

const AppRouter = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="*"
        element={
          <ProtectedRoutes>
            <Routes>
              <Route
                path="*"
                element={
                  <Warning
                    message="Página não encontrada"
                    action="Voltar"
                    onActionClick={() => navigate("/medicos")}
                  />
                }
              />
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
