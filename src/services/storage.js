/**
 * Centralized persistence layer.
 *
 * Every module reads/writes through this service, never through
 * `localStorage` directly. Swapping this file for a REST/Supabase/Firebase
 * client is enough to move the whole app to a real backend.
 */

const PREFIX = "glowstone.";

export const KEYS = {
  students: "students",
  teachers: "teachers",
  staff: "staff",
  classes: "classes",
  subjects: "subjects",
  feeStructure: "feeStructure",
  fees: "fees",
  payments: "payments",
  attendance: "attendance",
  staffAttendance: "staffAttendance",
  exams: "exams",
  marks: "marks",
  notices: "notices",
  admissions: "admissions",
  timetable: "timetable",
  payroll: "payroll",
  certificates: "certificates",
  settings: "settings",
  users: "users",
  session: "session",
  theme: "theme",
};

const memory = new Map();

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function read(key, fallback) {
  const full = PREFIX + key;
  try {
    if (!canUseStorage()) return memory.has(full) ? memory.get(full) : fallback;
    const raw = window.localStorage.getItem(full);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function write(key, value) {
  const full = PREFIX + key;
  memory.set(full, value);
  try {
    if (canUseStorage()) window.localStorage.setItem(full, JSON.stringify(value));
  } catch {
    /* quota or private mode — memory copy still serves the session */
  }
  return value;
}

export function remove(key) {
  const full = PREFIX + key;
  memory.delete(full);
  if (canUseStorage()) window.localStorage.removeItem(full);
}

/** Snapshot of every collection — used by Backup / Restore. */
export function exportAll() {
  const out = {};
  Object.values(KEYS).forEach((k) => {
    const v = read(k, undefined);
    if (v !== undefined) out[k] = v;
  });
  return out;
}

export function importAll(payload) {
  Object.entries(payload || {}).forEach(([k, v]) => write(k, v));
}

export function clearAll() {
  Object.values(KEYS).forEach(remove);
}

/** Short unique id, stable enough for a local demo dataset. */
export function uid(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}
