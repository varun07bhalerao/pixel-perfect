import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Play } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, Panel, StatCard, StatusPill, toneForStatus } from "@/components/app-ui";
import { anomalies, churnRadar, currency, forecastSeries, products } from "@/lib/mock-data";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({
    meta: [
      { title: "AI & Analytics Engine — SmartBPI" },
      { name: "description", content: "Sales forecasting, inventory demand prediction, churn radar and anomaly detection." },
      { property: "og:title", content: "AI & Analytics Engine — SmartBPI" },
      { property: "og:description", content: "Simulate predictive scenarios before you commit budget." },
    ],
  }),
  component: Analytics,
});

function Analytics() {
  const [growth, setGrowth] = useState([12]);
  const factor = 1 + growth[0] / 100;
  const scenario = forecastSeries.map((point) => ({
    ...point,
    forecast: Math.round(point.forecast * factor),
  }));

  return (
    <>
      <PageHeader
        eyebrow="08 · AI & Analytics Engine"
        title="AI & Analytics Engine"
        description="Simulation control center for forecasting, demand prediction, churn scoring and fraud detection."
        actions={
          <Button onClick={() => toast.success("Model run complete — forecasts refreshed.")}>
            <Play className="size-4" /> Run simulation
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Forecast accuracy" value="93.4%" change="+1.8%" hint="Backtested 12 months" />
        <StatCard label="Demand model drift" value="Low" change="-0.4%" hint="Retrained 3 days ago" />
        <StatCard label="Churn recall" value="88%" change="+2.2%" hint="At 60% threshold" />
        <StatCard label="Anomalies flagged" value="14" change="+3" trend="down" hint="Last 7 days" />
      </div>

      <Panel
        title="Sales Forecasting"
        description={`Scenario: ${growth[0]}% growth assumption`}
        actions={
          <div className="flex w-52 items-center gap-3">
            <Slider value={growth} onValueChange={setGrowth} min={-10} max={40} step={1} />
            <span className="w-10 text-xs font-semibold tabular-nums">{growth[0]}%</span>
          </div>
        }
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scenario} margin={{ left: -12, right: 8, top: 8 }}>
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: number) => `$${Math.round(value / 1000)}K`}
              />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", fontSize: 12 }}
                formatter={(value: number) => currency(value)}
              />
              <Line type="monotone" dataKey="actual" name="Actual" stroke="var(--color-chart-1)" strokeWidth={2.5} dot />
              <Line
                type="monotone"
                dataKey="forecast"
                name="Forecast"
                stroke="var(--color-chart-2)"
                strokeWidth={2.5}
                strokeDasharray="6 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Inventory Demand Predictions" description="Next 45 days, by SKU">
          <ul className="space-y-4">
            {products.slice(0, 5).map((product, index) => {
              const predicted = [96, 74, 61, 48, 33][index];
              return (
                <li key={product.sku} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">{product.name}</p>
                    <StatusPill tone={toneForStatus(product.demand)}>{product.demand}</StatusPill>
                  </div>
                  <Progress value={predicted} className="h-1.5" />
                  <p className="text-xs text-muted-foreground">
                    Predicted demand {Math.round(predicted * 2.4)} units · on hand {product.stock}
                  </p>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel title="Customer Churn Radar" description="Risk score by key account">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={churnRadar} outerRadius="72%">
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="account" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", fontSize: 12 }} />
                <Radar name="Churn risk %" dataKey="risk" stroke="var(--color-chart-1)" fill="var(--color-chart-1)" fillOpacity={0.28} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel title="Anomaly & Fraud Detection" description="Model-flagged events awaiting review" bodyClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Detail</TableHead>
              <TableHead>Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {anomalies.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell className="text-muted-foreground">{item.time}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell className="text-muted-foreground">{item.detail}</TableCell>
                <TableCell>
                  <StatusPill tone={toneForStatus(item.score)}>{item.score}</StatusPill>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>
    </>
  );
}
