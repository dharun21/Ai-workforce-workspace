import { apiClient } from "./client";

export const onboardingApi = {
  start: async () => (await apiClient.get("/onboarding/start")).data,
  submit: async (answer) => (await apiClient.post("/onboarding/submit", answer)).data,
  getSession: async () => (await apiClient.get("/onboarding/session")).data,
  getProfile: async () => (await apiClient.get("/onboarding/profile")).data,
  updateProfile: async (profile) => (await apiClient.put("/onboarding/profile", profile)).data,
};