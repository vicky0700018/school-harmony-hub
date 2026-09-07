import { createFileRoute } from "@tanstack/react-router";
// @ts-expect-error -- JSX module without types
import Workspace from "../pages/Workspace";

export const Route = createFileRoute("/app/$")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Workspace — Glowstone Academy School ERP" },
      {
        name: "description",
        content:
          "Manage students, admissions, attendance, fees, examinations, certificates, staff payroll and reports.",
      },
      { property: "og:title", content: "Workspace — Glowstone Academy School ERP" },
      {
        property: "og:description",
        content: "The complete school operations workspace: students, fees, exams and documents.",
      },
    ],
  }),
  component: Workspace,
});
