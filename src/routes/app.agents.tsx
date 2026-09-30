import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Bot, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel, StatCard, StatusPill, toneForStatus } from "@/components/app-ui";
import { agentLog, agents } from "@/lib/mock-data";

export const Route = createFileRoute("/app/agents")({
  head: () => ({
    meta: [
      { title: "Multi-Agent AI System — SmartBPI" },
      { name: "description", content: "Autonomous agents for management, analysis, finance, inventory, marketing and workflows." },
      { property: "og:title", content: "Multi-Agent AI System — SmartBPI" },
      { property: "og:description", content: "Six specialist agents working your backlog with a full audit log." },
    ],
  }),
  component: Agents,
});

function Agents() {
  return (
    <>
      <PageHeader
        eyebrow="10 · Multi-Agent AI System"
        title="Multi-Agent AI System"
        description="Specialist agents coordinated by the Autonomous AI Manager, each with a live status and execution history."
        actions={
          <Button onClick={() => toast.success("All idle agents dispatched.")}>
            <PlayCircle className="size-4" /> Dispatch idle agents
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Agents online" value="6" change="+1" hint="All modules covered" />
        <StatCard label="Tasks today" value="184" change="+22" hint="Autonomous actions" />
        <StatCard label="Escalations" value="7" change="-3" hint="Routed to humans" />
        <StatCard label="Time saved" value="38 h" change="+6 h" hint="This week" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {agents.map((agent) => (
          <div key={agent.name} className="surface-panel p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-accent-foreground">
                <Bot className="size-5" />
              </span>
              <StatusPill tone={toneForStatus(agent.status)}>
                <span className="size-1.5 rounded-full bg-current" /> {agent.status}
              </StatusPill>
            </div>
            <h3 className="mt-4 text-sm font-semibold">{agent.name}</h3>
            <p className="mt-1.5 text-xs text-muted-foreground">Last task: {agent.task}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">{agent.updated}</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-xs"
                onClick={() => toast.success(`${agent.name} triggered.`)}
              >
                Run now
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Panel title="Agent Activity Log" description="Newest first">
        <ol className="relative space-y-5 border-l border-border pl-5">
          {agentLog.map((entry) => (
            <li key={`${entry.time}-${entry.agent}`} className="relative">
              <span className="absolute -left-[26px] top-1.5 size-2.5 rounded-full border-2 border-background bg-primary" />
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">{entry.time}</span>
                <StatusPill tone="primary">{entry.agent}</StatusPill>
              </div>
              <p className="mt-1 text-sm">{entry.event}</p>
            </li>
          ))}
        </ol>
      </Panel>
    </>
  );
}
