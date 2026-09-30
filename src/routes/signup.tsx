import { createFileRoute } from "@tanstack/react-router";
import { AuthPanel } from "@/components/auth-panel";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Get started free — SmartBPI" },
      {
        name: "description",
        content: "Create a SmartBPI workspace and unlock all 14 AI business modules for 14 days.",
      },
      { property: "og:title", content: "Get started free — SmartBPI" },
      {
        property: "og:description",
        content: "Spin up your AI business operating system in minutes.",
      },
    ],
  }),
  component: () => <AuthPanel mode="signup" />,
});
