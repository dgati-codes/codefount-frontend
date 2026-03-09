/**
 * context/AuthContext.jsx
 * ========================
 * Real JWT authentication context.
 *
 * On mount: rehydrates user from stored token via GET /auth/me.
 * Exposes: login, register, logout, updateUser, uploadAvatar, changePassword.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { auth as authApi, token } from "../api/api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from stored token on page load
  useEffect(() => {
    const stored = token.getAccess();
    if (!stored) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((u) => setUser(u))
      .catch(() => token.clear())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const data = await authApi.login(email, password);
      token.set(data.access_token, data.refresh_token);
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      const msg = err.response?.data?.detail || "Invalid email or password";
      return { ok: false, error: String(msg) };
    }
  }, []);

  const register = useCallback(async (formData) => {
    try {
      const data = await authApi.register(formData);
      token.set(data.access_token, data.refresh_token);
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg = Array.isArray(detail)
        ? detail.map((d) => d.msg).join(", ")
        : detail || "Registration failed";
      return { ok: false, error: String(msg) };
    }
  }, []);

  const logout = useCallback(() => {
    token.clear();
    setUser(null);
  }, []);

  const updateUser = useCallback(async (data) => {
    try {
      const updated = await authApi.updateMe(data);
      setUser(updated);
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: err.response?.data?.detail || "Update failed",
      };
    }
  }, []);

  const uploadAvatar = useCallback(async (file) => {
    try {
      const updated = await authApi.uploadAvatar(file);
      setUser(updated);
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: err.response?.data?.detail || "Upload failed",
      };
    }
  }, []);

  const changePassword = useCallback(async (current, next) => {
    try {
      await authApi.changePassword(current, next);
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: err.response?.data?.detail || "Password change failed",
      };
    }
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "var(--body)",
          color: "var(--ink-2)",
          gap: "0.5rem",
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            border: "2px solid var(--teal)",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }}
        />
        Loading…
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <AuthCtx.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        uploadAvatar,
        changePassword,
        isAdmin: user?.role === "admin",
        isTrainer: user?.role === "trainer",
        isStudent: user?.role === "student",
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
