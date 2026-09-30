import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PageHeader, Panel, StatCard, StatusPill } from "@/components/app-ui";
import { workflows } from "@/lib/mock-data";

export const Route = createFileRoute("/app/workflows")({
  head: () => ({
    meta: [
      { title: "Workflow Automation — SmartBPI" },
      {
        name: "description",
        content: "Rule-based automations for purchase orders, reminders, escalations and digests.",
      },
      { property: "og:title", content: "Workflow Automation — SmartBPI" },
      {
        property: "og:description",
        content: "Turn repeating decisions into rules that run themselves.",
      },
    ],
  }),
  component: Workflows,
});

function Workflows() {
  const [state, setState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(workflows.map((w) => [w.id, w.enabled])),
  );
  const activeCount = Object.values(state).filter(Boolean).length;

  return (
    <>
      <PageHeader
        eyebrow="14 · Workflow Automation"
        title="Workflow Automation"
        description="Each rule listens to a business trigger and acts within your policy limits."
        actions={
          <Button onClick={() => toast.success("All active workflows executed once.")}>
            <Zap className="size-4" /> Run all active
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active rules"
          value={String(activeCount)}
          change={`${workflows.length} total`}
          hint="Live automations"
        />
        <StatCard label="Executions" value="232" change="+41" hint="Last 30 days" />
        <StatCard label="Success rate" value="99.1%" change="+0.3%" hint="No manual retries" />
        <StatCard label="Hours saved" value="126" change="+18" hint="Estimated" />
      </div>

      <Panel
        title="Automation Rules"
        description="Toggle a rule off to pause it instantly"
        bodyClassName="p-0"
      >
        <ul className="divide-y divide-border">
          {workflows.map((workflow) => (
            <li
              key={workflow.id}
              className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{workflow.id}</span>
                  <StatusPill tone={state[workflow.id] ? "success" : "neutral"}>
                    {state[workflow.id] ? "Active" : "Paused"}
                  </StatusPill>
                </div>
                <p className="text-sm font-medium">{workflow.name}</p>
                <p className="text-xs text-muted-foreground">
                  Trigger: {workflow.trigger} · {workflow.runs} runs
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!state[workflow.id]}
                  onClick={() => toast.success(`${workflow.id} executed.`)}
                >
                  Execute Now
                </Button>
                <Switch
                  checked={state[workflow.id] ?? false}
                  onCheckedChange={(checked) => {
                    setState((prev) => ({ ...prev, [workflow.id]: checked }));
                    toast.success(`${workflow.id} ${checked ? "activated" : "paused"}.`);
                  }}
                  aria-label={`Toggle ${workflow.name}`}
                />
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
