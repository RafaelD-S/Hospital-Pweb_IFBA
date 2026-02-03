import { apiRequest } from "./api";

export const getPatients = (token, all = true) =>
  apiRequest(all ? "/patients/all" : "/patients", { token });

export const updatePatient = (token, id, payload) =>
  apiRequest(`/patients/${id}`, {
    method: "PUT",
    token,
    body: payload,
  });
