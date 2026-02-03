import { useNavigate } from "react-router-dom";
import Tab from "../tab/Tab";
import "./layout.styles.scss";
import { useAuth } from "../../hooks/useAuth";
import Button from "../button/Button";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { isAdmin, logout } = useAuth();

  const tabItems = [
    {
      label: "Médicos",
      value: "medicos",
      active: true,
    },
    ...(isAdmin
      ? [
          {
            label: "Pacientes",
            value: "pacientes",
            active: false,
          },
          {
            label: "Consultas",
            value: "consultas",
            active: false,
          },
          {
            label: "Pendências",
            value: "pendentes",
            active: false,
          },
        ]
      : [
          {
            label: "Perfil",
            value: "profile",
            active: false,
          },
        ]),
  ];

  const handleTabClick = (item) => {
    navigate(`/${item.value.toLowerCase()}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="layout">
      <Tab items={tabItems} onClick={handleTabClick} />
      {children}
      {isAdmin && (
        <Button value="error" onClick={logout}>
          Sair
        </Button>
      )}
    </div>
  );
};

export default Layout;
