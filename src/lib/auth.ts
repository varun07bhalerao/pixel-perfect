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
  apiKey:
    (import.meta.env["VITE_FIREBASE_API_KEY"] as string | undefined) ||
    "AIzaSyDrTdL-SpROC4L8lB1A7PYpQNu3oulkBL8",
  authDomain:
    (import.meta.env["VITE_FIREBASE_AUTH_DOMAIN"] as string | undefined) ||
    "final-business-os.firebaseapp.com",
  projectId:
    (import.meta.env["VITE_FIREBASE_PROJECT_ID"] as string | undefined) || "final-business-os",
  storageBucket:
    (import.meta.env["VITE_FIREBASE_STORAGE_BUCKET"] as string | undefined) ||
    "final-business-os.firebasestorage.app",
  messagingSenderId:
    (import.meta.env["VITE_FIREBASE_MESSAGING_SENDER_ID"] as string | undefined) ||
    "674679983378",
  appId:
    (import.meta.env["VITE_FIREBASE_APP_ID"] as string | undefined) ||
    "1:674679983378:web:9bb63fad24e8301fc5f7cb",
  measurementId:
    (import.meta.env["VITE_FIREBASE_MEASUREMENT_ID"] as string | undefined) || "G-1QHRC3Z226",
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

  // App Setup (Post-Verification)
  servicesChecklist?: {
    salesPredictions?: boolean;
    salesAndRevenue?: boolean;
    inventoryManagement?: boolean;
    financeManagement?: boolean;
    marketingIntelligence?: boolean;
  } | undefined;
  servicesData?: {
    salesCsvUrl?: string;
    inventoryCsvUrl?: string;
  } | undefined;
  servicesSetupComplete?: boolean | undefined;

  // Metadata
  completed?: boolean | undefined;
  completedAt?: string | undefined;
  userId?: string | undefined;
  isVerified?: boolean | undefined;
  status?: "pending" | "queried" | "verified" | undefined;
  adminQuery?: string | undefined;
  queriedFields?: string[] | undefined;
};

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function getOnboarding(uid?: string): OnboardingProfile | null {
  if (typeof window === "undefined") return null;
  const currentUid = uid || auth.currentUser?.uid;
  if (currentUid) {
    const userSpecific = safeParse<OnboardingProfile>(
      window.localStorage.getItem(`${ONBOARDING_KEY}_${currentUid}`),
    );
    if (userSpecific) return userSpecific;
  }
  const generic = safeParse<OnboardingProfile>(window.localStorage.getItem(ONBOARDING_KEY));
  if (generic && currentUid && generic.userId && generic.userId !== currentUid) {
    return null;
  }
  return generic;
}

export async function getOnboardingProfileAsync(uid?: string): Promise<OnboardingProfile | null> {
  const currentUid = uid || auth.currentUser?.uid;
  if (!currentUid) return getOnboarding();

  const local = getOnboarding(currentUid);
  if (local && (local.userId === currentUid || !local.userId)) return local;

  if (db) {
    try {
      const bizDoc = await getDoc(doc(db, "businesses", currentUid));
      if (bizDoc.exists()) {
        const data = bizDoc.data() as OnboardingProfile;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(`${ONBOARDING_KEY}_${currentUid}`, JSON.stringify(data));
        }
        return data;
      }
    } catch (e) {
      console.warn("Error fetching business profile from Firestore:", e);
    }
  }

  return local;
}

export async function saveOnboarding(profile: OnboardingProfile, userSession?: MockSession | null) {
  const currentUid = userSession?.uid || auth.currentUser?.uid || "demo-user";
  const updatedProfile: OnboardingProfile = {
    ...profile,
    userId: currentUid,
    completed: true,
    completedAt: new Date().toISOString(),
    isVerified: false,
    status: "pending",
    adminQuery: "",
    queriedFields: [],
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
          isVerified: false,
          status: "pending",
          adminQuery: "",
          queriedFields: [],
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

export async function saveServiceSetup(
  profile: OnboardingProfile,
  servicesChecklist: OnboardingProfile["servicesChecklist"],
  servicesData: OnboardingProfile["servicesData"],
  userSession?: MockSession | null
) {
  const currentUid = userSession?.uid || auth.currentUser?.uid || "demo-user";
  const updatedProfile: OnboardingProfile = {
    ...profile,
    servicesChecklist,
    servicesData,
    servicesSetupComplete: true,
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(`${ONBOARDING_KEY}_${currentUid}`, JSON.stringify(updatedProfile));
  }

  const currentUser = auth.currentUser;
  if (currentUser && db) {
    try {
      const businessRef = doc(db, "businesses", currentUid);
      await setDoc(
        businessRef,
        {
          servicesChecklist: servicesChecklist || {},
          servicesData: servicesData || {},
          servicesSetupComplete: true,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (e) {
      console.warn("Error saving service setup to Firestore:", e);
    }
  }
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

export async function isUserVerified(uid?: string): Promise<boolean> {
  const currentUid = uid || auth.currentUser?.uid;
  if (!currentUid) return false;
  if (db) {
    try {
      const bizDoc = await getDoc(doc(db, "businesses", currentUid));
      if (bizDoc.exists() && bizDoc.data()?.["isVerified"] === true) {
        return true;
      }
    } catch (err) {
      console.warn("Firestore verify check failed:", err);
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

export async function uploadServiceDataCsv(
  file: File,
  type: "sales" | "inventory",
  uid?: string,
): Promise<{ url: string; name: string }> {
  const currentUid = uid || auth.currentUser?.uid || "user";
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `service_data/${currentUid}/${type}_${Date.now()}_${safeName}`;

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
