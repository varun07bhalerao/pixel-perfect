import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UploadCloud, Loader2 } from "lucide-react";
import { type OnboardingProfile, saveServiceSetup, type MockSession } from "@/lib/auth";
import { uploadServiceDataToSupabase } from "@/lib/supabase";
import { toast } from "sonner";

export function ServiceSetupModal({ profile, session }: { profile: OnboardingProfile; session: MockSession | null }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checklist, setChecklist] = useState({
    salesPredictions: false,
    salesAndRevenue: false,
    inventoryManagement: false,
    financeManagement: false,
    marketingIntelligence: false,
  });

  const [salesCsvFile, setSalesCsvFile] = useState<File | null>(null);
  const [inventoryCsvFile, setInventoryCsvFile] = useState<File | null>(null);

  const needsSalesCsv = checklist.salesPredictions || checklist.salesAndRevenue || checklist.financeManagement;
  const needsInventoryCsv = checklist.inventoryManagement;
  
  const [isOpen, setIsOpen] = useState(!profile.servicesSetupComplete);

  React.useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#manage-services") {
        setIsOpen(true);
        if (profile.servicesChecklist) {
          setChecklist(profile.servicesChecklist as any);
        }
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [profile.servicesChecklist]);

  if (!isOpen) {
    return null;
  }

  const handleNext = () => {
    if (!needsSalesCsv && !needsInventoryCsv) {
      completeSetup();
    } else {
      setStep(2);
    }
  };

  const completeSetup = async () => {
    setIsSubmitting(true);
    try {
      let salesCsvUrl = profile.servicesData?.salesCsvUrl || "";
      let inventoryCsvUrl = profile.servicesData?.inventoryCsvUrl || "";
      
      if (needsSalesCsv && salesCsvFile) {
        const result = await uploadServiceDataToSupabase(salesCsvFile, "sales", session?.uid || "guest");
        salesCsvUrl = result.url;
      }
      
      if (needsInventoryCsv && inventoryCsvFile) {
        const result = await uploadServiceDataToSupabase(inventoryCsvFile, "inventory", session?.uid || "guest");
        inventoryCsvUrl = result.url;
      }
      
      if (!needsSalesCsv) salesCsvUrl = "";
      if (!needsInventoryCsv) inventoryCsvUrl = "";

      await saveServiceSetup(
        profile, 
        checklist, 
        { salesCsvUrl, inventoryCsvUrl },
        session
      );
      
      if (window.location.hash === "#manage-services") {
        window.location.hash = "";
      }
      window.location.reload();
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Failed to upload files");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="max-w-md [&>button]:hidden">
        {window.location.hash === "#manage-services" && (
          <Button 
            variant="ghost" 
            className="absolute right-4 top-4 rounded-sm opacity-70 p-1 h-auto w-auto"
            onClick={() => {
              window.location.hash = "";
              setIsOpen(false);
            }}
          >
            ✕
          </Button>
        )}
        {step === 1 ? (
          <>
            <DialogHeader>
              <DialogTitle>Select Services</DialogTitle>
              <DialogDescription>
                Choose the AI services you want to enable for your business.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-start space-x-3">
                <Checkbox id="salesPredictions" checked={checklist.salesPredictions} onCheckedChange={(c) => setChecklist(p => ({ ...p, salesPredictions: !!c }))} />
                <Label htmlFor="salesPredictions" className="leading-tight cursor-pointer font-medium">Sales Predictions</Label>
              </div>
              <div className="flex items-start space-x-3">
                <Checkbox id="salesAndRevenue" checked={checklist.salesAndRevenue} onCheckedChange={(c) => setChecklist(p => ({ ...p, salesAndRevenue: !!c }))} />
                <Label htmlFor="salesAndRevenue" className="leading-tight cursor-pointer font-medium">Sales & Revenue Management</Label>
              </div>
              <div className="flex items-start space-x-3">
                <Checkbox id="inventoryManagement" checked={checklist.inventoryManagement} onCheckedChange={(c) => setChecklist(p => ({ ...p, inventoryManagement: !!c }))} />
                <Label htmlFor="inventoryManagement" className="leading-tight cursor-pointer font-medium">Inventory Management</Label>
              </div>
              <div className="flex items-start space-x-3">
                <Checkbox id="financeManagement" checked={checklist.financeManagement} onCheckedChange={(c) => setChecklist(p => ({ ...p, financeManagement: !!c }))} />
                <Label htmlFor="financeManagement" className="leading-tight cursor-pointer font-medium">Finance Management</Label>
              </div>
              <div className="flex items-start space-x-3">
                <Checkbox id="marketingIntelligence" checked={checklist.marketingIntelligence} onCheckedChange={(c) => setChecklist(p => ({ ...p, marketingIntelligence: !!c }))} />
                <Label htmlFor="marketingIntelligence" className="leading-tight cursor-pointer font-medium">Marketing Intelligence</Label>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleNext}>
                {(!needsSalesCsv && !needsInventoryCsv) ? "Finish Setup" : "Next"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Upload Data</DialogTitle>
              <DialogDescription>
                Please upload the required data for your selected services.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {needsSalesCsv && (
                <div className="space-y-2">
                  <Label>Sales Data CSV</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center bg-muted/20">
                    <UploadCloud className="size-8 text-muted-foreground mb-2" />
                    <Label htmlFor="sales-upload" className="cursor-pointer text-sm font-medium text-primary hover:underline">
                      {salesCsvFile ? salesCsvFile.name : (profile.servicesData?.salesCsvUrl ? "Previously uploaded. Click to change." : "Click to upload sales CSV")}
                    </Label>
                    <input
                      id="sales-upload"
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={(e) => setSalesCsvFile(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
              )}
              {needsInventoryCsv && (
                <div className="space-y-2">
                  <Label>Inventory Data CSV</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center bg-muted/20">
                    <UploadCloud className="size-8 text-muted-foreground mb-2" />
                    <Label htmlFor="inventory-upload" className="cursor-pointer text-sm font-medium text-primary hover:underline">
                      {inventoryCsvFile ? inventoryCsvFile.name : (profile.servicesData?.inventoryCsvUrl ? "Previously uploaded. Click to change." : "Click to upload inventory CSV")}
                    </Label>
                    <input
                      id="inventory-upload"
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={(e) => setInventoryCsvFile(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
              <Button 
                onClick={completeSetup} 
                disabled={
                  isSubmitting || 
                  (needsSalesCsv && !salesCsvFile && !profile.servicesData?.salesCsvUrl) || 
                  (needsInventoryCsv && !inventoryCsvFile && !profile.servicesData?.inventoryCsvUrl)
                }
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Complete Setup
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
