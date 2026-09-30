import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, Panel, StatCard, StatusPill, toneForStatus } from "@/components/app-ui";
import { currency, payables, plSummary, receivables, revenueSeries } from "@/lib/mock-data";

export const Route = createFileRoute("/app/finance")({
  head: () => ({
    meta: [
      { title: "Finance Management — SmartBPI" },
      { name: "description", content: "Receivables, payables, invoice ledger, P&L summary and cash-flow monitoring." },
      { property: "og:title", content: "Finance Management — SmartBPI" },
      { property: "og:description", content: "See cash, margin and obligations on one screen." },
    ],
  }),
  component: Finance,
});

function Finance() {
  return (
    <>
      <PageHeader
        eyebrow="06 · Finance"
        title="Finance Management"
        description="Cash position, receivables and payables ageing, and a live profit & loss summary."
        actions={
          <Button variant="outline" onClick={() => toast.success("Finance pack exported (PDF).")}>
            <Download className="size-4" /> Export finance pack
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Cash on hand" value="$1.42M" change="+6.4%" hint="All accounts" />
        <StatCard label="Receivables" value="$412K" change="+2.1%" trend="down" hint="11 overdue" />
        <StatCard label="Payables" value="$104.9K" change="-4.8%" hint="1 needs approval" />
        <StatCard label="Net margin" value="12.7%" change="+0.9%" hint="Trailing quarter" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Cash-flow Monitoring" description="Revenue, expenses and net position" className="xl:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ left: -12, right: 8, top: 8 }}>
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
                <Area type="monotone" dataKey="cash" name="Net cash" stroke="var(--color-chart-2)" fill="var(--color-chart-2)" fillOpacity={0.14} strokeWidth={2.5} />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="var(--color-chart-3)" fill="transparent" strokeWidth={2} strokeDasharray="5 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Profit & Loss" description="Trailing 12 months">
          <dl className="divide-y divide-border">
            {plSummary.map((row) => (
              <div key={row.label} className="flex items-center justify-between py-3 text-sm">
                <dt className="text-muted-foreground">{row.label}</dt>
                <dd className="font-semibold tabular-nums">{row.value}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Accounts Receivable" description="Invoice ledger — money in" bodyClassName="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receivables.map((row) => (
                <TableRow key={row.invoice}>
                  <TableCell className="font-medium">{row.invoice}</TableCell>
                  <TableCell>{row.customer}</TableCell>
                  <TableCell className="text-right tabular-nums">{currency(row.amount)}</TableCell>
                  <TableCell>
                    <StatusPill tone={toneForStatus(row.status)}>{row.status}</StatusPill>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Panel>

        <Panel title="Accounts Payable" description="Vendor bills — money out" bodyClassName="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payables.map((row) => (
                <TableRow key={row.bill}>
                  <TableCell className="font-medium">{row.bill}</TableCell>
                  <TableCell>{row.vendor}</TableCell>
                  <TableCell className="text-right tabular-nums">{currency(row.amount)}</TableCell>
                  <TableCell>
                    <StatusPill tone={toneForStatus(row.status)}>{row.status}</StatusPill>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Panel>
      </div>
    </>
  );
}
