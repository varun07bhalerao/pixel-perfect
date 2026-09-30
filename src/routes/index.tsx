import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  BellRing,
  Bot,
  Boxes,
  Brain,
  CheckCircle2,
  FileBarChart,
  FileScan,
  LayoutDashboard,
  Megaphone,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  Workflow,
} from "lucide-react";
import { PublicFooter, PublicHeader } from "@/components/public-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusPill } from "@/components/app-ui";
import { criticalAlerts, kpis, modules, revenueSeries, currency } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmartBPI — Autonomous Business Intelligence & Process Automation" },
      {
        name: "description",
        content:
          "SmartBPI is an AI business operating system unifying ERP, CRM, finance and operations decision-making for any business type.",
      },
      { property: "og:title", content: "SmartBPI — Autonomous Business Intelligence" },
      {
        property: "og:description",
        content:
          "One AI operating system for revenue, inventory, finance, customers and workflows.",
      },
    ],
  }),
  component: Landing,
});

const moduleIcons = [
  LayoutDashboard,
  TrendingUp,
  Boxes,
  Users,
  Wallet,
  Megaphone,
  Brain,
  Sparkles,
  Bot,
  FileScan,
  ShieldCheck,
  BellRing,
  Workflow,
  FileBarChart,
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main>
        <Hero />
        <AboutSection />
        <FeaturesSection />
        <ContactSection />
      </main>
      <PublicFooter />
    </div>
  );
}

function Hero() {
  const peak = Math.max(...revenueSeries.map((point) => point.revenue));

  return (
    <section id="home" className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 grid-canvas opacity-60" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1.05fr_1fr] lg:py-28">
        <div className="space-y-7">
          <StatusPill tone="primary">
            <Sparkles className="size-3" /> 14 modules · 6 autonomous agents
          </StatusPill>
          <h1 className="text-[2rem] font-extrabold leading-[1.1] sm:text-5xl lg:text-[3.4rem]">
            Autonomous Business Intelligence &amp; Process Automation for Modern Enterprises
          </h1>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            SmartBPI reads your sales, stock, cash and customer signals in real time, then
            recommends — and executes — the next best action. One clean workspace instead of five
            disconnected systems.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/signup">
                Start Free Trial <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/login">Live Interactive Demo</Link>
            </Button>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {["No credit card required", "Deploys in under a day", "SOC 2 Type II"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-success" /> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="surface-panel overflow-hidden shadow-elevated">
          <div className="flex items-center justify-between border-b border-border bg-canvas px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              AI CEO Dashboard — live preview
            </p>
            <StatusPill tone="success">Synced</StatusPill>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
            {kpis.slice(0, 3).map((kpi) => (
              <div key={kpi.label} className="rounded-lg border border-border p-3">
                <p className="text-[11px] font-medium text-muted-foreground">{kpi.label}</p>
                <p className="mt-1 text-lg font-bold tabular-nums">{kpi.value}</p>
                <p className="text-[11px] font-semibold text-success-foreground">{kpi.change}</p>
              </div>
            ))}
          </div>
          <div className="px-4">
            <div className="flex h-32 items-end gap-1.5 rounded-lg border border-border bg-canvas p-3">
              {revenueSeries.map((point) => (
                <div key={point.month} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-primary/85"
                    style={{ height: `${(point.revenue / peak) * 90}px` }}
                  />
                  <span className="text-[9px] text-muted-foreground">{point.month}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2 p-4">
            {criticalAlerts.slice(0, 2).map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold">{alert.title}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{alert.detail}</p>
                </div>
                <StatusPill tone={alert.severity === "critical" ? "danger" : "warning"}>
                  {alert.action}
                </StatusPill>
              </div>
            ))}
            <p className="pt-1 text-[11px] text-muted-foreground">
              Cash position {currency(revenueSeries.at(-1)!.cash)} this month · 4 pending approvals
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="border-b border-border bg-canvas">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-2">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">About Us</p>
          <h2 className="text-2xl font-bold sm:text-3xl">
            One AI operating system instead of five disconnected tools
          </h2>
          <p className="text-muted-foreground">
            Most companies run ERP, CRM, accounting, inventory and marketing analytics in separate
            silos, then spend the week reconciling them. SmartBPI unifies those data streams into a
            single decision layer that works for retail, SaaS, manufacturing and services alike.
          </p>
          <p className="text-muted-foreground">
            Every module shares one business graph, so an inventory shortfall, a churn signal and a
            cash-flow gap are understood as one connected story — with an audit trail on every
            automated action.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { stat: "63%", label: "Less manual reconciliation work" },
            { stat: "4.1x", label: "Faster exception resolution" },
            { stat: "18%", label: "Average working-capital release" },
            { stat: "14", label: "Operational modules out of the box" },
          ].map((item) => (
            <div key={item.label} className="surface-panel p-6">
              <p className="text-3xl font-extrabold text-primary">{item.stat}</p>
              <p className="mt-2 text-sm text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="border-b border-border">
      <div className="mx-auto max-w-7xl px-5 py-20">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Features &amp; Modules
          </p>
          <h2 className="text-2xl font-bold sm:text-3xl">
            14 core operational modules, one workspace
          </h2>
          <p className="text-muted-foreground">
            Each module ships with dashboards, tables and AI recommendations. Open the demo
            workspace to explore them with realistic data.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module, index) => {
            const Icon = moduleIcons[index] ?? Sparkles;
            return (
              <Link
                key={module.slug}
                to="/login"
                className="surface-panel group p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevated"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-accent-foreground">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 text-sm font-semibold">
                  {String(index + 2).padStart(2, "0")} · {module.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{module.blurb}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Open module <ArrowRight className="size-3" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [size, setSize] = useState("");

  return (
    <section id="contact" className="bg-canvas">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Contact Us
          </p>
          <h2 className="text-2xl font-bold sm:text-3xl">Talk to the SmartBPI team</h2>
          <p className="text-muted-foreground">
            Tell us about your operation and we will map your modules, data sources and automation
            rules before your trial starts.
          </p>
          <div className="space-y-3 pt-2 text-sm text-muted-foreground">
            <p>hello@smartbpi.ai</p>
            <p>Mon–Fri · 09:00–18:00 · Global support coverage</p>
          </div>
        </div>
        <form
          className="surface-panel space-y-4 p-6"
          onSubmit={(event) => {
            event.preventDefault();
            toast.success("Message sent — our team will reply within one business day.");
            (event.target as HTMLFormElement).reset();
            setSize("");
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" required placeholder="Ada Okafor" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workEmail">Work Email</Label>
              <Input id="workEmail" type="email" required placeholder="ada@company.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Company Size</Label>
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger>
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                {["1–20", "21–100", "101–500", "501–2,000", "2,000+"].map((option) => (
                  <SelectItem key={option} value={option}>
                    {option} employees
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              rows={4}
              required
              placeholder="What would you like to automate first?"
            />
          </div>
          <Button type="submit" size="lg" className="w-full">
            Send Message
          </Button>
        </form>
      </div>
    </section>
  );
}
