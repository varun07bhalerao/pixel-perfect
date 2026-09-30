import { Link } from "@tanstack/react-router";
import { Hexagon } from "lucide-react";

export function BrandBadge({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-glow">
        <Hexagon className="size-5" strokeWidth={2.4} />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-sm font-extrabold tracking-tight">SmartBPI</span>
        <span className="block text-[11px] font-medium text-muted-foreground">AI Business OS</span>
      </span>
    </Link>
  );
}

export function GoogleMark({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2.5 24 .5 14.6.5 6.5 5.9 2.6 13.8l7.9 6.1C12.4 14 17.7 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.1 24.6c0-1.6-.1-2.8-.4-4.1H24v8.1h12.5c-.3 2.1-1.6 5.2-4.6 7.3l7.7 6c4.6-4.2 6.5-10.3 6.5-17.3z"
      />
      <path fill="#FBBC05" d="M10.5 28.1A14.5 14.5 0 019.7 24c0-1.4.3-2.8.7-4.1l-7.9-6.1A23.5 23.5 0 000 24c0 3.8.9 7.4 2.6 10.5l7.9-6.4z" />
      <path
        fill="#34A853"
        d="M24 47.5c6.2 0 11.5-2 15.6-5.6l-7.7-6c-2.1 1.4-4.8 2.4-7.9 2.4-6.3 0-11.6-4.5-13.5-10.6l-7.9 6.4C6.5 42.1 14.6 47.5 24 47.5z"
      />
    </svg>
  );
}
