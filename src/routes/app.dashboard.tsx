import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, Zap } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel, StatCard, StatusPill } from "@/components/app-ui";
import { aiInsights, criticalAlerts, kpis, revenueSeries } from "@/lib/mock-data";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({
    meta: [
      { title: "AI CEO Dashboard — SmartBPI" },
      {
        name: "description",
        content: "Executive KPIs, cash flow, critical alerts and AI recommendations.",
      },
      { property: "og:title", content: "AI CEO Dashboard — SmartBPI" },
      {
        property: "og:description",
        content: "One command view across revenue, stock, cash and churn risk.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [handled, setHandled] = useState<string[]>([]);

  return (
    <>
      <PageHeader
        eyebrow="02 · Business Dashboard"
        title="AI CEO Dashboard"
        description="Everything the executive team needs this morning: performance, cash, exceptions and the next best action."
        actions={
          <Button
            variant="outline"
            onClick={() => toast.success("Executive briefing regenerated from latest data.")}
          >
            <Sparkles className="size-4" /> Regenerate briefing
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpis.map((kpi) => (
          <StatCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel
          title="Revenue vs. Expenses"
          description="Rolling nine months"
          className="xl:col-span-2"
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ left: -12, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value: number) => `$${Math.round(value / 1000)}K`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--color-border)",
                    fontSize: 12,
                  }}
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="var(--color-chart-1)"
                  fill="url(#rev)"
                  strokeWidth={2.5}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="var(--color-chart-3)"
                  fill="transparent"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Cash Flow" description="Net monthly position">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueSeries} margin={{ left: -16, right: 8, top: 8 }}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value: number) => `$${Math.round(value / 1000)}K`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--color-border)",
                    fontSize: 12,
                  }}
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                />
                <Line
                  type="monotone"
                  dataKey="cash"
                  name="Net cash"
                  stroke="var(--color-chart-2)"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel
          title="Critical Alerts"
          description="One-click resolution"
          actions={<StatusPill tone="danger">4 open</StatusPill>}
        >
          <ul className="space-y-3">
            {criticalAlerts.map((alert) => {
              const done = handled.includes(alert.id);
              return (
                <li
                  key={alert.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <StatusPill
                        tone={
                          alert.severity === "critical"
                            ? "danger"
                            : alert.severity === "high"
                              ? "warning"
                              : "neutral"
                        }
                      >
                        {alert.severity}
                      </StatusPill>
                      <p className="text-sm font-semibold">{alert.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{alert.detail}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={done ? "secondary" : "default"}
                    disabled={done}
                    onClick={() => {
                      setHandled((prev) => [...prev, alert.id]);
                      toast.success(`${alert.action} triggered for ${alert.id}.`);
                    }}
                  >
                    <Zap className="size-3.5" /> {done ? "Done" : alert.action}
                  </Button>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel title="AI Insights" description="Ranked by expected impact">
          <ul className="space-y-3">
            {aiInsights.map((insight) => (
              <li key={insight.title} className="rounded-lg border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold">{insight.title}</p>
                  <StatusPill tone="primary">{insight.confidence}</StatusPill>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">{insight.detail}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-7 px-2 text-xs"
                  onClick={() =>
                    toast.success("Recommendation queued for the Autonomous AI Manager.")
                  }
                >
                  Apply recommendation
                </Button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
