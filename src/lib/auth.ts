import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  type User,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  type Firestore,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  type FirebaseStorage,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: (import.meta.env["VITE_FIREBASE_API_KEY"] as string | undefined) || "dummy-api-key",
  authDomain: (import.meta.env["VITE_FIREBASE_AUTH_DOMAIN"] as string | undefined) || "dummy-auth-domain",
  projectId: (import.meta.env["VITE_FIREBASE_PROJECT_ID"] as string | undefined) || "dummy-project-id",
  storageBucket: (import.meta.env["VITE_FIREBASE_STORAGE_BUCKET"] as string | undefined) || "dummy-storage-bucket",
  messagingSenderId: (import.meta.env["VITE_FIREBASE_MESSAGING_SENDER_ID"] as string | undefined) || "dummy-sender-id",
  appId: (import.meta.env["VITE_FIREBASE_APP_ID"] as string | undefined) || "dummy-app-id",
};

const existingApp = getApps()[0];
const app = existingApp ?? initializeApp(firebaseConfig);
export const auth = getAuth(app);
let dbInstance: Firestore | null = null;
try {
  dbInstance = getFirestore(app);
} catch (e) {
  console.warn("Firestore not available:", e);
}

let storageInstance: FirebaseStorage | null = null;
try {
  storageInstance = getStorage(app);
} catch (e) {
  console.warn("Firebase Storage not available:", e);
}

export const db = dbInstance;
export const storage = storageInstance;
const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signupWithEmail(
  email: string,
  password: string,
  fullName?: string,
  phone?: string,
) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (fullName) {
    await updateProfile(userCredential.user, { displayName: fullName });
  }
  return userCredential;
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export type MockSession = {
  uid: string;
  email: string;
  name: string;
  phone?: string | undefined;
  photoURL?: string | undefined;
  emailVerified?: boolean | undefined;
  provider: "email" | "google";
};

export function onAuthStateChange(callback: (session: MockSession | null) => void) {
  return onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email || "",
        name: user.displayName || nameFromEmail(user.email || ""),
        phone: user.phoneNumber || "",
        photoURL: user.photoURL || undefined,
        emailVerified: user.emailVerified,
        provider: user.providerData.some((p) => p.providerId === "google.com") ? "google" : "email",
      });
    } else {
      callback(null);
    }
  });
}

const ONBOARDING_KEY = "smartbpi.onboarding";

