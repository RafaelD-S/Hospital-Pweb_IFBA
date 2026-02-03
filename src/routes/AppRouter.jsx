import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import DoctorPage from "../pages/doctorPage/DoctorPage";
import AppointmentPage from "../pages/appointmentPage/AppointmentPage";
import PacientPage from "../pages/PacientPage/PacientPage";
import ProtectedRoutes from "../components/protectedRoutes/ProtectedRoutes";
import Login from "../pages/login/Login";
import Warning from "../components/warning/Warning";
import RegisterDoctor from "../pages/registerDoctor/RegisterDoctor";
import RegisterPacient from "../pages/registerPacient/RegisterPacient";
import PendingUsers from "../pages/pendingUsers/PendingUsers";
import { useAuth } from "../hooks/useAuth";
import Profile from "../pages/profile/Profile";

const AdminOnly = ({ children }) => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAdmin) {
    return (
      <Warning
        message="Acesso restrito ao administrador"
        action="Voltar"
        onActionClick={() =>
          navigate(location.state?.from ?? "/medicos", { replace: true })
        }
      />
    );
  }

  return children;
};

const PublicOnly = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/medicos" replace />;
  }

  return children;
};

const AppRouter = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnly>
            <Login />
          </PublicOnly>
        }
      />
      <Route
        path="/register/pacient"
        element={
          <PublicOnly>
            <RegisterPacient />
          </PublicOnly>
        }
      />
      <Route
        path="/register/doctor"
        element={
          <PublicOnly>
            <RegisterDoctor />
          </PublicOnly>
        }
      />
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
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/pacientes"
                element={
                  <AdminOnly>
                    <PacientPage />
                  </AdminOnly>
                }
              />
              <Route
                path="/consultas"
                element={
                  <AdminOnly>
                    <AppointmentPage />
                  </AdminOnly>
                }
              />
              <Route
                path="/pendentes"
                element={
                  <AdminOnly>
                    <PendingUsers />
                  </AdminOnly>
                }
              />
            </Routes>
          </ProtectedRoutes>
        }
      />
    </Routes>
  );
};

export default AppRouter;
