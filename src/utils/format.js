export const SESSION = "2024-25";

export function currency(n) {
  const value = Number(n || 0);
  return "₹" + value.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export function compactCurrency(n) {
  const v = Number(n || 0);
  if (v >= 10000000) return "₹" + (v / 10000000).toFixed(2) + "Cr";
  if (v >= 100000) return "₹" + (v / 100000).toFixed(2) + "L";
  if (v >= 1000) return "₹" + (v / 1000).toFixed(1) + "K";
  return "₹" + v;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const MONTH_NAMES = [
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
];

export function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function titleCase(s) {
  return String(s || "")
    .split(/[\s_-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function initials(name) {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export function percent(n, d) {
  if (!d) return 0;
  return Math.round((n / d) * 1000) / 10;
}

export function gradeFor(pct) {
  if (pct >= 91) return "A1";
  if (pct >= 81) return "A2";
  if (pct >= 71) return "B1";
  if (pct >= 61) return "B2";
  if (pct >= 51) return "C1";
  if (pct >= 41) return "C2";
  if (pct >= 33) return "D";
  return "E";
}

export function downloadFile(filename, content, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function toCSV(columns, rows) {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const head = columns.map((c) => esc(c.header)).join(",");
  const body = rows
    .map((r) => columns.map((c) => esc(typeof c.value === "function" ? c.value(r) : r[c.key])).join(","))
    .join("\n");
  return head + "\n" + body;
}

export function exportCSV(filename, columns, rows) {
  downloadFile(filename, toCSV(columns, rows), "text/csv;charset=utf-8;");
}
