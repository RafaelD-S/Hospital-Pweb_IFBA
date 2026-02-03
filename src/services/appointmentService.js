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

const buildConsultationPath = (role, id, status) => {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  const query = params.toString();
  return `/appointments/${role}/${id}/my-consultations${query ? `?${query}` : ""}`;
};

export const getPatientAppointments = (token, patientId, status) =>
  apiRequest(buildConsultationPath("patient", patientId, status), { token });

export const getDoctorAppointments = (token, doctorId, status) =>
  apiRequest(buildConsultationPath("doctor", doctorId, status), { token });
