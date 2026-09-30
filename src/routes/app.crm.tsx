import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader, Panel, StatCard, StatusPill, toneForStatus } from "@/components/app-ui";
import { currency, customers, orders } from "@/lib/mock-data";

export const Route = createFileRoute("/app/crm")({
  head: () => ({
    meta: [
      { title: "CRM & Customer Intelligence — SmartBPI" },
      {
        name: "description",
        content: "Customer profiles, segments, purchase history and predicted churn risk.",
      },
      { property: "og:title", content: "CRM & Customer Intelligence — SmartBPI" },
      { property: "og:description", content: "Know which accounts to grow and which to save." },
    ],
  }),
  component: Crm,
});

function Crm() {
  return (
    <>
      <PageHeader
        eyebrow="05 · CRM Intelligence"
        title="CRM & Customer Intelligence"
        description="Segmented account profiles with lifetime value, order history and model-scored churn risk."
        actions={
          <Button onClick={() => toast.success("New account form opened (simulated).")}>
            <UserPlus className="size-4" /> Add account
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active accounts" value="612" change="+18" hint="Last 30 days" />
        <StatCard label="High-value" value="84" change="+6" hint="Top 14% by LTV" />
        <StatCard label="At-risk" value="34" change="+4" trend="down" hint="Churn score > 60%" />
        <StatCard label="Net retention" value="112%" change="+3.1%" hint="Trailing 12 months" />
      </div>

      <Panel title="Customer Profiles" description="Segments and churn scoring" bodyClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead>Segment</TableHead>
              <TableHead className="text-right">Lifetime value</TableHead>
              <TableHead className="text-right">Orders</TableHead>
              <TableHead className="w-44">Churn risk</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Last order</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.name}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>
                  <StatusPill tone={toneForStatus(customer.segment)}>{customer.segment}</StatusPill>
                </TableCell>
                <TableCell className="text-right tabular-nums">{currency(customer.ltv)}</TableCell>
                <TableCell className="text-right tabular-nums">{customer.orders}</TableCell>
                <TableCell>
                  <div className="space-y-1.5">
                    <p
                      className={`text-xs font-semibold ${
                        customer.churn > 60
                          ? "text-destructive"
                          : customer.churn > 35
                            ? "text-warning-foreground"
                            : "text-success-foreground"
                      }`}
                    >
                      {customer.churn}%
                    </p>
                    <Progress value={customer.churn} className="h-1.5" />
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{customer.owner}</TableCell>
                <TableCell className="text-muted-foreground">{customer.last}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Segmentation" description="Share of active base" className="xl:col-span-1">
          <ul className="space-y-4">
            {[
              { label: "High-Value", share: 14, tone: "success" as const },
              { label: "Regular", share: 61, tone: "primary" as const },
              { label: "At-Risk", share: 25, tone: "danger" as const },
            ].map((segment) => (
              <li key={segment.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <StatusPill tone={segment.tone}>{segment.label}</StatusPill>
                  <span className="text-sm font-semibold tabular-nums">{segment.share}%</span>
                </div>
                <Progress value={segment.share} className="h-1.5" />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Recent Purchase History"
          description="Across all accounts"
          className="xl:col-span-2"
          bodyClassName="p-0"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.slice(0, 6).map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell className="text-muted-foreground">{order.date}</TableCell>
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
      </div>
    </>
  );
}
