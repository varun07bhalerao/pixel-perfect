import { useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, Search, Settings, UserRound } from "lucide-react";
import { toast } from "sonner";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { signOut, type MockSession, type OnboardingProfile } from "@/lib/auth";

export function AppTopbar({
  session,
  profile,
}: {
  session: MockSession | null;
  profile: OnboardingProfile | null;
}) {
  const navigate = useNavigate();
  const name = session?.name ?? "Operator";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-md">
      <SidebarTrigger />
      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search orders, SKUs, customers, invoices…"
          className="h-10 bg-canvas pl-9"
          onKeyDown={(event) => {
            if (event.key === "Enter") toast.info("Global search is simulated in this demo.");
          }}
        />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <span className="hidden text-xs font-medium text-muted-foreground lg:block">
          {profile?.businessName ?? "SmartBPI Demo Co"} · {profile?.industry ?? "SaaS"}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => navigate({ to: "/app/alerts" })}
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full border border-border px-1.5 py-1.5 transition-colors hover:bg-muted">
              <Avatar className="size-7">
                <AvatarFallback className="bg-primary-soft text-[11px] font-bold text-accent-foreground">
                  {initials || "OP"}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel>
              <p className="text-sm font-semibold">{name}</p>
              <p className="text-xs font-normal text-muted-foreground">{session?.email ?? "demo@smartbpi.ai"}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => toast.info("Profile settings are simulated.")}>
              <UserRound className="size-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => navigate({ to: "/onboarding" })}>
              <Settings className="size-4" /> Business setup
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                signOut();
                toast.success("Signed out");
                navigate({ to: "/login", replace: true });
              }}
            >
              <LogOut className="size-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
