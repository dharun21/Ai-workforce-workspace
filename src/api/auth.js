import { apiClient, ACCESS_TOKEN_KEY } from "./client";

const USER_KEY = "zengenai-api-user";

function withInitials(user) {
  if (!user) return null;
  return {
    ...user,
    initials: user.name
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase(),
  };
}

export function readApiUser() {
  try {
    return withInitials(JSON.parse(localStorage.getItem(USER_KEY)));
  } catch {
    return null;
  }
}

async function authenticate(path, payload) {
  const { data } = await apiClient.post(`/auth/${path}`, payload);
  localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
  const user = withInitials(data.user);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export const loginRequest = (email, password) => authenticate("login", { email, password });
export const registerRequest = (name, email, password) =>
  authenticate("register", { name, email, password });

export async function updateProfileRequest(name) {
  const { data } = await apiClient.patch("/auth/me", { name });
  const user = withInitials(data);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export function clearApiSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
