import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db, type OnboardingProfile } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, CheckCircle2, UserCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState<OnboardingProfile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("admin_logged_in") === "true") {
        setIsLoggedIn(true);
        fetchUsers();
      }
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (email === "smartbpi@gmail.com" && password === "final@2026") {
      setIsLoggedIn(true);
      window.localStorage.setItem("admin_logged_in", "true");
      fetchUsers();
    } else {
      toast.error("Invalid credentials");
    }
  }

  async function fetchUsers() {
    setLoading(true);
    try {
      if (!db) throw new Error("Database not initialized");
      const snap = await getDocs(collection(db, "businesses"));
      const data: OnboardingProfile[] = [];
      snap.forEach((doc) => {
        data.push({ ...doc.data(), userId: doc.id } as OnboardingProfile);
      });
      setUsers(data);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }

  async function verifyUser(userId: string, email: string) {
    try {
      if (!db) throw new Error("Database not initialized");
      const ref = doc(db, "businesses", userId);
      await updateDoc(ref, { isVerified: true, status: "verified" });
      toast.success("User verified successfully");
      
      // Send Verification Email
      sendEmail({
        to: email,
        subject: "Your SmartBPI Profile is Verified!",
        body: "Congratulations! Your details and documents have been successfully verified. You can now log in and access your SmartBPI dashboard."
      });

      fetchUsers();
    } catch (err) {
      toast.error("Failed to verify user");
    }
  }

  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [queryingUserId, setQueryingUserId] = useState<string | null>(null);
  const [adminQueryText, setAdminQueryText] = useState("");
  const [queriedFields, setQueriedFields] = useState<string[]>([]);

  const QUERYABLE_FIELDS = [
    { id: "businessName", label: "Business Name" },
    { id: "businessType", label: "Business Type" },
    { id: "industry", label: "Industry" },
    { id: "address", label: "Address & Location" },
    { id: "gstNumber", label: "GST Number" },
    { id: "annualRevenue", label: "Annual Revenue" },
    { id: "udyamCertificateUrl", label: "Udyam Certificate Document" },
    { id: "ownerName", label: "Owner Name" },
    { id: "ownerPhone", label: "Owner Phone" },
  ];

  async function submitQuery(userId: string, email: string) {
    if (!adminQueryText || queriedFields.length === 0) {
      toast.error("Please select fields and enter a query message.");
      return;
    }
    try {
      if (!db) throw new Error("Database not initialized");
      const ref = doc(db, "businesses", userId);
      await updateDoc(ref, { 
        status: "queried", 
        adminQuery: adminQueryText, 
        queriedFields 
      });
      toast.success("Query raised successfully");
      
      // Send Query Email
      sendEmail({
        to: email,
        subject: "Action Required: SmartBPI Profile Needs Revision",
        body: `We reviewed your profile and need some clarifications.\n\nQuery:\n${adminQueryText}\n\nPlease log in to your account to update the requested details.`
      });

      setQueryingUserId(null);
      setAdminQueryText("");
      setQueriedFields([]);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to raise query");
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 surface-panel p-6 shadow-elevated rounded-xl">
          <h1 className="text-xl font-bold text-center mb-6">Admin Access</h1>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={() => {
            setIsLoggedIn(false);
            window.localStorage.removeItem("admin_logged_in");
          }}>
            Logout
          </Button>
        </div>
        
        <div className="surface-panel p-6 shadow-sm rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Registered Users Pending Verification</h2>
          {loading ? (
            <p>Loading users...</p>
          ) : (
            <div className="space-y-4">
              {users.length === 0 ? (
                <p className="text-muted-foreground">No users found.</p>
              ) : (
                users.map((user, idx) => (
                  <div key={user.userId || idx} className="flex flex-col p-4 border rounded-lg bg-background gap-4">
                    <div className="flex flex-col md:flex-row items-center justify-between w-full">
                      <div className="flex items-center gap-4">
                        <UserCircle2 className="size-10 text-muted-foreground" />
                        <div>
                          <p className="font-semibold text-base">{user.businessName || "No Business Name"} - {user.ownerName}</p>
                          <p className="text-sm text-muted-foreground">{user.ownerEmail} • {user.ownerPhone}</p>
                          <p className="text-xs text-muted-foreground mt-1">Industry: {user.industry} • Type: {user.businessType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4 md:mt-0">
                        {user.isVerified ? (
                          <div className="flex items-center gap-2 text-emerald-600 font-medium px-4 py-2">
                            <CheckCircle2 className="size-5" /> Verified
                          </div>
                        ) : (
                          <>
                            <Button variant="outline" onClick={() => setExpandedUserId(expandedUserId === user.userId ? null : (user.userId || null))}>
                              Review Details
                            </Button>
                            <Button onClick={() => user.userId && verifyUser(user.userId, user.ownerEmail || "")}>
                              <Check className="size-4 mr-2" /> Verify User
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    {expandedUserId === user.userId && (
                      <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-muted/20 p-4 rounded-md">
                        <div>
                          <p className="font-semibold mb-2">Business Details</p>
                          <p><strong>Name:</strong> {user.businessName}</p>
                          <p><strong>Type:</strong> {user.businessType}</p>
                          <p><strong>Industry:</strong> {user.industry}</p>
                          <p><strong>Address:</strong> {user.address}, {user.city}, {user.state} {user.pincode}</p>
                          <p><strong>Established:</strong> {user.establishedYear}</p>
                          <p><strong>Employees:</strong> {user.employeeCount}</p>
                          <p><strong>Annual Revenue:</strong> {user.annualRevenue}</p>
                          <p><strong>Website:</strong> {user.website || "N/A"}</p>
                          <p><strong>GST Number:</strong> {user.gstNumber || "N/A"}</p>
                        </div>
                        <div>
                          <p className="font-semibold mb-2">Owner Details</p>
                          <p><strong>Name:</strong> {user.ownerName}</p>
                          <p><strong>Role:</strong> {user.ownerRole}</p>
                          <p><strong>Email:</strong> {user.ownerEmail}</p>
                          <p><strong>Phone:</strong> {user.ownerPhone}</p>
                          <p><strong>Age/Gender:</strong> {user.ownerAge} / {user.ownerGender}</p>
                          <p><strong>Experience:</strong> {user.yearsOfExperience} years</p>
                          <p><strong>Language:</strong> {user.preferredLanguage}</p>
                          
                          <div className="mt-4">
                            <p className="font-semibold mb-1">Documents</p>
                            {user.udyamCertificateUrl ? (
                              <a href={user.udyamCertificateUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium flex items-center gap-2">
                                <CheckCircle2 className="size-4" /> View Udyam Certificate
                              </a>
                            ) : (
                              <p className="text-muted-foreground italic">No document uploaded</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {expandedUserId === user.userId && !user.isVerified && (
                      <div className="mt-4 pt-4 border-t">
                        {queryingUserId === user.userId ? (
                          <div className="space-y-4 bg-muted/30 p-4 rounded-md border border-border">
                            <h3 className="font-semibold text-sm">Raise a Query</h3>
                            <div className="space-y-2">
                              <Label className="text-xs">Select fields that need revision</Label>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                {QUERYABLE_FIELDS.map((field) => (
                                  <label key={field.id} className="flex items-center gap-2 text-sm">
                                    <input 
                                      type="checkbox" 
                                      className="rounded border-gray-300"
                                      checked={queriedFields.includes(field.id)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setQueriedFields([...queriedFields, field.id]);
                                        } else {
                                          setQueriedFields(queriedFields.filter(id => id !== field.id));
                                        }
                                      }}
                                    />
                                    {field.label}
                                  </label>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">Query Message</Label>
                              <textarea 
                                className="w-full flex min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Explain what needs to be fixed..."
                                value={adminQueryText}
                                onChange={(e) => setAdminQueryText(e.target.value)}
                              />
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                              <Button onClick={() => user.userId && submitQuery(user.userId, user.ownerEmail)}>
                                Submit Query
                              </Button>
                              <Button variant="ghost" onClick={() => {
                                setQueryingUserId(null);
                                setQueriedFields([]);
                                setAdminQueryText("");
                              }}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            {user.status === "queried" ? (
                              <div className="flex items-center gap-2 text-amber-600 text-sm font-medium px-4 py-2 bg-amber-50 rounded-md">
                                Query Pending with User
                              </div>
                            ) : (
                              <Button variant="secondary" onClick={() => setQueryingUserId(user.userId || null)}>
                                Raise Query
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
