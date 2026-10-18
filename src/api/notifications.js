import { apiClient } from "./client";

export const notificationsApi = {
  list: async () => (await apiClient.get("/notifications")).data,
  markRead: async (id) => (await apiClient.patch(`/notifications/${id}/read`)).data,
  markAllRead: async () => apiClient.post("/notifications/read-all"),
};
