import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Database, AlertCircle, LineChart as LineChartIcon } from "lucide-react";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, Area, ComposedChart } from "recharts";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader, Panel, StatCard } from "@/components/app-ui";
import { auth, getOnboardingProfileAsync, type OnboardingProfile } from "@/lib/auth";

export const Route = createFileRoute("/app/sales")({
  head: () => ({
    meta: [
      { title: "Sales Forecasting — SmartBPI" },
    ],
  }),
  component: SalesForecasting,
});

type ForecastPeriod = "30d" | "6m" | "1y";

interface ForecastRecord {
  date: string;
  predicted_sales: number;
  lower_bound: number;
  upper_bound: number;
}

interface ForecastSummary {
  historical_total_sales: number;
  historical_average_daily_sales: number;
  forecast_30_days_total: number;
  forecast_30_days_average: number;
  forecast_6_months_total: number;
  forecast_6_months_average: number;
  forecast_1_year_total: number;
  forecast_1_year_average: number;
  expected_growth_percentage: number;
  forecast_start_date: string;
  forecast_end_date: string;
}

interface ForecastResponse {
  summary: ForecastSummary;
  forecast: ForecastRecord[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function SalesForecasting() {
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [period, setPeriod] = useState<ForecastPeriod>("30d");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const uid = auth.currentUser?.uid;
      if (uid) {
        const p = await getOnboardingProfileAsync(uid);
        setProfile(p);
      }
      setLoading(false);
    };
    loadProfile();
  }, []);

  const handleGenerate = async () => {
    if (!profile?.servicesData?.salesCsvUrl) {
      setError("No sales CSV found. Please upload one first.");
      return;
    }
    
    setError(null);
    setIsGenerating(true);
    setForecast(null);
    
    try {
      const apiUrl = (import.meta.env["VITE_FORECAST_API_URL"] as string | undefined) || "http://localhost:8000";
      const token = await auth.currentUser?.getIdToken();
      
      const res = await fetch(`${apiUrl}/forecast`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          sales_csv_url: profile.servicesData.salesCsvUrl,
          forecast_days: period === "30d" ? 30 : period === "6m" ? 180 : 365,
        })
      });
      
      if (!res.ok) {
         const errData = await res.json().catch(() => null);
         throw new Error(errData?.detail || `API Error: ${res.status}`);
      }
      
      const data = await res.json();
      const records = data.forecast;
      setForecast({ summary: data.summary, forecast: records });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate forecast.");
    } finally {
      setIsGenerating(false);
    }
  };

  const csvUrl = profile?.servicesData?.salesCsvUrl;
  const fileName = csvUrl ? csvUrl.split('/').pop()?.split('?')[0] : null;

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary size-8" /></div>;
  }

  return (
    <>
      <PageHeader
        eyebrow="03 · Sales & Revenue"
        title="Sales Forecasting"
        description="AI-powered sales predictions based on your business sales data."
      />

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Sales Data Status */}
        <Panel title="Sales Data Status" className="xl:col-span-1">
          <div className="flex flex-col gap-4">
            {csvUrl ? (
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg flex items-start gap-3">
                <Database className="text-primary size-5 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-primary">Sales data ready for forecasting</h4>
                  <p className="text-sm text-muted-foreground break-all">{fileName}</p>
                </div>
              </div>
            ) : (
              <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-destructive size-5 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-destructive">No sales data found</h4>
                  <p className="text-sm text-muted-foreground mb-3">Please upload your sales CSV from Service Setup.</p>
                  <Button variant="outline" size="sm" onClick={() => window.location.hash = "manage-services"}>
                    Upload Data
                  </Button>
                </div>
              </div>
            )}

            {/* Forecast Horizon */}
            <div className="mt-2">
              <label className="text-sm font-medium mb-2 block">Forecast Horizon</label>
              <div className="flex gap-2">
                <Button 
                  variant={period === "30d" ? "default" : "outline"} 
                  onClick={() => setPeriod("30d")}
                  className="flex-1"
                >
                  30 Days
                </Button>
                <Button 
                  variant={period === "6m" ? "default" : "outline"} 
                  onClick={() => setPeriod("6m")}
                  className="flex-1"
                >
                  6 Months
                </Button>
                <Button 
                  variant={period === "1y" ? "default" : "outline"} 
                  onClick={() => setPeriod("1y")}
                  className="flex-1"
                >
                  1 Year
                </Button>
              </div>
            </div>

            <Button 
              className="w-full mt-4" 
              size="lg" 
              onClick={handleGenerate}
              disabled={isGenerating || !csvUrl}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating predictions...
                </>
              ) : (
                <>
                  <LineChartIcon className="mr-2 h-4 w-4" />
                  Generate Forecast
                </>
              )}
            </Button>

            {error && (
              <div className="text-sm text-destructive mt-2 p-2 bg-destructive/10 rounded">
                {error}
              </div>
            )}
          </div>
        </Panel>

        {/* Empty State / Summary */}
        <Panel title="AI Forecast Summary" className="xl:col-span-2">
          {!forecast && !isGenerating ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-center text-muted-foreground">
              <LineChartIcon className="size-12 mb-4 opacity-20" />
              <h3 className="text-lg font-medium text-foreground">Ready to forecast your sales</h3>
              <p className="max-w-md mt-2">Your uploaded sales data will be analyzed using our AI forecasting model.</p>
            </div>
          ) : isGenerating ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-center text-muted-foreground gap-4">
              <Loader2 className="size-8 animate-spin text-primary" />
              <div className="space-y-1">
                <p className="font-medium text-foreground animate-pulse">Analyzing your sales data...</p>
                <p className="text-sm">Training SARIMA forecasting model...</p>
              </div>
            </div>
          ) : forecast ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1 bg-muted/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Historical Average</p>
                <p className="text-2xl font-bold">{formatCurrency(forecast.summary.historical_average_daily_sales)}</p>
              </div>
              <div className="space-y-1 bg-muted/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Expected Growth</p>
                <p className="text-2xl font-bold text-green-500">+{forecast.summary.expected_growth_percentage}%</p>
              </div>
              <div className="space-y-1 bg-muted/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Next 30 Days</p>
                <p className="text-2xl font-bold">{formatCurrency(forecast.summary.forecast_30_days_total)}</p>
                <p className="text-xs text-muted-foreground">{formatCurrency(forecast.summary.forecast_30_days_average)} / day</p>
              </div>
              <div className="space-y-1 bg-muted/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Next 6 Months</p>
                <p className="text-2xl font-bold">{formatCurrency(forecast.summary.forecast_6_months_total)}</p>
                <p className="text-xs text-muted-foreground">{formatCurrency(forecast.summary.forecast_6_months_average)} / month avg</p>
              </div>
            </div>
          ) : null}
        </Panel>
      </div>

      {forecast && (
        <>
          <div className="grid gap-6 xl:grid-cols-3">
            <Panel title="Forecast Chart" description="Sales forecast with confidence interval" className="xl:col-span-3">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={forecast.forecast} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="var(--color-muted-foreground)"
                      fontSize={12}
                      tickMargin={10}
                    />
                    <YAxis 
                      stroke="var(--color-muted-foreground)"
                      fontSize={12}
                      tickFormatter={(value) => `₹${value / 1000}k`}
                    />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)" }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey={["lower_bound", "upper_bound"] as any}
                      stroke="none" 
                      fill="var(--color-primary)" 
                      fillOpacity={0.15} 
                      name="95% Confidence Interval"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predicted_sales" 
                      stroke="var(--color-primary)" 
                      strokeWidth={2}
                      dot={false}
                      name="Forecast Sales"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>

          <Panel title="Forecast Records" description="Detailed daily/monthly predictions" bodyClassName="p-0">
            <div className="max-h-[500px] overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Forecast Sales</TableHead>
                    <TableHead className="text-right">Lower Bound</TableHead>
                    <TableHead className="text-right">Upper Bound</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forecast.forecast.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{row.date}</TableCell>
                      <TableCell className="text-right font-bold text-primary tabular-nums">
                        {formatCurrency(row.predicted_sales)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground tabular-nums">
                        {formatCurrency(row.lower_bound)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground tabular-nums">
                        {formatCurrency(row.upper_bound)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Panel>
        </>
      )}
    </>
  );
}
