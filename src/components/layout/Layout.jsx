import { useNavigate } from "react-router-dom";
import Tab from "../tab/Tab";
import "./layout.styles.scss";
import { useAuth } from "../../hooks/useAuth";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const tabItems = [
    {
      label: "Médicos",
      value: "medicos",
      active: true,
    },
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
    ...(isAdmin
      ? [
          {
            label: "Pendências",
            value: "pendentes",
            active: false,
          },
        ]
      : []),
  ];

  const handleTabClick = (item) => {
    navigate(`/${item.value.toLowerCase()}`);
  };

  return (
    <div className="layout">
      <Tab items={tabItems} onClick={handleTabClick} />
      {children}
    </div>
  );
};

export default Layout;
