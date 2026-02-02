import { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import Warning from "../../components/warning/Warning";
import { useAuth } from "../../hooks/useAuth";
import "./pendingUsers.styles.scss";
import EmptyPage from "../../components/emptyPage/emptyPage";

const PendingUsers = () => {
  const { token, isAdmin } = useAuth();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [warningMessage, setWarningMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const mapUser = (user) => ({
    id: user?.id ?? user?.userId,
    name: user?.name ?? user?.fullName ?? "",
    email: user?.email ?? "",
    role: user?.role ?? user?.userRole ?? "",
  });

  const fetchPendingUsers = async () => {
    if (!token || !isAdmin) return;
    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
      const response = await fetch(`${apiUrl}/admin/pending-users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Não foi possível carregar usuários pendentes.");
      }

      const data = await response.json();
      const list = Array.isArray(data) ? data.map(mapUser) : [];
      setPendingUsers(list);
    } catch (error) {
      setWarningMessage(
        error?.message ?? "Não foi possível carregar usuários pendentes.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, [token, isAdmin]);

  const handleApproval = async (userId, approved) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
      const response = await fetch(`${apiUrl}/admin/approve-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, approved }),
      });

      if (!response.ok) {
        let message = "Não foi possível atualizar o usuário.";
        try {
          const data = await response.json();
          message = data?.message ?? message;
        } catch {}
        throw new Error(message);
      }

      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error) {
      setWarningMessage(
        error?.message ?? "Não foi possível atualizar o usuário.",
      );
    }
  };

  return (
    <div className="pending-users">
      <header className="pending-users__header">
        <h2 className="pending-users__title">Usuários pendentes</h2>
        <Button onClick={fetchPendingUsers} disabled={isLoading}>
          Atualizar
        </Button>
      </header>

      {pendingUsers.length === 0 && !isLoading && (
        <EmptyPage
          title="Nenhum usuário pendente."
          description="Não há usuários aguardando aprovação no momento. Atualize a página para verificar novamente."
        />
      )}

      <div className="pending-users__list">
        {pendingUsers.map((user) => (
          <div className="pending-users__item" key={user.id}>
            <div className="pending-users__info">
              <strong>{user.name || "Usuário"}</strong>
              <span>{user.email}</span>
              <span className="pending-users__role">{user.role}</span>
            </div>
            <div className="pending-users__actions">
              <Button onClick={() => handleApproval(user.id, true)}>
                Aprovar
              </Button>
              <Button
                value="error"
                onClick={() => handleApproval(user.id, false)}
              >
                Recusar
              </Button>
            </div>
          </div>
        ))}
      </div>

      {warningMessage && (
        <Warning
          message={warningMessage}
          action="Fechar"
          onActionClick={() => setWarningMessage("")}
        />
      )}
    </div>
  );
};

export default PendingUsers;
