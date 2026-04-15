"use client";

import {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
} from "react";

const AUTH_TOKEN_KEY = "inventory_admin_token";
const AUTH_ADMIN_KEY = "inventory_admin_user";

// Sync from localStorage as soon as the module runs on the client (no wait for useEffect)
function readFromStorage() {
  if (typeof window === "undefined") return { token: null, admin: null };
  let admin = null;
  try {
    const raw = localStorage.getItem(AUTH_ADMIN_KEY);
    if (raw) admin = JSON.parse(raw);
  } catch (_) {}
  return {
    token: localStorage.getItem(AUTH_TOKEN_KEY),
    admin,
  };
}

let clientToken = null;
let clientAdmin = null;
let listeners = new Set();

if (typeof window !== "undefined") {
  const stored = readFromStorage();
  clientToken = stored.token;
  clientAdmin = stored.admin;
}

// Cached snapshots so useSyncExternalStore doesn't see a new reference every time
const EMPTY_SNAPSHOT = { token: null, admin: null };
let cachedClientSnapshot = EMPTY_SNAPSHOT;

function getClientSnapshot() {
  if (clientToken === null && clientAdmin === null) {
    cachedClientSnapshot = EMPTY_SNAPSHOT;
    return EMPTY_SNAPSHOT;
  }
  if (
    cachedClientSnapshot !== EMPTY_SNAPSHOT &&
    cachedClientSnapshot.token === clientToken &&
    cachedClientSnapshot.admin === clientAdmin
  ) {
    return cachedClientSnapshot;
  }
  cachedClientSnapshot = { token: clientToken, admin: clientAdmin };
  return cachedClientSnapshot;
}

function getServerSnapshot() {
  return EMPTY_SNAPSHOT;
}

function subscribe(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function updateAuth(token, admin) {
  clientToken = token;
  clientAdmin = admin;
  if (typeof window !== "undefined") {
    if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
    else localStorage.removeItem(AUTH_TOKEN_KEY);
    if (admin) localStorage.setItem(AUTH_ADMIN_KEY, JSON.stringify(admin));
    else localStorage.removeItem(AUTH_ADMIN_KEY);
  }
  listeners.forEach((l) => l());
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const snapshot = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );
  const { token, admin } = snapshot;

  const login = useCallback((newToken, newAdmin) => {
    updateAuth(newToken, newAdmin);
  }, []);

  const logout = useCallback(() => {
    updateAuth(null, null);
  }, []);

  const value = {
    token,
    admin,
    loading: false,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
