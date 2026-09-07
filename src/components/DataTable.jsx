/**
 * Reusable data table: search, sort, pagination, export CSV, print.
 * Columns: { key, header, value?(row), render?(row), className?, sortable? }
 */
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Download, Printer } from "lucide-react";
import { Button, SearchInput, EmptyState } from "@/components/kit";
import { exportCSV } from "@/utils/format";
import { cn } from "@/lib/utils";

export default function DataTable({
  columns,
  rows,
  searchable = true,
  searchKeys,
  pageSize = 10,
  filters,
  exportName,
  onPrint,
  emptyMessage = "No records match the current filters.",
  dense,
}) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState({ key: null, dir: "asc" });
  const [page, setPage] = useState(1);

  const cellValue = (col, row) =>
    typeof col.value === "function" ? col.value(row) : row[col.key];

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    const keys = searchKeys || columns.map((c) => c.key);
    return rows.filter((r) =>
      keys.some((k) => String(r[k] ?? "").toLowerCase().includes(needle)),
    );
  }, [q, rows, searchKeys, columns]);

  const sorted = useMemo(() => {
    if (!sort.key) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return filtered;
    return [...filtered].sort((a, b) => {
      const av = cellValue(col, a);
      const bv = cellValue(col, b);
      const num = Number(av) - Number(bv);
      const res = !Number.isNaN(num) && av !== "" && bv !== "" && !Number.isNaN(Number(av)) && !Number.isNaN(Number(bv))
        ? num
        : String(av ?? "").localeCompare(String(bv ?? ""));
      return sort.dir === "asc" ? res : -res;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, sort, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, totalPages);
  const view = sorted.slice((current - 1) * pageSize, current * pageSize);

  const toggleSort = (key) =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === "asc" ? "desc" : "asc" }));

  return (
    <div className="space-y-3">
      <div className="no-print flex flex-wrap items-center gap-2">
        {searchable && (
          <SearchInput value={q} onChange={(v) => { setQ(v); setPage(1); }} className="w-full sm:w-64" />
        )}
        {filters}
        <div className="ml-auto flex gap-2">
          {exportName && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportCSV(`${exportName}.csv`, columns, sorted)}
            >
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onPrint || (() => window.print())}>
            <Printer className="h-3.5 w-3.5" /> Print
          </Button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                {columns.map((c) => (
                  <th key={c.key} className={cn("px-4 py-3 font-medium", c.className)}>
                    {c.sortable === false ? (
                      c.header
                    ) : (
                      <button
                        className="inline-flex items-center gap-1 hover:text-foreground"
                        onClick={() => toggleSort(c.key)}
                      >
                        {c.header}
                        {sort.key === c.key &&
                          (sort.dir === "asc" ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : (
                            <ArrowDown className="h-3 w-3" />
                          ))}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {view.map((row, i) => (
                <tr
                  key={row.id || i}
                  className="border-b border-border/60 last:border-0 hover:bg-accent/40"
                >
                  {columns.map((c) => (
                    <td key={c.key} className={cn(dense ? "px-4 py-2" : "px-4 py-3", c.className)}>
                      {c.render ? c.render(row) : (cellValue(c, row) ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="no-print flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>
          Showing {sorted.length === 0 ? 0 : (current - 1) * pageSize + 1}–
          {Math.min(current * pageSize, sorted.length)} of {sorted.length}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={current <= 1}
            onClick={() => setPage(current - 1)}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <span>
            Page {current} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={current >= totalPages}
            onClick={() => setPage(current + 1)}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
