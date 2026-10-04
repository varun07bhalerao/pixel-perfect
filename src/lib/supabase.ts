import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env["VITE_SUPABASE_URL"] as string | undefined) || "";
const supabaseAnonKey = (import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined) || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("https://") &&
    supabaseAnonKey.length > 20,
);

let supabaseInstance: SupabaseClient | null = null;
try {
  if (isSupabaseConfigured) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (e) {
  console.warn("[Supabase] Failed to initialize client:", e);
}
export const supabase: SupabaseClient | null = supabaseInstance;

const BUCKET_NAME = "udyam-files";

/**
 * Upload Udyam Registration File to Supabase Storage bucket ('udyam-files').
 * Throws an error with a descriptive message if the upload fails — no silent fallback.
 */
export async function uploadUdyamToSupabase(
  file: File,
  uid: string,
): Promise<{ url: string; name: string; path: string }> {
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `${uid}/udyam_${Date.now()}_${cleanFileName}`;

  if (!supabase || !isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.",
    );
  }

  console.log(`[Supabase] Uploading "${file.name}" to bucket "${BUCKET_NAME}" at path "${filePath}"...`);

  const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) {
    // Provide helpful messages for the most common errors
    if (error.message?.includes("Bucket not found") || error.message?.includes("bucket")) {
      throw new Error(
        `Supabase bucket "${BUCKET_NAME}" not found. Please create it in Supabase → Storage → New Bucket (name: "udyam-files", set to Public).`,
      );
    }
    if (error.message?.includes("Invalid API key") || error.message?.includes("JWT")) {
      throw new Error(`Supabase API key is invalid. Please check VITE_SUPABASE_ANON_KEY in your .env file.`);
    }
    if (error.message?.includes("row-level security") || error.message?.includes("policy")) {
      throw new Error(
        `Supabase Storage RLS policy is blocking uploads. Go to Supabase → Storage → "${BUCKET_NAME}" → Policies and allow INSERT for anon/authenticated users.`,
      );
    }
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  if (!data) {
    throw new Error("Supabase upload returned no data. The file may not have been saved.");
  }

  console.log(`[Supabase] Upload successful:`, data);

  const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  return {
    url: publicUrlData.publicUrl,
    name: file.name,
    path: filePath,
  };
}

export async function uploadServiceDataToSupabase(
  file: File,
  type: "sales" | "inventory",
  uid: string,
): Promise<{ url: string; name: string; path: string }> {
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `${uid}/${type}_${Date.now()}_${cleanFileName}`;
  const bucket = "service-data";

  if (!supabase || !isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.",
    );
  }

  console.log(`[Supabase] Uploading "${file.name}" to bucket "${bucket}" at path "${filePath}"...`);

  const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) {
    if (error.message?.includes("Bucket not found") || error.message?.includes("bucket")) {
      throw new Error(
        `Supabase bucket "${bucket}" not found. Please create it in Supabase → Storage → New Bucket (name: "service-data", set to Public).`,
      );
    }
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  if (!data) {
    throw new Error("Supabase upload returned no data. The file may not have been saved.");
  }

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return {
    url: publicUrlData.publicUrl,
    name: file.name,
    path: filePath,
  };
}
