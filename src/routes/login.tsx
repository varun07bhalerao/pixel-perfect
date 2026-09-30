import { createFileRoute } from "@tanstack/react-router";
import { AuthPanel } from "@/components/auth-panel";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — SmartBPI" },
      {
        name: "description",
        content: "Sign in to your SmartBPI AI business operating system workspace.",
      },
      { property: "og:title", content: "Sign in — SmartBPI" },
      {
        property: "og:description",
        content: "Access your SmartBPI dashboards, agents and automations.",
      },
    ],
  }),
  component: () => <AuthPanel mode="login" />,
});
