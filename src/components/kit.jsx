/**
 * Shared UI kit — every module composes these primitives.
 * No module should hand-roll form controls, cards or dialogs.
 */
import { useEffect, useState } from "react";
import { X, Search, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------------- Page chrome ---------------- */

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="no-print mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ className, children, ...rest }) {
  return (
    <div
      className={cn("glass rounded-xl border border-border bg-card p-5 shadow-sm", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ children, right }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-base font-semibold tracking-tight">{children}</h2>
      {right}
    </div>
  );
}

/* ---------------- Buttons ---------------- */

const VARIANTS = {
  primary: "bg-primary text-primary-foreground hover:opacity-90",
  outline: "border border-border bg-transparent hover:bg-accent",
  ghost: "hover:bg-accent",
  danger: "bg-destructive text-destructive-foreground hover:opacity-90",
  soft: "bg-secondary text-secondary-foreground hover:opacity-90",
};

export function Button({ variant = "primary", className, size = "md", ...rest }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
        size === "sm" ? "h-8 px-3 text-xs" : size === "icon" ? "h-9 w-9" : "h-9 px-4 text-sm",
        VARIANTS[variant],
        className,
      )}
      {...rest}
    />
  );
}

export function Badge({ tone = "muted", children }) {
  const tones = {
    muted: "bg-muted text-muted-foreground",
    success: "bg-leaf/15 text-leaf",
    warning: "bg-primary/15 text-primary",
    danger: "bg-destructive/15 text-destructive",
    info: "bg-cyan/15 text-cyan",
  };
  return (
    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium", tones[tone])}>
      {children}
    </span>
  );
}

export function statusTone(status) {
  const s = String(status || "").toLowerCase();
  if (["paid", "present", "approved", "published", "active", "pass"].includes(s)) return "success";
  if (["partial", "late", "pending", "draft"].includes(s)) return "warning";
  if (["absent", "fail", "overdue", "inactive"].includes(s)) return "danger";
  return "muted";
}

/* ---------------- Form controls ---------------- */

export function Field({ label, children, hint, className }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

const controlCls =
  "h-9 w-full rounded-lg border border-input bg-background/40 px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30";

export function Input({ className, ...rest }) {
  return <input className={cn(controlCls, className)} {...rest} />;
}

export function Textarea({ className, ...rest }) {
  return <textarea className={cn(controlCls, "h-auto min-h-24 py-2", className)} {...rest} />;
}

export function Select({ options = [], placeholder, className, ...rest }) {
  return (
    <select className={cn(controlCls, className)} {...rest}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => {
        const value = typeof o === "string" ? o : o.value;
        const label = typeof o === "string" ? o : o.label;
        return (
          <option key={value} value={value}>
            {label}
          </option>
        );
      })}
    </select>
  );
}

export function SearchInput({ value, onChange, placeholder = "Search…", className }) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(controlCls, "pl-9")}
      />
    </div>
  );
}

/* ---------------- Modal + confirm ---------------- */

export function Modal({ open, onClose, title, description, children, footer, wide }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="no-print fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:items-center">
      <div
        className={cn(
          "glass w-full rounded-2xl border border-border bg-card shadow-2xl",
          wide ? "max-w-4xl" : "max-w-lg",
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            <h3 className="text-base font-semibold">{title}</h3>
            {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
          </div>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-accent" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="flex flex-wrap justify-end gap-2 border-t border-border px-5 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, title = "Are you sure?", message, onCancel, onConfirm, confirmLabel = "Delete" }) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      description={message}
      footer={
        <>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
    </Modal>
  );
}

/** Small hook that wires a confirm dialog to any destructive action. */
export function useConfirm() {
  const [state, setState] = useState(null);
  const dialog = (
    <ConfirmDialog
      open={!!state}
      title={state?.title}
      message={state?.message}
      confirmLabel={state?.confirmLabel}
      onCancel={() => setState(null)}
      onConfirm={() => {
        state?.action?.();
        setState(null);
      }}
    />
  );
  return [dialog, (opts) => setState(opts)];
}

/* ---------------- States ---------------- */

export function EmptyState({ title = "Nothing here yet", message, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-14 text-center">
      <Inbox className="mb-3 h-8 w-8 text-muted-foreground" />
      <p className="font-medium">{title}</p>
      {message && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Loading({ label = "Loading…" }) {
  return (
    <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
      <span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary" />
      {label}
    </div>
  );
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="no-print mb-5 flex flex-wrap gap-1 rounded-lg border border-border bg-card/50 p-1">
      {tabs.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            value === t.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
