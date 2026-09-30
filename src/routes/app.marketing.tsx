import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Rocket } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, Panel, StatCard, StatusPill } from "@/components/app-ui";
import { campaigns, currency } from "@/lib/mock-data";

export const Route = createFileRoute("/app/marketing")({
  head: () => ({
    meta: [
      { title: "Marketing Intelligence — SmartBPI" },
      { name: "description", content: "Campaign performance, customer acquisition cost, conversion and marketing ROI." },
      { property: "og:title", content: "Marketing Intelligence — SmartBPI" },
      { property: "og:description", content: "Move budget to the channels that actually return." },
    ],
  }),
  component: Marketing,
});

function Marketing() {
  return (
    <>
      <PageHeader
        eyebrow="07 · Marketing Intelligence"
        title="Marketing Intelligence"
        description="Channel-level spend efficiency across Google Ads, Meta and email lifecycle programs."
        actions={
          <Button onClick={() => toast.success("Budget reallocation simulated: +12% to Google Ads.")}>
            <Rocket className="size-4" /> Apply AI budget shift
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total spend" value="$170K" change="+4.2%" hint="This quarter" />
        <StatCard label="Blended CAC" value="$58" change="-6.1%" hint="Down is good" />
        <StatCard label="Leads" value="3,172" change="+11.8%" hint="Marketing qualified" />
        <StatCard label="Marketing ROI" value="3.1x" change="+0.4x" hint="Estimated" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Spend vs. Leads" description="By campaign" className="xl:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaigns} margin={{ left: -12, right: 8, top: 8 }}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="channel" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", fontSize: 12 }} />
                <Bar dataKey="spend" name="Spend ($)" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="leads" name="Leads" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Channel ROI" description="Return per dollar spent">
          <ul className="space-y-3">
            {campaigns.map((campaign) => (
              <li key={campaign.name} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{campaign.channel}</p>
                  <StatusPill tone={parseFloat(campaign.roi) >= 3 ? "success" : parseFloat(campaign.roi) >= 2 ? "warning" : "danger"}>
                    {campaign.roi}
                  </StatusPill>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{campaign.name}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Campaign Performance" description="Live tracker" bodyClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead className="text-right">Spend</TableHead>
              <TableHead className="text-right">Leads</TableHead>
              <TableHead className="text-right">CAC</TableHead>
              <TableHead className="text-right">Conversion</TableHead>
              <TableHead>ROI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.name}>
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell className="text-muted-foreground">{campaign.channel}</TableCell>
                <TableCell className="text-right tabular-nums">{currency(campaign.spend)}</TableCell>
                <TableCell className="text-right tabular-nums">{campaign.leads.toLocaleString()}</TableCell>
                <TableCell className="text-right tabular-nums">${campaign.cac}</TableCell>
                <TableCell className="text-right tabular-nums">{campaign.conv}</TableCell>
                <TableCell>
                  <StatusPill tone={parseFloat(campaign.roi) >= 3 ? "success" : "warning"}>{campaign.roi}</StatusPill>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>
    </>
  );
}