export type OnboardingProfile = {
  // Step 1: Business Owner
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerAge: string;
  ownerGender: string;
  ownerRole: string;
  yearsOfExperience: string;
  preferredLanguage: string;

  // Step 2: Business Details
  businessName: string;
  businessType: string;
  industry: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  udyamCertificateUrl?: string | undefined;
  udyamCertificateName?: string | undefined;
  gstNumber?: string | undefined;
  annualRevenue: string;
  employeeCount: string;
  establishedYear: string;
  website?: string | undefined;
  description?: string | undefined;

  // Step 3: Business Profile
  currency: string;
  revenue: string;

  // Step 4: Operations & Data
  channels: string[];
  inventoryModel: string;
  volume: string;

  // Step 5: Governance & Thresholds
  approvalLimit: string;
  lowStockLevel: string;
  growthTarget: string;

  // Metadata
  completed?: boolean | undefined;
  completedAt?: string | undefined;
  userId?: string | undefined;
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

export async function saveOnboarding(profile: OnboardingProfile, userSession?: MockSession | null) {
  const currentUid = userSession?.uid || auth.currentUser?.uid || "demo-user";
  const updatedProfile: OnboardingProfile = {
    ...profile,
    userId: currentUid,
    completed: true,
    completedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(ONBOARDING_KEY, JSON.stringify(updatedProfile));
    window.localStorage.setItem(`${ONBOARDING_KEY}_${currentUid}`, JSON.stringify(updatedProfile));
    window.localStorage.setItem(`smartbpi.onboarding_completed_${currentUid}`, "true");
  }

  // Save to Firestore if available (with a 1.5s timeout fallback so UI never hangs)
  const currentUser = auth.currentUser;
  if (currentUser && db) {
    const uid = currentUser.uid;
    const savePromise = (async () => {
      const userRef = doc(db, "users", uid);
      await setDoc(
        userRef,
        {
          uid,
          name: profile.ownerName || currentUser.displayName || "",
          email: profile.ownerEmail || currentUser.email || "",
          phone: profile.ownerPhone || currentUser.phoneNumber || "",
          photoURL: currentUser.photoURL || "",
          onboardingCompleted: true,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      const businessRef = doc(db, "businesses", uid);
      await setDoc(
        businessRef,
        {
          ownerId: uid,
          ownerName: profile.ownerName,
          ownerEmail: profile.ownerEmail,
          ownerPhone: profile.ownerPhone,
          ownerAge: profile.ownerAge,
          ownerGender: profile.ownerGender,
          ownerRole: profile.ownerRole,
          yearsOfExperience: profile.yearsOfExperience,
          preferredLanguage: profile.preferredLanguage,

          businessName: profile.businessName,
          businessType: profile.businessType,
          industry: profile.industry,
          currency: profile.currency || "INR",
          address: profile.address,
          city: profile.city,
          state: profile.state,
          pincode: profile.pincode,
          udyamCertificateUrl: profile.udyamCertificateUrl || "",
          udyamCertificateName: profile.udyamCertificateName || "",
          gstNumber: profile.gstNumber || "",
          annualRevenue: profile.annualRevenue || profile.revenue,
          employeeCount: profile.employeeCount,
          establishedYear: profile.establishedYear,
          website: profile.website || "",
          description: profile.description || "",

          channels: profile.channels,
          inventoryModel: profile.inventoryModel,
          volume: profile.volume,
          approvalLimit: profile.approvalLimit,
          lowStockLevel: profile.lowStockLevel,
          growthTarget: profile.growthTarget,

          onboardingCompleted: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
    })();

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Firestore save timed out")), 1500),
    );

    try {
      await Promise.race([savePromise, timeoutPromise]);
    } catch (err) {
      console.warn("Firestore save fallback:", err);
    }
  }

  return updatedProfile;
}

export async function isOnboardingCompleted(uid?: string): Promise<boolean> {
  const currentUid = uid || auth.currentUser?.uid;
  if (!currentUid) {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(ONBOARDING_KEY);
      return Boolean(stored && safeParse<OnboardingProfile>(stored)?.completed);
    }
    return false;
  }

  // Check localStorage first
  if (typeof window !== "undefined") {
    const isLocalDone = window.localStorage.getItem(`smartbpi.onboarding_completed_${currentUid}`);
    if (isLocalDone === "true") return true;
  }

  // Check Firestore if available
  if (db) {
    try {
      const userDoc = await getDoc(doc(db, "users", currentUid));
      if (userDoc.exists() && userDoc.data()?.["onboardingCompleted"]) {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(`smartbpi.onboarding_completed_${currentUid}`, "true");
        }
        return true;
      }
      const bizDoc = await getDoc(doc(db, "businesses", currentUid));
      if (bizDoc.exists() && bizDoc.data()?.["onboardingCompleted"]) {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(`smartbpi.onboarding_completed_${currentUid}`, "true");
        }
        return true;
      }
    } catch (err) {
      console.warn("Firestore check fallback to local storage:", err);
    }
  }

  return false;
}

export async function uploadUdyamCertificate(
  file: File,
  uid?: string,
): Promise<{ url: string; name: string }> {
  const currentUid = uid || auth.currentUser?.uid || "user";
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `documents/${currentUid}/udyam_${Date.now()}_${safeName}`;

  if (storage) {
    try {
      const storageRef = ref(storage, storagePath);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return { url: downloadUrl, name: file.name };
    } catch (err) {
      console.warn("Firebase Storage upload fallback to local storage:", err);
    }
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({ url: reader.result as string, name: file.name });
    };
    reader.onerror = () => {
      resolve({ url: URL.createObjectURL(file), name: file.name });
    };
    reader.readAsDataURL(file);
  });
}

export function nameFromEmail(email: string) {
  const handle = email.split("@")[0] ?? "operator";
  return handle
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
