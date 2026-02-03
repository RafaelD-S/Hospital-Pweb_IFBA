import { useCallback, useEffect, useState } from "react";
import { login as loginRequest } from "../services/authService";

const TOKEN_KEY = "medsystem.token";
const USER_KEY = "medsystem.user";
const AUTH_EVENT = "medsystem.auth";

const readToken = () => localStorage.getItem(TOKEN_KEY) ?? "";

const readUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const decodeBase64Url = (input) => {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = "===".slice((base64.length + 3) % 4);
  return atob(base64 + pad);
};

const decodeJwt = (token) => {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    return JSON.parse(decodeBase64Url(payload));
  } catch {
    return null;
  }
};

const getRoleFromPayload = (payload) => {
  if (!payload) return null;
  if (typeof payload.role === "string") return payload.role;
  if (Array.isArray(payload.roles) && payload.roles[0]) return payload.roles[0];
  if (Array.isArray(payload.authorities) && payload.authorities[0])
    return payload.authorities[0];
  return null;
};

const dispatchAuthEvent = () => {
  window.dispatchEvent(new Event(AUTH_EVENT));
};

export function useAuth() {
  const [token, setToken] = useState(readToken());
  const [user, setUser] = useState(readUser());

  useEffect(() => {
    const syncAuth = () => {
      setToken(readToken());
      setUser(readUser());
    };

    window.addEventListener("storage", syncAuth);
    window.addEventListener(AUTH_EVENT, syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener(AUTH_EVENT, syncAuth);
    };
  }, []);

  const setSession = useCallback((newToken) => {
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken);
      const payload = decodeJwt(newToken);
      const role = getRoleFromPayload(payload);
      const email = payload?.sub ?? payload?.email ?? null;
      localStorage.setItem(USER_KEY, JSON.stringify({ role, email, payload }));
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }

    dispatchAuthEvent();
  }, []);

  const login = useCallback(
    async ({ email, password }) => {
      const data = await loginRequest(email, password);
      const newToken = data?.token;
      if (!newToken) throw new Error("Token não recebido");

      setSession(newToken);
      return newToken;
    },
    [setSession],
  );

  const logout = useCallback(() => {
    setSession("");
  }, [setSession]);

  const isAuthenticated = Boolean(token);
  const isAdmin = user?.role === "ADMIN";

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    login,
    logout,
  };
}
