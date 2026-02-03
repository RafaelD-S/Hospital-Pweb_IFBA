import { apiRequest } from "./api";

export const getPendingUsers = (token) =>
  apiRequest("/admin/pending-users", { token });

export const approveUser = (token, userId, approved) =>
  apiRequest("/admin/approve-user", {
    method: "POST",
    token,
    body: { userId, approved },
  });
