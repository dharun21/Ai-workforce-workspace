import { apiClient } from "./client";

// React StrictMode can mount effects twice in development. Share only concurrent
// identical reads; settled responses are never cached, so later refreshes stay fresh.
const pendingGets = new Map();

function getOnce(key, url) {
  if (!pendingGets.has(key)) {
    const request = apiClient.get(url).then((response) => response.data).finally(() => pendingGets.delete(key));
    pendingGets.set(key, request);
  }
  return pendingGets.get(key);
}

export const chatApi = {
  listConversations: () => getOnce("conversations", "/chat/conversations"),
  createConversation: async (title, domain = "general") =>
    (await apiClient.post("/chat/conversations", { title, domain })).data,
  getMessages: (conversationId) =>
    getOnce(`messages:${conversationId}`, `/chat/conversations/${conversationId}/messages`),
  sendMessage: async (payload) => (await apiClient.post("/chat/send", {
    ...payload,
  }, { timeout: 150000 })).data,
  deleteConversation: async (conversationId) =>
    (await apiClient.delete(`/chat/conversations/${conversationId}`)).data,
};
