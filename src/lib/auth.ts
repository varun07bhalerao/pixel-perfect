const SESSION_KEY = "smartbpi.session";
const ONBOARDING_KEY = "smartbpi.onboarding";

export type MockSession = {
  email: string;
  name: string;
  provider: "email" | "google";
};

export type OnboardingProfile = {
  businessName: string;
  industry: string;
  currency: string;
  revenue: string;
  channels: string[];
  inventoryModel: string;
  volume: string;
  approvalLimit: string;
  lowStockLevel: string;
  growthTarget: string;
};

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function getSession(): MockSession | null {
  if (typeof window === "undefined") return null;
  return safeParse<MockSession>(window.localStorage.getItem(SESSION_KEY));
}

export function signIn(session: MockSession) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function signOut() {
  window.localStorage.removeItem(SESSION_KEY);
}

export function getOnboarding(): OnboardingProfile | null {
  if (typeof window === "undefined") return null;
  return safeParse<OnboardingProfile>(window.localStorage.getItem(ONBOARDING_KEY));
}

export function saveOnboarding(profile: OnboardingProfile) {
  window.localStorage.setItem(ONBOARDING_KEY, JSON.stringify(profile));
}

export function nameFromEmail(email: string) {
  const handle = email.split("@")[0] ?? "operator";
  return handle
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
