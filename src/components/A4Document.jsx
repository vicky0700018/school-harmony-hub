/**
 * Reusable A4 document frame used by every printable output:
 * receipts, marksheets, certificates, admission forms, salary slips.
 * Always renders on white paper tokens so print output stays readable.
 */
import { Printer, FileDown, Eye } from "lucide-react";
import { Button } from "@/components/kit";
import { useApp } from "@/context/AppContext";

export function printDocument() {
  if (typeof window !== "undefined") window.print();
}

export function DocToolbar({ onPreview, extra }) {
  return (
    <div className="no-print mb-4 flex flex-wrap gap-2">
      {onPreview && (
        <Button variant="outline" onClick={onPreview}>
          <Eye className="h-4 w-4" /> Preview
        </Button>
      )}
      <Button onClick={printDocument}>
        <Printer className="h-4 w-4" /> Print
      </Button>
      <Button variant="outline" onClick={printDocument}>
        <FileDown className="h-4 w-4" /> Download PDF
      </Button>
      {extra}
    </div>
  );
}

export function SchoolLetterhead({ title, subtitle }) {
  const { settings } = useApp();
  return (
    <div className="border-b-2 border-[var(--paper-border)] pb-3 text-center">
      <div className="flex items-center justify-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--paper-border)] text-2xl font-bold">
          {settings.logoText || "S"}
        </div>
        <div>
          <div className="text-2xl font-bold uppercase tracking-wide">{settings.name}</div>
          <div className="text-xs">{settings.address}</div>
          <div className="text-xs">
            {settings.phone} · {settings.email} · {settings.website}
          </div>
          <div className="text-[10px] uppercase tracking-wide">{settings.affiliation}</div>
        </div>
      </div>
      {title && (
        <div className="mt-3 inline-block border border-[var(--paper-border)] px-6 py-1 text-sm font-bold uppercase tracking-[0.2em]">
          {title}
        </div>
      )}
      {subtitle && <div className="mt-1 text-xs">{subtitle}</div>}
    </div>
  );
}

export function SignatureRow({ items = ["Class Teacher", "Principal", "Parent / Guardian"] }) {
  return (
    <div className="mt-12 flex flex-wrap justify-between gap-6 text-center text-xs">
      {items.map((s) => (
        <div key={s} className="min-w-32 flex-1">
          <div className="mx-auto mb-1 border-t border-[var(--paper-border)]" />
          {s}
        </div>
      ))}
    </div>
  );
}

export function StampArea() {
  return (
    <div className="mt-6 flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-[var(--paper-border)] text-[10px] uppercase">
      School Stamp
    </div>
  );
}

/** The paper sheet itself. */
export default function A4Document({ title, subtitle, children, size = "a4" }) {
  return (
    <div className="print-area mx-auto w-full overflow-x-auto">
      <div
        className="mx-auto bg-[var(--paper)] p-[14mm] text-[var(--paper-foreground)] shadow-xl"
        style={{
          width: "210mm",
          minHeight: size === "a4" ? "297mm" : "auto",
          maxWidth: "100%",
        }}
      >
        <div className="h-full border border-[var(--paper-border)] p-6">
          <SchoolLetterhead title={title} subtitle={subtitle} />
          <div className="mt-5 text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
