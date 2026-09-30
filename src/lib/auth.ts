import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dummy-auth-domain",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dummy-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dummy-storage-bucket",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "dummy-sender-id",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "dummy-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signupWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export type MockSession = {
  email: string;
  name: string;
  provider: "email" | "google";
};

export function onAuthStateChange(callback: (session: MockSession | null) => void) {
  return onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      callback({
        email: user.email || "",
        name: user.displayName || nameFromEmail(user.email || ""),
        provider: user.providerData.some(p => p.providerId === "google.com") ? "google" : "email"
      });
    } else {
      callback(null);
    }
  });
}

const ONBOARDING_KEY = "smartbpi.onboarding";
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
