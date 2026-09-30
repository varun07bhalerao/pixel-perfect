import { Link, useRouterState } from "@tanstack/react-router";
import {
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
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BrandBadge } from "@/components/brand";

const groups = [
  {
    label: "Command",
    items: [{ title: "AI CEO Dashboard", url: "/app/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Operations",
    items: [
      { title: "Sales & Revenue", url: "/app/sales", icon: TrendingUp },
      { title: "Inventory", url: "/app/inventory", icon: Boxes },
      { title: "CRM Intelligence", url: "/app/crm", icon: Users },
      { title: "Finance", url: "/app/finance", icon: Wallet },
      { title: "Marketing", url: "/app/marketing", icon: Megaphone },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { title: "AI & Analytics", url: "/app/analytics", icon: Brain },
      { title: "AI Assistant", url: "/app/assistant", icon: Sparkles },
      { title: "Multi-Agent System", url: "/app/agents", icon: Bot },
      { title: "Document Intelligence", url: "/app/documents", icon: FileScan },
    ],
  },
  {
    label: "Governance",
    items: [
      { title: "Approvals", url: "/app/approvals", icon: ShieldCheck },
      { title: "Smart Alerts", url: "/app/alerts", icon: BellRing },
      { title: "Workflows", url: "/app/workflows", icon: Workflow },
      { title: "Reports", url: "/app/reports", icon: FileBarChart },
    ],
  },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (router) => router.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 justify-center border-b border-sidebar-border px-4 group-data-[collapsible=icon]:px-1.5">
        <BrandBadge to="/app/dashboard" />
      </SidebarHeader>
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3 group-data-[collapsible=icon]:hidden">
        <div className="rounded-lg bg-primary-soft px-3 py-2.5">
          <p className="text-xs font-semibold text-accent-foreground">Trial — 12 days left</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">All 14 modules unlocked</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
