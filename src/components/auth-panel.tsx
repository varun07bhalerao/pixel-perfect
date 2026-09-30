import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandBadge, GoogleMark } from "@/components/brand";
import { loginWithEmail, signupWithEmail, signInWithGoogle } from "@/lib/auth";

export function AuthPanel({ mode }: { mode: "login" | "signup" }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function complete(provider: "email" | "google") {
    setLoading(true);
    try {
      if (provider === "google") {
        await signInWithGoogle();
      } else {
        if (mode === "signup") {
          await signupWithEmail(email, password);
        } else {
          await loginWithEmail(email, password);
        }
      }
      toast.success(mode === "signup" ? "Account created" : "Welcome back");
      navigate({ to: "/onboarding" });
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="flex h-16 items-center px-5">
        <BrandBadge />
      </header>
      <main className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-md space-y-5">
          <div className="space-y-1.5 text-center">
            <h1 className="text-2xl font-bold">
              {mode === "signup" ? "Create your SmartBPI workspace" : "Sign in to SmartBPI"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "signup"
                ? "Free 14-day trial with every module unlocked."
                : "Pick up where your agents left off."}
            </p>
          </div>

          <div className="surface-panel space-y-5 p-6 shadow-elevated">
            <Tabs
              value={mode}
              onValueChange={(value) => navigate({ to: value === "signup" ? "/signup" : "/login" })}
            >
              <TabsList className="w-full">
                <TabsTrigger value="login" className="flex-1">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="flex-1">
                  Sign Up
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              disabled={loading}
              onClick={() => complete("google")}
            >
              <GoogleMark /> Continue with Google
            </Button>

            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">Or continue with email</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                complete("email");
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="email">Business Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox id="remember" defaultChecked /> Remember me
                </label>
                <button
                  type="button"
                  className="text-sm font-medium text-primary"
                  onClick={() => toast.info("Password recovery is simulated in this demo.")}
                >
                  Forgot password?
                </button>
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {mode === "signup" ? "Create account" : "Sign in"}
              </Button>
            </form>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Demo environment — credentials are stored locally in your browser only.
          </p>
        </div>
      </main>
    </div>
  );
}
