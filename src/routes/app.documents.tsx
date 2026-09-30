import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, FileText, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, Panel, StatusPill } from "@/components/app-ui";
import { currency, extractedInvoice } from "@/lib/mock-data";

export const Route = createFileRoute("/app/documents")({
  head: () => ({
    meta: [
      { title: "Document Intelligence — SmartBPI" },
      { name: "description", content: "Upload invoices, bills and receipts and review extracted fields before posting." },
      { property: "og:title", content: "Document Intelligence — SmartBPI" },
      { property: "og:description", content: "Turn paperwork into ledger rows in one review pass." },
    ],
  }),
  component: Documents,
});

const queue = [
  { name: "HC-2026-4471.pdf", type: "Invoice", status: "Extracted" },
  { name: "utilities-sept.pdf", type: "Bill", status: "Extracted" },
  { name: "courier-receipt-88.jpg", type: "Receipt", status: "Processing" },
];

function Documents() {
  const [dragging, setDragging] = useState(false);
  const [posted, setPosted] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="11 · Document Intelligence"
        title="Document Intelligence"
        description="Drop a document, review the extracted fields side by side, then push the result straight to the ledger."
      />

      <div className="grid gap-6 xl:grid-cols-5">
        <div className="space-y-6 xl:col-span-2">
          <Panel title="Upload" description="Invoices, bills and receipts">
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                toast.success("Document received — extraction simulated.");
              }}
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
                dragging ? "border-primary bg-primary-soft" : "border-border bg-canvas"
              }`}
            >
              <UploadCloud className="size-7 text-primary" />
              <p className="mt-3 text-sm font-semibold">Drag & drop files here</p>
              <p className="mt-1 text-xs text-muted-foreground">PDF, PNG or JPG · up to 10 MB</p>
              <Button variant="outline" className="mt-4" onClick={() => toast.success("Sample invoice uploaded.")}>
                Browse files
              </Button>
            </div>
          </Panel>

          <Panel title="Processing Queue" description="Most recent uploads" bodyClassName="p-0">
            <ul className="divide-y divide-border">
              {queue.map((item) => (
                <li key={item.name} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <FileText className="size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.type}</p>
                    </div>
                  </div>
                  <StatusPill tone={item.status === "Extracted" ? "success" : "warning"}>{item.status}</StatusPill>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel
          title="Extraction Preview"
          description={`${extractedInvoice.vendor} · ${extractedInvoice.invoiceNumber}`}
          className="xl:col-span-3"
          actions={
            posted ? (
              <StatusPill tone="success">
                <CheckCircle2 className="size-3" /> Pushed to ledger
              </StatusPill>
            ) : (
              <Button
                onClick={() => {
                  setPosted(true);
                  toast.success("Invoice posted to the finance ledger.");
                }}
              >
                Push to Ledger
              </Button>
            )
          }
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Vendor", extractedInvoice.vendor],
              ["Invoice number", extractedInvoice.invoiceNumber],
              ["Issue date", extractedInvoice.issued],
              ["Due date", extractedInvoice.due],
              ["Currency", extractedInvoice.currency],
              ["Confidence", "98.2%"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-border bg-canvas px-4 py-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                <p className="mt-1 text-sm font-semibold">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Unit</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {extractedInvoice.lineItems.map((item) => (
                  <TableRow key={item.description}>
                    <TableCell className="font-medium">{item.description}</TableCell>
                    <TableCell className="text-right tabular-nums">{item.qty}</TableCell>
                    <TableCell className="text-right tabular-nums">{currency(item.unit)}</TableCell>
                    <TableCell className="text-right tabular-nums">{currency(item.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <dl className="mt-4 ml-auto w-full max-w-xs space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="tabular-nums">{currency(extractedInvoice.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Tax</dt>
              <dd className="tabular-nums">{currency(extractedInvoice.tax)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-semibold">
              <dt>Total</dt>
              <dd className="tabular-nums">{currency(extractedInvoice.total)}</dd>
            </div>
          </dl>
        </Panel>
      </div>
    </>
  );
}
