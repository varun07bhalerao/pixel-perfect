import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Download, Plus } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader, Panel, StatCard, StatusPill, toneForStatus } from "@/components/app-ui";
import { currency, orders, receivables, revenueByLine } from "@/lib/mock-data";

export const Route = createFileRoute("/app/sales")({
  head: () => ({
    meta: [
      { title: "Sales & Revenue Management — SmartBPI" },
      {
        name: "description",
        content: "Orders, invoices, payment status and revenue breakdown by line.",
      },
      { property: "og:title", content: "Sales & Revenue Management — SmartBPI" },
      {
        property: "og:description",
        content: "Track every order and invoice from one revenue workspace.",
      },
    ],
  }),
  component: Sales,
});

function Sales() {
  return (
    <>
      <PageHeader
        eyebrow="03 · Sales & Revenue"
        title="Sales & Revenue Management"
        description="Every order, invoice and payment status with revenue contribution by product line."
        actions={
          <>
            <Button variant="outline" onClick={() => toast.success("Sales export queued (CSV).")}>
              <Download className="size-4" /> Export
            </Button>
            <Button onClick={() => toast.success("New order draft created.")}>
              <Plus className="size-4" /> New order
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue MTD" value="$536K" change="+5.5%" hint="vs previous month" />
        <StatCard label="Avg order value" value="$4,120" change="+2.8%" hint="1,284 orders" />
        <StatCard
          label="Pending payments"
          value="$96.2K"
          change="+1.4%"
          trend="down"
          hint="14 invoices"
        />
        <StatCard label="Overdue" value="$214.3K" change="+8.7%" trend="down" hint="11 invoices" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel
          title="Recent Orders"
          description="Latest activity across all channels"
          className="xl:col-span-2"
          bodyClassName="p-0"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell className="text-muted-foreground">{order.channel}</TableCell>
                  <TableCell className="text-right tabular-nums">{order.items}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {currency(order.amount)}
                  </TableCell>
                  <TableCell>
                    <StatusPill tone={toneForStatus(order.status)}>{order.status}</StatusPill>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Panel>

        <Panel title="Revenue by Line" description="Trailing 12 months">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByLine} margin={{ left: -14, right: 8, top: 8 }}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="name"
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
                  formatter={(value: number) => currency(value)}
                />
                <Bar
                  dataKey="value"
                  name="Revenue"
                  fill="var(--color-chart-1)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel title="Invoices" description="Payment status and ageing" bodyClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Ageing</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receivables.map((row) => (
              <TableRow key={row.invoice}>
                <TableCell className="font-medium">{row.invoice}</TableCell>
                <TableCell>{row.customer}</TableCell>
                <TableCell className="text-muted-foreground">{row.due}</TableCell>
                <TableCell className="text-muted-foreground">{row.age}</TableCell>
                <TableCell className="text-right tabular-nums">{currency(row.amount)}</TableCell>
                <TableCell>
                  <StatusPill tone={toneForStatus(row.status)}>{row.status}</StatusPill>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs"
                    onClick={() => toast.success(`Reminder sent for ${row.invoice}.`)}
                  >
                    Send reminder
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>
    </>
  );
}
