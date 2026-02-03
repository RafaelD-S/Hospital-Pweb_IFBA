import { apiRequest } from "./api";

export const getAppointments = (token) =>
  apiRequest("/appointments", { token });

export const createAppointment = (token, payload) =>
  apiRequest("/appointments", {
    method: "POST",
    token,
    body: payload,
  });

export const deleteAppointment = (token, id, cancelledReason) =>
  apiRequest(`/appointments/${id}`, {
    method: "DELETE",
    token,
    body: { cancelledReason },
  });

export const completeAppointment = (token, id) =>
  apiRequest(`/appointments/${id}/complete`, {
    method: "PATCH",
    token,
  });
