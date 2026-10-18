import { useCallback, useContext, useMemo, useState, createContext } from "react";
import { clearApiSession, loginRequest, readApiUser, registerRequest, updateProfileRequest } from "../../api/auth";
import { useEffect } from "react";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    localStorage.getItem("zengenai-api-access-token") ? readApiUser() : null,
  );
  useEffect(() => {
    const handleExpiredSession = () => setUser(null);
    window.addEventListener("zengenai:session-expired", handleExpiredSession);
    return () => window.removeEventListener("zengenai:session-expired", handleExpiredSession);
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
    () => ({ user, login, register, updateProfile, logout }),
    [user, login, register, updateProfile, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  return useContext(AuthContext);
}
