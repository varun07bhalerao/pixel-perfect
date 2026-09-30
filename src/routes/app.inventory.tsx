import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Sparkles, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, Panel, StatCard, StatusPill, toneForStatus } from "@/components/app-ui";
import { currency, products, purchaseOrders, stockMovements, suppliers } from "@/lib/mock-data";

export const Route = createFileRoute("/app/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory Management — SmartBPI" },
      { name: "description", content: "Stock levels, movement logs, suppliers, purchase orders and AI demand prediction." },
      { property: "og:title", content: "Inventory Management — SmartBPI" },
      { property: "og:description", content: "Keep every SKU above its reorder point with predicted demand." },
    ],
  }),
  component: Inventory,
});

function Inventory() {
  const low = products.filter((product) => product.stock < product.min);

  return (
    <>
      <PageHeader
        eyebrow="04 · Inventory"
        title="Inventory Management"
        description="Catalog health, stock movements, supplier performance and purchase orders in one place."
        actions={
          <Button onClick={() => toast.success("Draft PO created for all SKUs below threshold.")}>
            <Truck className="size-4" /> Auto-create POs
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="SKUs tracked" value="482" change="+12" hint="6 categories" />
        <StatCard label="Below threshold" value={String(low.length)} change="+2" trend="down" hint="Reorder required" />
        <StatCard label="Stock value" value="$1.28M" change="+3.2%" hint="On-hand at cost" />
        <StatCard label="Avg stock cover" value="34 days" change="-4 days" trend="down" hint="Weighted by velocity" />
      </div>

      <Panel title="Product Catalog" description="Stock level against minimum threshold with AI predicted demand" bodyClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead className="w-44">Stock vs min</TableHead>
              <TableHead className="text-right">Unit price</TableHead>
              <TableHead>AI predicted demand</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.sku}>
                <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-muted-foreground">{product.supplier}</TableCell>
                <TableCell>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className={product.stock < product.min ? "font-semibold text-destructive" : "font-medium"}>
                        {product.stock} units
                      </span>
                      <span className="text-muted-foreground">min {product.min}</span>
                    </div>
                    <Progress value={Math.min((product.stock / (product.min * 3)) * 100, 100)} className="h-1.5" />
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums">{currency(product.price)}</TableCell>
                <TableCell>
                  <StatusPill tone={toneForStatus(product.demand)}>
                    <Sparkles className="size-3" /> {product.demand}
                  </StatusPill>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>

      <Tabs defaultValue="movements">
        <TabsList>
          <TabsTrigger value="movements">Stock movements</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="pos">Purchase orders</TabsTrigger>
        </TabsList>

        <TabsContent value="movements" className="mt-4">
          <Panel bodyClassName="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Movement</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockMovements.map((move) => (
                  <TableRow key={move.id}>
                    <TableCell className="font-medium">{move.id}</TableCell>
                    <TableCell className="font-mono text-xs">{move.sku}</TableCell>
                    <TableCell>
                      <StatusPill tone={move.type === "In" ? "success" : "warning"}>{move.type}</StatusPill>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{move.qty}</TableCell>
                    <TableCell className="text-muted-foreground">{move.ref}</TableCell>
                    <TableCell className="text-muted-foreground">{move.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Panel>
        </TabsContent>

        <TabsContent value="suppliers" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {suppliers.map((supplier) => (
              <div key={supplier.name} className="surface-panel p-5">
                <p className="text-sm font-semibold">{supplier.name}</p>
                <dl className="mt-3 space-y-1.5 text-xs">
                  <Row label="Lead time" value={supplier.lead} />
                  <Row label="On-time rate" value={supplier.reliability} />
                  <Row label="Annual spend" value={supplier.spend} />
                  <Row label="Terms" value={supplier.terms} />
                </dl>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pos" className="mt-4">
          <Panel bodyClassName="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseOrders.map((po) => (
                  <TableRow key={po.id}>
                    <TableCell className="font-medium">{po.id}</TableCell>
                    <TableCell>{po.supplier}</TableCell>
                    <TableCell className="font-mono text-xs">{po.sku}</TableCell>
                    <TableCell className="text-right tabular-nums">{po.qty}</TableCell>
                    <TableCell className="text-right tabular-nums">{currency(po.value)}</TableCell>
                    <TableCell>
                      <StatusPill tone={toneForStatus(po.status)}>{po.status}</StatusPill>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Panel>
        </TabsContent>
      </Tabs>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}
