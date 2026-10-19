import { apiClient } from "./client";

let pendingUserListRequest;

function listUsers() {
  if (!pendingUserListRequest) {
    pendingUserListRequest = apiClient
      .get("/admin/users")
      .then(({ data }) => data)
      .finally(() => {
        pendingUserListRequest = undefined;
      });
  }
  return pendingUserListRequest;
}

export const adminApi = {
  listUsers,
  updateUserAccess: async (userId, specialistKey, settings) =>
    (await apiClient.put(`/admin/users/${userId}/access/${specialistKey}`, settings)).data,
};
