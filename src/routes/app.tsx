import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppTopbar } from "@/components/app-topbar";
import { getOnboarding, onAuthStateChange, type MockSession, type OnboardingProfile } from "@/lib/auth";

export const Route = createFileRoute("/app")({
  ssr: false,
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  const [session, setSession] = useState<MockSession | null>(null);
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((current) => {
      if (!current) {
        navigate({ to: "/login", replace: true });
        return;
      }
      setSession(current);
      setProfile(getOnboarding());
      setChecked(true);
    });
    return () => unsubscribe();
  }, [navigate]);

  if (!checked) {
    return <div className="min-h-screen bg-canvas" />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-canvas">
        <AppSidebar />
        <SidebarInset className="bg-canvas">
          <AppTopbar session={session} profile={profile} />
          <main className="mx-auto w-full max-w-[1500px] space-y-6 p-5 lg:p-7">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
