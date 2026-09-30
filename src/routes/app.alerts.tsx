import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel, StatCard, StatusPill, toneForStatus } from "@/components/app-ui";
import { smartAlerts } from "@/lib/mock-data";

export const Route = createFileRoute("/app/alerts")({
  head: () => ({
    meta: [
      { title: "Smart Alerts — SmartBPI" },
      { name: "description", content: "Priority-ranked alerts for stock, churn risk, overdue payments and unusual transactions." },
      { property: "og:title", content: "Smart Alerts — SmartBPI" },
      { property: "og:description", content: "One ranked list of what actually needs attention." },
    ],
  }),
  component: Alerts,
});

function Alerts() {
  const [resolved, setResolved] = useState<string[]>([]);

  return (
    <>
      <PageHeader
        eyebrow="13 · Smart Alerts"
        title="Smart Alerts"
        description="Every operational and financial signal, grouped by category and ranked by severity."
        actions={
          <Button variant="outline" onClick={() => toast.success("Alert digest sent to your inbox.")}>
            <BellRing className="size-4" /> Email digest
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open alerts" value={String(smartAlerts.length - resolved.length)} change={`${resolved.length} resolved`} hint="Across categories" />
        <StatCard label="Critical" value="6" change="+2" trend="down" hint="Inventory" />
        <StatCard label="High" value="20" change="+4" trend="down" hint="Churn & receivables" />
        <StatCard label="Medium" value="3" change="-1" hint="Transaction review" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {smartAlerts.map((alert) => {
          const done = resolved.includes(alert.category);
          return (
            <Panel
              key={alert.category}
              title={alert.category}
              description={`${alert.count} affected records`}
              actions={<StatusPill tone={done ? "success" : toneForStatus(alert.severity)}>{done ? "Resolved" : alert.severity}</StatusPill>}
            >
              <p className="text-sm text-muted-foreground">{alert.detail}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  disabled={done}
                  onClick={() => {
                    setResolved((prev) => [...prev, alert.category]);
                    toast.success(`${alert.category} marked resolved.`);
                  }}
                >
                  {done ? "Handled" : "Resolve"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast.success(`Escalated: ${alert.category}`)}>
                  Escalate
                </Button>
              </div>
            </Panel>
          );
        })}
      </div>
    </>
  );
}
