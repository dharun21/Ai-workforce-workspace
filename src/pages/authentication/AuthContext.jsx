import { useCallback, useContext, useMemo, useState, createContext } from "react";
import { DEMO_CREDENTIALS } from "./credentials";
const AuthContext = createContext(null);
const SESSION_KEY = "zengenai-workforce-session";
function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}
export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);
  const login = useCallback((email, password) => {
    if (
      email.trim().toLowerCase() !== DEMO_CREDENTIALS.email ||
      password !== DEMO_CREDENTIALS.password
    )
      return false;
    const next = {
      name: DEMO_CREDENTIALS.name,
      email: DEMO_CREDENTIALS.email,
      initials: DEMO_CREDENTIALS.initials,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    setUser(next);
    return true;
  }, []);
  const updateProfile = useCallback((changes) => {
    setUser((previous) => {
      const name = changes.name.trim();
      const next = {
        ...previous,
        ...changes,
        name,
        initials: name
          .split(/\s+/)
          .map((part) => part[0])
          .slice(0, 2)
          .join("")
          .toUpperCase(),
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(next));
      return next;
    });
  }, []);
  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);
  const value = useMemo(
    () => ({ user, login, updateProfile, logout }),
    [user, login, updateProfile, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  return useContext(AuthContext);
}
