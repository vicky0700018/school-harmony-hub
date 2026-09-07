import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { KEYS, read, write, uid, exportAll, importAll } from "@/services/storage";
import { ensureSeed, resetSeed } from "@/data/seed";

const AppContext = createContext(null);

const COLLECTIONS = [
  "students",
  "teachers",
  "staff",
  "classes",
  "subjects",
  "feeStructure",
  "fees",
  "payments",
  "attendance",
  "staffAttendance",
  "exams",
  "marks",
  "notices",
  "admissions",
  "timetable",
  "payroll",
  "certificates",
];

function emptyState() {
  const s = {};
  COLLECTIONS.forEach((c) => (s[c] = []));
  s.settings = {};
  s.users = [];
  return s;
}

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [db, setDb] = useState(emptyState);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("dark");

  // Hydrate on the client only (localStorage is unavailable during SSR).
  useEffect(() => {
    ensureSeed();
    const next = emptyState();
    COLLECTIONS.forEach((c) => (next[c] = read(KEYS[c], [])));
    next.settings = read(KEYS.settings, {});
    next.users = read(KEYS.users, []);
    setDb(next);
    setUser(read(KEYS.session, null));
    const t = read(KEYS.theme, "dark");
    setTheme(t);
    setReady(true);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.toggle("light", theme === "light");
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const persist = useCallback((key, value) => {
    write(KEYS[key], value);
    setDb((prev) => ({ ...prev, [key]: value }));
  }, []);

  const insert = useCallback(
    (key, record) => {
      const item = { id: record.id || uid(key.slice(0, 3)), ...record };
      const list = read(KEYS[key], []);
      const next = [item, ...list];
      write(KEYS[key], next);
      setDb((prev) => ({ ...prev, [key]: next }));
      return item;
    },
    [],
  );

  const update = useCallback((key, id, patch) => {
    const list = read(KEYS[key], []);
    const next = list.map((x) => (x.id === id ? { ...x, ...patch } : x));
    write(KEYS[key], next);
    setDb((prev) => ({ ...prev, [key]: next }));
  }, []);

  const upsert = useCallback((key, record) => {
    const list = read(KEYS[key], []);
    const exists = list.some((x) => x.id === record.id);
    const next = exists ? list.map((x) => (x.id === record.id ? { ...x, ...record } : x)) : [record, ...list];
    write(KEYS[key], next);
    setDb((prev) => ({ ...prev, [key]: next }));
    return record;
  }, []);

  const remove = useCallback((key, id) => {
    const list = read(KEYS[key], []);
    const next = list.filter((x) => x.id !== id);
    write(KEYS[key], next);
    setDb((prev) => ({ ...prev, [key]: next }));
  }, []);

  const saveSettings = useCallback((patch) => {
    const next = { ...read(KEYS.settings, {}), ...patch };
    write(KEYS.settings, next);
    setDb((prev) => ({ ...prev, settings: next }));
  }, []);

  const login = useCallback((username, password, role) => {
    const users = read(KEYS.users, []);
    const found = users.find(
      (u) =>
        (u.username.toLowerCase() === String(username).trim().toLowerCase() ||
          u.email.toLowerCase() === String(username).trim().toLowerCase()) &&
        u.password === password &&
        (!role || u.role === role),
    );
    if (!found) return { ok: false, error: "Invalid credentials for the selected role." };
    const session = { id: found.id, name: found.name, role: found.role, username: found.username };
    write(KEYS.session, session);
    setUser(session);
    return { ok: true, user: session };
  }, []);

  const logout = useCallback(() => {
    write(KEYS.session, null);
    setUser(null);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      write(KEYS.theme, next);
      return next;
    });
  }, []);

  const restoreAll = useCallback((payload) => {
    importAll(payload);
    const next = emptyState();
    COLLECTIONS.forEach((c) => (next[c] = read(KEYS[c], [])));
    next.settings = read(KEYS.settings, {});
    next.users = read(KEYS.users, []);
    setDb(next);
  }, []);

  const factoryReset = useCallback(() => {
    resetSeed();
    const next = emptyState();
    COLLECTIONS.forEach((c) => (next[c] = read(KEYS[c], [])));
    next.settings = read(KEYS.settings, {});
    next.users = read(KEYS.users, []);
    setDb(next);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      ...db,
      user,
      theme,
      toggleTheme,
      login,
      logout,
      insert,
      update,
      upsert,
      remove,
      persist,
      saveSettings,
      exportAll,
      restoreAll,
      factoryReset,
    }),
    [ready, db, user, theme, toggleTheme, login, logout, insert, update, upsert, remove, persist, saveSettings, restoreAll, factoryReset],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
