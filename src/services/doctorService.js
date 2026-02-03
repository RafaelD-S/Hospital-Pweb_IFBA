import { apiRequest } from "./api";

export const getDoctors = (token, all = true) =>
  apiRequest(all ? "/doctors/all" : "/doctors", { token });

export const updateDoctor = (token, id, payload) =>
  apiRequest(`/doctors/${id}`, {
    method: "PUT",
    token,
    body: payload,
  });
