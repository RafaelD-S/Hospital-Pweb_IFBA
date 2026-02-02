import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Layout from "../layout/Layout";

const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true, state: { from: location.pathname } });
    } else if (location.pathname === "/") {
      navigate("/medicos", { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  return isAuthenticated ? <Layout>{children}</Layout> : null;
};

export default ProtectedRoutes;
