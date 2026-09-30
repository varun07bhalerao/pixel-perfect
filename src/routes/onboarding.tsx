import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  UploadCloud,
  FileCheck,
  Loader2,
  X,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BrandBadge } from "@/components/brand";
import {
  getOnboarding,
  saveOnboarding,
  onAuthStateChange,
  isOnboardingCompleted,
  type MockSession,
  type OnboardingProfile,
} from "@/lib/auth";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Business setup — SmartBPI" },
      {
        name: "description",
        content: "Configure your business owner, business details, operations and governance.",
      },
      { property: "og:title", content: "Business setup — SmartBPI" },
      {
        property: "og:description",
        content: "Complete your 5-step setup to launch your AI workspace.",
      },
    ],
  }),
  component: Onboarding,
});

const steps = [
  { title: "Business Owner", detail: "Tell us about the person responsible for this business." },
  { title: "Business Details", detail: "Tell us about your business." },
  { title: "Business Profile", detail: "Who you are and how big you run." },
  { title: "Operations & Data", detail: "Where sales happen and how stock moves." },
  { title: "Governance & Thresholds", detail: "The limits your agents must respect." },
];

const channelOptions = [
  "Direct sales",
  "E-commerce",
  "Marketplace",
  "Retail stores",
  "Partners / resellers",
];

const businessTypeOptions = [
  "Sole Proprietorship",
  "Partnership",
  "LLP",
  "Private Limited",
  "Public Limited",
  "Other",
];

const industryOptions = [
  "Retail",
  "Manufacturing",
  "IT / Software",
  "Food & Beverage",
  "Healthcare",
  "Education",
  "Construction",
  "Finance",
  "Agriculture",
  "Logistics",
  "Other",
];

const revenueBracketOptions = [
  "Below ₹5 Lakh",
  "₹5 Lakh – ₹10 Lakh",
  "₹10 Lakh – ₹25 Lakh",
  "₹25 Lakh – ₹50 Lakh",
  "₹50 Lakh – ₹1 Crore",
  "₹1 Crore – ₹5 Crore",
  "₹5 Crore – ₹10 Crore",
  "Above ₹10 Crore",
  "Prefer not to say",
];

const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];

const ownerRoleOptions = [
  "Owner",
  "Founder",
  "Co-Founder",
  "Managing Director",
  "Partner",
  "Other",
];

const languageOptions = [
  "English",
  "Hindi",
  "Marathi",
  "Bengali",
  "Telugu",
  "Tamil",
  "Gujarati",
  "Kannada",
  "Other",
];

