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

export const getPatientAppointments = (token, patientId, status) => {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  const query = params.toString();
  const path = `/appointments/patient/${patientId}/my-consultations${
    query ? `?${query}` : ""
  }`;
  return apiRequest(path, { token });
};

export const getDoctorAppointments = (token, doctorId, status) => {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  const query = params.toString();
  const path = `/appointments/doctor/${doctorId}/my-consultations${
    query ? `?${query}` : ""
  }`;
  return apiRequest(path, { token });
};
