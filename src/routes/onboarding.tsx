import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BrandBadge } from "@/components/brand";
import { saveOnboarding, type OnboardingProfile } from "@/lib/auth";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Business setup — SmartBPI" },
      { name: "description", content: "Configure your business profile, operations data and governance thresholds." },
      { property: "og:title", content: "Business setup — SmartBPI" },
      { property: "og:description", content: "Three quick steps before your AI workspace goes live." },
    ],
  }),
  component: Onboarding,
});

const steps = [
  { title: "Business Profile", detail: "Who you are and how big you run." },
  { title: "Operations & Data", detail: "Where sales happen and how stock moves." },
  { title: "Governance & Thresholds", detail: "The limits your agents must respect." },
];

const channelOptions = ["Direct sales", "E-commerce", "Marketplace", "Retail stores", "Partners / resellers"];

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<OnboardingProfile>({
    businessName: "",
    industry: "",
    currency: "USD",
    revenue: "",
    channels: [],
    inventoryModel: "",
    volume: "",
    approvalLimit: "5000",
    lowStockLevel: "15",
    growthTarget: "20",
  });

  const update = <K extends keyof OnboardingProfile>(key: K, value: OnboardingProfile[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const canAdvance =
    step === 0
      ? Boolean(form.businessName && form.industry && form.revenue)
      : step === 1
        ? form.channels.length > 0 && Boolean(form.inventoryModel && form.volume)
        : Boolean(form.approvalLimit && form.lowStockLevel && form.growthTarget);

  function submit() {
    saveOnboarding(form);
    toast.success(`${form.businessName} is configured — your AI workspace is live.`);
    navigate({ to: "/app/dashboard" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="flex h-16 items-center justify-between px-5">
        <BrandBadge />
        <span className="text-xs font-medium text-muted-foreground">Step {step + 1} of 3</span>
      </header>
      <main className="flex flex-1 items-start justify-center px-5 py-8">
        <div className="w-full max-w-2xl space-y-6">
          <div className="space-y-3">
            <h1 className="text-2xl font-bold">Set up your business</h1>
            <Progress value={((step + 1) / 3) * 100} className="h-1.5" />
            <div className="grid gap-2 sm:grid-cols-3">
              {steps.map((item, index) => (
                <div
                  key={item.title}
                  className={`rounded-lg border px-3 py-2.5 text-xs ${
                    index === step
                      ? "border-primary bg-primary-soft text-accent-foreground"
                      : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  <p className="flex items-center gap-1.5 font-semibold">
                    {index < step ? <Check className="size-3" /> : null}
                    {item.title}
                  </p>
                  <p className="mt-0.5">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-panel space-y-5 p-6 shadow-elevated">
            {step === 0 ? (
              <>
                <Field label="Business Name">
                  <Input
                    value={form.businessName}
                    onChange={(event) => update("businessName", event.target.value)}
                    placeholder="Northwind Industries"
                  />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Industry">
                    <Picker
                      value={form.industry}
                      onChange={(value) => update("industry", value)}
                      options={["Retail", "SaaS", "Manufacturing", "Services"]}
                      placeholder="Select industry"
                    />
                  </Field>
                  <Field label="Currency">
                    <Picker
                      value={form.currency}
                      onChange={(value) => update("currency", value)}
                      options={["USD", "EUR", "GBP", "INR", "AED"]}
                      placeholder="Select currency"
                    />
                  </Field>
                </div>
                <Field label="Annual Revenue">
                  <Picker
                    value={form.revenue}
                    onChange={(value) => update("revenue", value)}
                    options={["Under $1M", "$1M – $10M", "$10M – $50M", "$50M – $250M", "$250M+"]}
                    placeholder="Select revenue bracket"
                  />
                </Field>
              </>
            ) : null}

            {step === 1 ? (
              <>
                <Field label="Primary Sales Channels">
                  <div className="grid gap-2 sm:grid-cols-2">
                    {channelOptions.map((channel) => {
                      const active = form.channels.includes(channel);
                      return (
                        <label
                          key={channel}
                          className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm ${
                            active ? "border-primary bg-primary-soft" : "border-border"
                          }`}
                        >
                          <Checkbox
                            checked={active}
                            onCheckedChange={(checked) =>
                              update(
                                "channels",
                                checked ? [...form.channels, channel] : form.channels.filter((c) => c !== channel),
                              )
                            }
                          />
                          {channel}
                        </label>
                      );
                    })}
                  </div>
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Inventory Model">
                    <Picker
                      value={form.inventoryModel}
                      onChange={(value) => update("inventoryModel", value)}
                      options={["Own warehouse", "3PL / outsourced", "Just-in-time", "Dropshipping", "No inventory"]}
                      placeholder="Select model"
                    />
                  </Field>
                  <Field label="Monthly Transaction Volume">
                    <Picker
                      value={form.volume}
                      onChange={(value) => update("volume", value)}
                      options={["Under 500", "500 – 5,000", "5,000 – 50,000", "50,000+"]}
                      placeholder="Select volume"
                    />
                  </Field>
                </div>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <Field label="Manager Approval Limit" hint="Payments above this amount route to the approval queue.">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{form.currency}</span>
                    <Input
                      type="number"
                      min={0}
                      value={form.approvalLimit}
                      onChange={(event) => update("approvalLimit", event.target.value)}
                    />
                  </div>
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Low Stock Alert Level" hint="Units remaining before a reorder alert fires.">
                    <Input
                      type="number"
                      min={0}
                      value={form.lowStockLevel}
                      onChange={(event) => update("lowStockLevel", event.target.value)}
                    />
                  </Field>
                  <Field label="Annual Growth Target (%)">
                    <Input
                      type="number"
                      min={0}
                      value={form.growthTarget}
                      onChange={(event) => update("growthTarget", event.target.value)}
                    />
                  </Field>
                </div>
              </>
            ) : null}

            <div className="flex items-center justify-between border-t border-border pt-5">
              <Button variant="ghost" disabled={step === 0} onClick={() => setStep((prev) => prev - 1)}>
                <ArrowLeft className="size-4" /> Back
              </Button>
              {step < 2 ? (
                <Button disabled={!canAdvance} onClick={() => setStep((prev) => prev + 1)}>
                  Continue <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button disabled={!canAdvance} onClick={submit}>
                  Finish setup <Check className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function Picker({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
