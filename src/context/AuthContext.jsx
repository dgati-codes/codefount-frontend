import { createContext, useContext, useState } from 'react';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    if (email && password) {
      setUser({ email, name: email.split('@')[0], enrolled: [] });
      return { ok: true };
    }
    return { ok: false, error: 'Invalid credentials' };
  };

  const register = (data) => {
    setUser({ email: data.email, name: data.name || data.email.split('@')[0], enrolled: [] });
    return { ok: true };
  };

  const logout = () => setUser(null);

  return <AuthCtx.Provider value={{ user, login, register, logout }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);