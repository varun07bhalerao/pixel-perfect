import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { BrandBadge } from "@/components/brand";

const navLinks = [
  { label: "Home", hash: "home" },
  { label: "About Us", hash: "about" },
  { label: "Features & Modules", hash: "features" },
  { label: "Contact Us", hash: "contact" },
];

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5">
        <BrandBadge />
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((item) => (
            <a
              key={item.hash}
              href={`/#${item.hash}`}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Log In</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/signup">Get Started Free</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-canvas">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <BrandBadge />
          <p className="max-w-xs text-sm text-muted-foreground">
            The autonomous operating layer for revenue, inventory, finance and customer decisions.
          </p>
        </div>
        <FooterCol title="Platform" items={["AI CEO Dashboard", "Multi-Agent System", "Analytics Engine", "Workflow Automation"]} />
        <FooterCol title="Company" items={["About Us", "Careers", "Security", "Contact Us"]} />
        <div className="space-y-3">
          <p className="text-sm font-semibold">Compliance</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-success" /> SOC 2 Type II — Certified
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-success" /> GDPR — Compliant
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-warning" /> ISO 27001 — In audit
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border px-5 py-5 text-center text-xs text-muted-foreground">
        © 2026 SmartBPI. All rights reserved. Demo environment with simulated data.
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold">{title}</p>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
