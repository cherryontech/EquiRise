import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "./api.js";

const AuthContext = createContext(null);

/**
 * status: "loading" | "SIGNED_IN" | "EXPIRED" | "NEW"
 * Mirrors the Entry logic table; the server decides which one applies.
 */
export function AuthProvider({ children }) {
  const [state, setState] = useState({ status: "loading", user: null });

  useEffect(() => {
    api
      .session()
      .then((s) => setState({ status: s.status, user: s.user }))
      .catch(() => setState({ status: "NEW", user: null }));
  }, []);

  const signIn = useCallback(async (email, password) => {
    const user = await api.login(email, password);
    setState({ status: "SIGNED_IN", user });
  }, []);

  const signOut = useCallback(async () => {
    await api.logout().catch(() => {});
    // The device has signed in before, so the next visit lands on "Welcome back".
    setState({ status: "EXPIRED", user: null });
  }, []);

  const value = useMemo(() => ({ ...state, signIn, signOut }), [state, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
