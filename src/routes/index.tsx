import { createFileRoute } from "@tanstack/react-router";
// @ts-expect-error -- JSX module without types
import LoginPage from "../pages/Login";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — Glowstone Academy School ERP" },
      {
        name: "description",
        content:
          "Sign in to the Glowstone Academy school management portal as admin, teacher, accountant or office staff.",
      },
      { property: "og:title", content: "Sign in — Glowstone Academy School ERP" },
      {
        property: "og:description",
        content: "Role-based sign in for the Glowstone Academy school management portal.",
      },
    ],
  }),
  component: LoginPage,
});
