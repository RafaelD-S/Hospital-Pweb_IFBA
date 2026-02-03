import { apiRequest } from "./api";

export const login = (email, password) =>
  apiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
  });

export const registerPatient = (payload) =>
  apiRequest("/auth/register/paciente", {
    method: "POST",
    body: payload,
  });

export const registerDoctor = (payload) =>
  apiRequest("/auth/register/medico", {
    method: "POST",
    body: payload,
  });

export const getSpecialties = () => apiRequest("/auth/specialties");

export const getMe = (token) => apiRequest("/auth/me", { token });
