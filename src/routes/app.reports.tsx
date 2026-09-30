import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { FileDown, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader, Panel, StatCard, StatusPill } from "@/components/app-ui";
import { reportTypes } from "@/lib/mock-data";

export const Route = createFileRoute("/app/reports")({
  head: () => ({
    meta: [
      { title: "Reports & Analytics — SmartBPI" },
      {
        name: "description",
        content: "Build modular business reports with date-range filters and CSV or PDF export.",
      },
      { property: "og:title", content: "Reports & Analytics — SmartBPI" },
      { property: "og:description", content: "Pick a report, set the range, export." },
    ],
  }),
  component: Reports,
});

const recent = [
  { name: "Finance summary — Sep 2026", format: "PDF", generated: "Today, 08:12" },
  { name: "Sales performance — Q3", format: "CSV", generated: "Yesterday, 17:40" },
  { name: "Inventory health — week 38", format: "CSV", generated: "2 days ago" },
];

function Reports() {
  const [selected, setSelected] = useState(reportTypes[0]?.name ?? "Sales performance");
  const [from, setFrom] = useState("2026-07-01");
  const [to, setTo] = useState("2026-09-30");

  return (
    <>
      <PageHeader
        eyebrow="15 · Reports & Analytics"
        title="Reports & Analytics"
        description="Compose a report from any module, filter by date range, then export for your board pack."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Report templates"
          value={String(reportTypes.length)}
          change="All modules"
          hint="Ready to run"
        />
        <StatCard label="Generated this month" value="38" change="+12" hint="Across the team" />
        <StatCard label="Scheduled" value="4" change="Weekly" hint="Auto-delivered" />
        <StatCard label="Avg. build time" value="2.4 s" change="-0.6 s" hint="Simulated" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel
          title="Report Generator"
          description="Choose a module and range"
          className="xl:col-span-2"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {reportTypes.map((report) => (
              <button
                key={report.name}
                onClick={() => setSelected(report.name)}
                className={`rounded-lg border p-4 text-left transition-colors ${
                  selected === report.name
                    ? "border-primary bg-primary-soft"
                    : "border-border bg-canvas hover:border-primary/40"
                }`}
              >
                <p className="text-sm font-semibold">{report.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{report.detail}</p>
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="from">From</Label>
              <Input
                id="from"
                type="date"
                value={from}
                onChange={(event) => setFrom(event.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                type="date"
                value={to}
                onChange={(event) => setTo(event.target.value)}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Button onClick={() => toast.success(`${selected} exported as CSV (${from} → ${to}).`)}>
              <FileSpreadsheet className="size-4" /> Export CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.success(`${selected} exported as PDF (${from} → ${to}).`)}
            >
              <FileDown className="size-4" /> Export PDF
            </Button>
            <StatusPill tone="primary">Exports are simulated</StatusPill>
          </div>
        </Panel>

        <Panel title="Recent Exports" description="Last generated files" bodyClassName="p-0">
          <ul className="divide-y divide-border">
            {recent.map((item) => (
              <li key={item.name} className="px-5 py-4">
                <p className="text-sm font-medium">{item.name}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <StatusPill tone="neutral">{item.format}</StatusPill>
                  <span className="text-xs text-muted-foreground">{item.generated}</span>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
