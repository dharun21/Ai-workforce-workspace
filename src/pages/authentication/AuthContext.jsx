import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  clearApiSession,
  getCurrentUserRequest,
  loginRequest,
  readApiUser,
  registerRequest,
  updateProfileRequest,
} from "../../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const hasToken = Boolean(localStorage.getItem("zengenai-api-access-token"));
  const [user, setUser] = useState(() => hasToken ? readApiUser() : null);
  const [loading, setLoading] = useState(hasToken);
  const hydrationStarted = useRef(false);

  useEffect(() => {
    const handleExpiredSession = () => setUser(null);
    window.addEventListener("zengenai:session-expired", handleExpiredSession);
    return () => window.removeEventListener("zengenai:session-expired", handleExpiredSession);
  }, []);

  useEffect(() => {
    if (hydrationStarted.current) return;
    hydrationStarted.current = true;
    if (!localStorage.getItem("zengenai-api-access-token")) {
      setLoading(false);
      return;
    }
    getCurrentUserRequest()
      .then(setUser)
      .catch(() => {
        clearApiSession();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const account = await loginRequest(email.trim(), password);
    setUser(account);
    return account;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const account = await registerRequest(name.trim(), email.trim(), password);
    setUser(account);
    return account;
  }, []);

  const updateProfile = useCallback(async (changes) => {
    const account = await updateProfileRequest(changes.name.trim());
    setUser(account);
    return account;
  }, []);

  const logout = useCallback(() => {
    clearApiSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, updateProfile, logout }),
    [user, loading, login, register, updateProfile, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
