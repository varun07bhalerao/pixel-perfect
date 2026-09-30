import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
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
import { approvalQueue, currency, policyRules } from "@/lib/mock-data";

export const Route = createFileRoute("/app/approvals")({
  head: () => ({
    meta: [
      { title: "Decision & Approval Engine — SmartBPI" },
      {
        name: "description",
        content: "Policy limits, automated decisions and the human approval queue.",
      },
      { property: "og:title", content: "Decision & Approval Engine — SmartBPI" },
      {
        property: "og:description",
        content: "Everything above policy stops here for a human call.",
      },
    ],
  }),
  component: Approvals,
});

function Approvals() {
  const [decisions, setDecisions] = useState<Record<string, "Approved" | "Rejected">>({});
  const pending = approvalQueue.filter((item) => !decisions[item.id]);

  function decide(id: string, request: string, outcome: "Approved" | "Rejected") {
    setDecisions((prev) => ({ ...prev, [id]: outcome }));
    toast.success(`${outcome}: ${request}`);
  }

  return (
    <>
      <PageHeader
        eyebrow="12 · Decision & Approval Engine"
        title="Decision & Approval Engine"
        description="Agents act inside policy. Anything beyond the configured limits waits here for your decision."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Awaiting decision"
          value={String(pending.length)}
          change={`${Object.keys(decisions).length} cleared`}
          hint="Human queue"
        />
        <StatCard label="Auto-approved today" value="46" change="+9" hint="Within policy" />
        <StatCard
          label="Policy rules"
          value={String(policyRules.length)}
          change="All active"
          hint="Governance layer"
        />
        <StatCard label="Avg. decision time" value="3.2 h" change="-1.1 h" hint="Last 30 days" />
      </div>

      <Panel
        title="Policy Limit Rules"
        description="Configured during onboarding"
        bodyClassName="p-0"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rule</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead>State</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policyRules.map((rule) => (
              <TableRow key={rule.rule}>
                <TableCell className="font-medium">{rule.rule}</TableCell>
                <TableCell className="tabular-nums">{rule.value}</TableCell>
                <TableCell className="text-muted-foreground">{rule.scope}</TableCell>
                <TableCell>
                  <StatusPill tone={toneForStatus(rule.state)}>{rule.state}</StatusPill>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>

      <Panel
        title="Pending Human Approval"
        description="Approve or reject — the queue updates instantly"
        bodyClassName="p-0"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Request</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Triggered rule</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead className="text-right">Decision</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvalQueue.map((item) => {
              const decision = decisions[item.id];
              return (
                <TableRow key={item.id} className={decision ? "opacity-60" : undefined}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.request}</TableCell>
                  <TableCell className="text-right tabular-nums">{currency(item.amount)}</TableCell>
                  <TableCell className="text-muted-foreground">{item.rule}</TableCell>
                  <TableCell className="text-muted-foreground">{item.requester}</TableCell>
                  <TableCell className="text-right">
                    {decision ? (
                      <StatusPill tone={decision === "Approved" ? "success" : "danger"}>
                        {decision}
                      </StatusPill>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          className="h-7 px-2.5 text-xs"
                          onClick={() => decide(item.id, item.request, "Approved")}
                        >
                          <Check className="size-3" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2.5 text-xs"
                          onClick={() => decide(item.id, item.request, "Rejected")}
                        >
                          <X className="size-3" /> Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Panel>
    </>
  );
}