const employeeCountOptions = ["1 – 5", "6 – 20", "21 – 50", "51 – 200", "200+"];

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [session, setSession] = useState<MockSession | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<OnboardingProfile>(() => {
    const saved = getOnboarding();
    return {
      // Step 1: Business Owner
      ownerName: saved?.ownerName || "",
      ownerEmail: saved?.ownerEmail || "",
      ownerPhone: saved?.ownerPhone || "",
      ownerAge: saved?.ownerAge || "",
      ownerGender: saved?.ownerGender || "",
      ownerRole: saved?.ownerRole || "Owner",
      yearsOfExperience: saved?.yearsOfExperience || "",
      preferredLanguage: saved?.preferredLanguage || "English",

      // Step 2: Business Details
      businessName: saved?.businessName || "",
      businessType: saved?.businessType || "",
      industry: saved?.industry || "",
      address: saved?.address || "",
      city: saved?.city || "",
      state: saved?.state || "",
      pincode: saved?.pincode || "",
      udyamCertificateUrl: saved?.udyamCertificateUrl || "",
      udyamCertificateName: saved?.udyamCertificateName || "",
      gstNumber: saved?.gstNumber || "",
      annualRevenue: saved?.annualRevenue || saved?.revenue || "",
      employeeCount: saved?.employeeCount || "",
      establishedYear: saved?.establishedYear || "",
      website: saved?.website || "",
      description: saved?.description || "",

      // Step 3: Business Profile
      currency: saved?.currency || "INR",
      revenue: saved?.revenue || saved?.annualRevenue || "",

      // Step 4: Operations & Data
      channels: saved?.channels || [],
      inventoryModel: saved?.inventoryModel || "",
      volume: saved?.volume || "",

      // Step 5: Governance & Thresholds
      approvalLimit: saved?.approvalLimit || "50000",
      lowStockLevel: saved?.lowStockLevel || "15",
      growthTarget: saved?.growthTarget || "20",
    };
  });

  // Check auth and auto-populate user data from Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentSession) => {
      if (currentSession) {
        setSession(currentSession);
        setForm((prev) => ({
          ...prev,
          ownerName: prev.ownerName || currentSession.name || "",
          ownerEmail: prev.ownerEmail || currentSession.email || "",
          ownerPhone: prev.ownerPhone || currentSession.phone || "",
        }));

        // If user already completed onboarding, redirect to dashboard
        isOnboardingCompleted(currentSession.uid).then((isDone) => {
          if (isDone && !window.location.search.includes("edit=true")) {
            // navigate({ to: "/app/dashboard" });
          }
        });
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const update = <K extends keyof OnboardingProfile>(key: K, value: OnboardingProfile[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      // Keep annualRevenue and revenue in sync across steps
      if (key === "annualRevenue") {
        next.revenue = value as string;
      } else if (key === "revenue") {
        next.annualRevenue = value as string;
      }
      return next;
    });
  };

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isTouched = (field: string) => Boolean(touched[field]);

  // Step Validations
  const isStep0Valid = Boolean(
    form.ownerName.trim() &&
    form.ownerEmail.trim() &&
    form.ownerPhone.trim() &&
    form.ownerAge.trim() &&
    Number(form.ownerAge) >= 18 &&
    Number(form.ownerAge) <= 100 &&
    form.ownerGender &&
    form.ownerRole &&
    form.yearsOfExperience.trim() &&
    Number(form.yearsOfExperience) >= 0 &&
    form.preferredLanguage,
  );

  const isStep1Valid = Boolean(
    form.businessName.trim() &&
    form.businessType &&
    form.industry &&
    form.address.trim() &&
    form.city.trim() &&
    form.state &&
    form.pincode.trim() &&
    form.pincode.trim().length === 6 &&
    form.annualRevenue &&
    form.employeeCount &&
    form.establishedYear.trim() &&
    form.udyamCertificateName, // Certificate uploaded
  );

  const isStep2Valid = Boolean(
    form.businessName.trim() &&
    form.industry &&
    form.currency &&
    (form.revenue || form.annualRevenue),
  );

  const isStep3Valid = Boolean(form.channels.length > 0 && form.inventoryModel && form.volume);

  const isStep4Valid = Boolean(
    form.approvalLimit.trim() &&
    Number(form.approvalLimit) >= 0 &&
    form.lowStockLevel.trim() &&
    Number(form.lowStockLevel) >= 0 &&
    form.growthTarget.trim() &&
    Number(form.growthTarget) >= 0,
  );

  const canAdvance =
    step === 0
      ? isStep0Valid
      : step === 1
        ? isStep1Valid
        : step === 2
          ? isStep2Valid
          : step === 3
            ? isStep3Valid
            : isStep4Valid;

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate type: CSV or Excel only (.csv, .xlsx, .xls)
    const validExtensions = [".csv", ".xlsx", ".xls"];
    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    const isCsvOrExcel =
      validExtensions.includes(fileExtension) ||
      file.type === "text/csv" ||
      file.type === "application/vnd.ms-excel" ||
      file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    if (!isCsvOrExcel) {
      toast.error("Please upload a .csv or Excel (.xlsx, .xls) file only.");
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB.");
      return;
    }

    setUploadingFile(true);
    try {
      // Keep it client-side without storing to external storage
      await new Promise((r) => setTimeout(r, 200));
      update("udyamCertificateUrl", "");
      update("udyamCertificateName", file.name);
      toast.success(`"${file.name}" uploaded successfully.`);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to process file.");
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleRemoveCertificate() {
    update("udyamCertificateUrl", "");
    update("udyamCertificateName", "");
    toast.info("File removed. Please attach a valid .csv or Excel file.");
  }

  async function submit() {
    setIsSubmitting(true);
    try {
      await saveOnboarding(form, session);
      toast.success(
        `${form.businessName || "Your business"} is configured — your AI workspace is live.`,
      );
      navigate({ to: "/app/dashboard" });
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to finalize business setup.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      {/* Top Header */}
      <header className="flex h-16 items-center justify-between px-5">
        <BrandBadge />
        <span className="text-xs font-medium text-muted-foreground">Step {step + 1} of 5</span>
      </header>

      {/* Main Container */}
      <main className="flex flex-1 items-start justify-center px-5 py-8">
        <div className="w-full max-w-2xl space-y-6">
          {/* Progress Header */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold">Set up your business</h1>
            <Progress value={((step + 1) / 5) * 100} className="h-1.5" />

            {/* 5-Step Progress Indicators */}
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {steps.map((item, index) => (
                <div
                  key={item.title}
                  className={`rounded-lg border px-3 py-2.5 text-xs transition-colors ${
                    index === step
                      ? "border-primary bg-primary-soft text-accent-foreground shadow-sm"
                      : index < step
                        ? "border-primary/40 bg-background text-foreground"
                        : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  <p className="flex items-center gap-1.5 font-semibold">
                    {index < step ? <Check className="size-3 text-primary" /> : null}
                    <span className="truncate">{item.title}</span>
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-[11px] leading-tight text-muted-foreground">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="surface-panel space-y-6 p-6 shadow-elevated">
            {/* ============================================================== */}
            {/* STEP 1: BUSINESS OWNER                                         */}
            {/* ============================================================== */}
            {step === 0 && (
              <div className="space-y-5">
                <div className="space-y-1 border-b border-border pb-3">
                  <h2 className="text-base font-semibold">Business Owner</h2>
                  <p className="text-xs text-muted-foreground">
                    Tell us about the person responsible for this business.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Full Name *"
                    error={
                      isTouched("ownerName") && !form.ownerName.trim()
                        ? "Full name is required"
                        : undefined
                    }
                  >
                    <Input
                      value={form.ownerName}
                      onChange={(e) => update("ownerName", e.target.value)}
                      onBlur={() => markTouched("ownerName")}
                      placeholder="e.g. Varun Bhalerao"
                    />
                  </Field>

                  <Field
                    label="Email Address *"
                    hint={session?.email ? "Verified via Firebase authentication" : undefined}
                    error={
                      isTouched("ownerEmail") && !form.ownerEmail.trim()
                        ? "Valid email address is required"
                        : undefined
                    }
                  >
                    <Input
                      type="email"
                      value={form.ownerEmail}
                      onChange={(e) => update("ownerEmail", e.target.value)}
                      onBlur={() => markTouched("ownerEmail")}
                      placeholder="you@company.com"
                      readOnly={Boolean(session?.email)}
                      className={
                        session?.email ? "bg-muted/40 text-muted-foreground cursor-not-allowed" : ""
                      }
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Phone Number *"
                    hint="For two-factor alerts and critical notifications"
                    error={
                      isTouched("ownerPhone") && !form.ownerPhone.trim()
                        ? "Phone number is required"
                        : undefined
                    }
                  >
                    <Input
                      type="tel"
                      value={form.ownerPhone}
                      onChange={(e) => update("ownerPhone", e.target.value)}
                      onBlur={() => markTouched("ownerPhone")}
                      placeholder="+91 98765 43210"
                    />
                  </Field>

                  <Field
                    label="Age *"
                    error={
                      isTouched("ownerAge") &&
                      (!form.ownerAge || Number(form.ownerAge) < 18 || Number(form.ownerAge) > 100)
                        ? "Enter a valid age (18 - 100)"
                        : undefined
                    }
                  >
                    <Input
                      type="number"
                      min={18}
                      max={100}
                      value={form.ownerAge}
                      onChange={(e) => update("ownerAge", e.target.value)}
                      onBlur={() => markTouched("ownerAge")}
                      placeholder="e.g. 32"
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Gender *">
                    <Picker
                      value={form.ownerGender}
                      onChange={(val) => update("ownerGender", val)}
                      options={genderOptions}
                      placeholder="Select gender"
                    />
                  </Field>

                  <Field label="Owner Role *">
                    <Picker
                      value={form.ownerRole}
                      onChange={(val) => update("ownerRole", val)}
                      options={ownerRoleOptions}
                      placeholder="Select role"
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Years of Business Experience *"
                    error={
                      isTouched("yearsOfExperience") &&
                      (!form.yearsOfExperience || Number(form.yearsOfExperience) < 0)
                        ? "Enter valid years of experience"
                        : undefined
                    }
                  >
                    <Input
                      type="number"
                      min={0}
                      max={70}
                      value={form.yearsOfExperience}
                      onChange={(e) => update("yearsOfExperience", e.target.value)}
                      onBlur={() => markTouched("yearsOfExperience")}
                      placeholder="e.g. 5"
                    />
                  </Field>

                  <Field label="Preferred Language *">
                    <Picker
                      value={form.preferredLanguage}
                      onChange={(val) => update("preferredLanguage", val)}
                      options={languageOptions}
                      placeholder="Select language"
                    />
                  </Field>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 2: BUSINESS DETAILS                                       */}
            {/* ============================================================== */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="space-y-1 border-b border-border pb-3">
                  <h2 className="text-base font-semibold">Business Details</h2>
                  <p className="text-xs text-muted-foreground">Tell us about your business.</p>
                </div>

                <Field
                  label="Business Name *"
                  error={
                    isTouched("businessName") && !form.businessName.trim()
                      ? "Business name is required"
                      : undefined
                  }
                >
                  <Input
                    value={form.businessName}
                    onChange={(e) => update("businessName", e.target.value)}
                    onBlur={() => markTouched("businessName")}
                    placeholder="Northwind Industries Pvt Ltd"
                  />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Business Type *">
                    <Picker
                      value={form.businessType}
                      onChange={(val) => update("businessType", val)}
                      options={businessTypeOptions}
                      placeholder="Select business type"
                    />
                  </Field>

                  <Field label="Industry *">
                    <Picker
                      value={form.industry}
                      onChange={(val) => update("industry", val)}
                      options={industryOptions}
                      placeholder="Select industry"
                    />
                  </Field>
                </div>

                {/* Business Location */}
                <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-4">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Business Location *
                  </Label>

                  <Field
                    label="Address *"
                    error={
                      isTouched("address") && !form.address.trim()
                        ? "Street address is required"
                        : undefined
                    }
                  >
                    <Input
                      value={form.address}
                      onChange={(e) => update("address", e.target.value)}
                      onBlur={() => markTouched("address")}
                      placeholder="Plot No. 42, MIDC Industrial Area"
                    />
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field
                      label="City *"
                      error={isTouched("city") && !form.city.trim() ? "City is required" : undefined}
                    >
                      <Input
                        value={form.city}
                        onChange={(e) => update("city", e.target.value)}
                        onBlur={() => markTouched("city")}
                        placeholder="Pune"
                      />
                    </Field>

                    <Field label="State *">
                      <Picker
                        value={form.state}
                        onChange={(val) => update("state", val)}
                        options={indianStates}
                        placeholder="Select State"
                      />
                    </Field>

                    <Field
                      label="PIN Code *"
                      error={
                        isTouched("pincode") &&
                        (!form.pincode.trim() || form.pincode.trim().length !== 6)
                          ? "Enter 6-digit PIN code"
                          : undefined
                      }
                    >
                      <Input
                        value={form.pincode}
                        onChange={(e) =>
                          update("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        onBlur={() => markTouched("pincode")}
                        placeholder="411001"
                        maxLength={6}
                      />
                    </Field>
                  </div>
                </div>

                {/* Udyam Registration Certificate Upload */}
                <Field
                  label="Udyam Registration File *"
                  hint="Upload file in .csv or Excel (.xlsx, .xls) format (up to 10MB)"
                  error={
                    isTouched("udyam") && !form.udyamCertificateName
                      ? "Udyam registration file (.csv or Excel) is required"
                      : undefined
                  }
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".csv,.xlsx,.xls,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    className="hidden"
                    id="udyam-upload"
                  />

                  {form.udyamCertificateName ? (
                    <div className="flex items-center justify-between rounded-lg border border-primary/40 bg-primary-soft/40 p-3.5">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                          <FileCheck className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {form.udyamCertificateName}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 font-medium text-emerald-600">
                            <Check className="size-3.5 text-emerald-600" /> Upload complete
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingFile}
                        >
                          Replace
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-destructive"
                          onClick={handleRemoveCertificate}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                        uploadingFile
                          ? "border-primary bg-muted/40 cursor-wait"
                          : "border-border hover:border-primary/60 hover:bg-muted/30"
                      }`}
                    >
                      {uploadingFile ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="size-8 animate-spin text-primary" />
                          <p className="text-sm font-medium">Processing file...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex size-10 items-center justify-center rounded-full bg-primary-soft text-primary">
                            <UploadCloud className="size-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              <span className="text-primary underline">Click to upload</span> or
                              drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                              CSV or Excel (.xlsx, .xls) (max 10MB)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Field>

                {/* GST Number */}
                <Field label="GST Number (Optional)" hint="15-digit GSTIN (e.g. 27AAAAA0000A1Z5)">
                  <Input
                    value={form.gstNumber}
                    onChange={(e) => update("gstNumber", e.target.value.toUpperCase())}
                    placeholder="27AAAAA0000A1Z5"
                    maxLength={15}
                  />
                </Field>

                {/* Revenue and Employees */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Annual Revenue *">
                    <Picker
                      value={form.annualRevenue}
                      onChange={(val) => update("annualRevenue", val)}
                      options={revenueBracketOptions}
                      placeholder="Select revenue bracket"
                    />
                  </Field>

                  <Field label="Number of Employees *">
                    <Picker
                      value={form.employeeCount}
                      onChange={(val) => update("employeeCount", val)}
                      options={employeeCountOptions}
                      placeholder="Select employee range"
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Year Business Started *"
                    error={
                      isTouched("establishedYear") &&
                      (!form.establishedYear ||
                        Number(form.establishedYear) < 1800 ||
                        Number(form.establishedYear) > new Date().getFullYear())
                        ? "Enter a valid start year"
                        : undefined
                    }
                  >
                    <Input
                      type="number"
                      min={1850}
                      max={new Date().getFullYear()}
                      value={form.establishedYear}
                      onChange={(e) => update("establishedYear", e.target.value)}
                      onBlur={() => markTouched("establishedYear")}
                      placeholder="e.g. 2018"
                    />
                  </Field>

                  <Field label="Business Website (Optional)">
                    <Input
                      type="url"
                      value={form.website}
                      onChange={(e) => update("website", e.target.value)}
                      placeholder="https://yourbusiness.com"
                    />
                  </Field>
                </div>

                <Field label="Business Description (Optional)">
                  <Textarea
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder="Briefly describe what your business does."
                    rows={3}
                  />
                </Field>
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 3: BUSINESS PROFILE (EXISTING STEP 1)                     */}
            {/* ============================================================== */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="space-y-1 border-b border-border pb-3">
                  <h2 className="text-base font-semibold">Business Profile</h2>
                  <p className="text-xs text-muted-foreground">Who you are and how big you run.</p>
                </div>

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
                      options={industryOptions}
                      placeholder="Select industry"
                    />
                  </Field>
                  <Field label="Currency">
                    <Picker
                      value={form.currency}
                      onChange={(value) => update("currency", value)}
                      options={["INR", "USD", "EUR", "GBP", "AED"]}
                      placeholder="Select currency"
                    />
                  </Field>
                </div>

                <Field label="Annual Revenue">
                  <Picker
                    value={form.annualRevenue || form.revenue}
                    onChange={(value) => update("annualRevenue", value)}
                    options={revenueBracketOptions}
                    placeholder="Select revenue bracket"
                  />
                </Field>
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 4: OPERATIONS & DATA (EXISTING STEP 2)                    */}
            {/* ============================================================== */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="space-y-1 border-b border-border pb-3">
                  <h2 className="text-base font-semibold">Operations & Data</h2>
                  <p className="text-xs text-muted-foreground">
                    Where sales happen and how stock moves.
                  </p>
                </div>

                <Field label="Primary Sales Channels">
                  <div className="grid gap-2 sm:grid-cols-2">
                    {channelOptions.map((channel) => {
                      const active = form.channels.includes(channel);
                      return (
                        <label
                          key={channel}
                          className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                            active
                              ? "border-primary bg-primary-soft text-foreground"
                              : "border-border bg-background"
                          }`}
                        >
                          <Checkbox
                            checked={active}
                            onCheckedChange={(checked) =>
                              update(
                                "channels",
                                checked
                                  ? [...form.channels, channel]
                                  : form.channels.filter((c) => c !== channel),
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
                      options={[
                        "Own warehouse",
                        "3PL / outsourced",
                        "Just-in-time",
                        "Dropshipping",
                        "No inventory",
                      ]}
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
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 5: GOVERNANCE & THRESHOLDS (EXISTING STEP 3)              */}
            {/* ============================================================== */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="space-y-1 border-b border-border pb-3">
                  <h2 className="text-base font-semibold">Governance & Thresholds</h2>
                  <p className="text-xs text-muted-foreground">
                    The limits your agents must respect.
                  </p>
                </div>

                <Field
                  label="Manager Approval Limit"
                  hint="Payments above this amount route to the approval queue."
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      {form.currency}
                    </span>
                    <Input
                      type="number"
                      min={0}
                      value={form.approvalLimit}
                      onChange={(event) => update("approvalLimit", event.target.value)}
                    />
                  </div>
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Low Stock Alert Level"
                    hint="Units remaining before a reorder alert fires."
                  >
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
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between border-t border-border pt-5">
              <Button
                variant="ghost"
                disabled={step === 0 || isSubmitting}
                onClick={() => setStep((prev) => prev - 1)}
              >
                <ArrowLeft className="size-4" /> Back
              </Button>

              {step < 4 ? (
                <Button
                  disabled={!canAdvance || uploadingFile}
                  onClick={() => setStep((prev) => prev + 1)}
                >
                  Continue <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button disabled={!canAdvance || isSubmitting} onClick={submit}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-1" /> Saving...
                    </>
                  ) : (
                    <>
                      Finish setup <Check className="size-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string | undefined;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      {hint && !error ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {error ? (
        <p className="flex items-center gap-1 text-xs text-destructive">
          <AlertCircle className="size-3 shrink-0" /> {error}
        </p>
      ) : null}
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
      <SelectContent className="max-h-60">
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
