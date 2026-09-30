export const modules = [
  {
    slug: "dashboard",
    title: "AI CEO Dashboard",
    blurb: "Executive KPIs, cash flow and critical alerts in one command view.",
  },
  {
    slug: "sales",
    title: "Sales & Revenue",
    blurb: "Orders, invoices, payment status and revenue breakdown.",
  },
  {
    slug: "inventory",
    title: "Inventory",
    blurb: "Stock levels, movement logs, suppliers and predicted demand.",
  },
  {
    slug: "crm",
    title: "CRM & Customer Intelligence",
    blurb: "Segments, purchase history and churn risk scoring.",
  },
  {
    slug: "finance",
    title: "Finance",
    blurb: "Receivables, payables, P&L and cash-flow monitoring.",
  },
  {
    slug: "marketing",
    title: "Marketing Intelligence",
    blurb: "Campaign ROI, CAC and conversion performance.",
  },
  {
    slug: "analytics",
    title: "AI & Analytics Engine",
    blurb: "Forecasting, demand prediction and anomaly detection.",
  },
  {
    slug: "assistant",
    title: "AI Business Assistant",
    blurb: "Ask business questions, get structured answers.",
  },
  {
    slug: "agents",
    title: "Multi-Agent AI System",
    blurb: "Autonomous agents for finance, stock and workflows.",
  },
  {
    slug: "documents",
    title: "Document Intelligence",
    blurb: "Extract invoices and bills into structured ledger rows.",
  },
  {
    slug: "approvals",
    title: "Decision & Approval Engine",
    blurb: "Policy rules with a human approval queue.",
  },
  {
    slug: "alerts",
    title: "Smart Alerts",
    blurb: "Priority-ranked operational and financial alerts.",
  },
  {
    slug: "workflows",
    title: "Workflow Automation",
    blurb: "Rule-based actions that run themselves.",
  },
  {
    slug: "reports",
    title: "Reports & Analytics",
    blurb: "Modular reporting with CSV and PDF exports.",
  },
] as const;

export const kpis = [
  {
    label: "Total Revenue",
    value: "$4.82M",
    change: "+12.4%",
    trend: "up" as const,
    hint: "vs last quarter",
  },
  {
    label: "Gross Profit",
    value: "$1.94M",
    change: "+8.1%",
    trend: "up" as const,
    hint: "40.2% margin",
  },
  {
    label: "Active Orders",
    value: "1,284",
    change: "+64",
    trend: "up" as const,
    hint: "218 awaiting fulfilment",
  },
  {
    label: "Low Stock Alerts",
    value: "17",
    change: "+5",
    trend: "down" as const,
    hint: "6 critical SKUs",
  },
  {
    label: "Churn Risk Index",
    value: "6.8%",
    change: "-1.2%",
    trend: "up" as const,
    hint: "34 accounts at risk",
  },
];

export const revenueSeries = [
  { month: "Jan", revenue: 312000, expenses: 208000, cash: 104000 },
  { month: "Feb", revenue: 348000, expenses: 221000, cash: 127000 },
  { month: "Mar", revenue: 402000, expenses: 246000, cash: 156000 },
  { month: "Apr", revenue: 378000, expenses: 259000, cash: 119000 },
  { month: "May", revenue: 441000, expenses: 268000, cash: 173000 },
  { month: "Jun", revenue: 469000, expenses: 281000, cash: 188000 },
  { month: "Jul", revenue: 452000, expenses: 292000, cash: 160000 },
  { month: "Aug", revenue: 508000, expenses: 301000, cash: 207000 },
  { month: "Sep", revenue: 536000, expenses: 314000, cash: 222000 },
];

export const forecastSeries = [
  { month: "Oct", actual: 536000, forecast: 540000 },
  { month: "Nov", actual: null as number | null, forecast: 572000 },
  { month: "Dec", actual: null as number | null, forecast: 631000 },
  { month: "Jan", actual: null as number | null, forecast: 588000 },
  { month: "Feb", actual: null as number | null, forecast: 604000 },
];

export const criticalAlerts = [
  {
    id: "AL-2201",
    severity: "critical",
    title: "SKU-4471 stock at 6 units",
    detail: "Below 15-unit threshold, 3-day cover remaining.",
    action: "Create PO",
  },
  {
    id: "AL-2202",
    severity: "high",
    title: "Invoice INV-10884 overdue 14 days",
    detail: "Northwind Retail — $48,200 outstanding.",
    action: "Send reminder",
  },
  {
    id: "AL-2203",
    severity: "high",
    title: "Churn risk spike: Helix Labs",
    detail: "Order frequency down 62% over 60 days.",
    action: "Assign CSM",
  },
  {
    id: "AL-2204",
    severity: "medium",
    title: "Unusual transaction $92,400",
    detail: "New vendor, first payment above policy limit.",
    action: "Review",
  },
];

export const aiInsights = [
  {
    title: "Shift 12% of ad spend from Meta to Google Ads",
    detail: "Google Ads ROAS is 3.4x vs 1.9x on Meta for the same audience.",
    confidence: "88%",
  },
  {
    title: "Raise reorder point on 6 fast-moving SKUs",
    detail: "Demand model predicts a 19% lift into the holiday window.",
    confidence: "82%",
  },
  {
    title: "Offer net-15 discount to 9 slow payers",
    detail: "Could pull forward $214K of receivables inside 30 days.",
    confidence: "76%",
  },
  {
    title: "Margin leak in Services line",
    detail: "Delivery hours per contract up 14% without price adjustment.",
    confidence: "71%",
  },
];

export const orders = [
  {
    id: "ORD-90412",
    customer: "Northwind Retail",
    date: "2026-09-24",
    items: 14,
    amount: 48200,
    status: "Paid",
    channel: "Direct",
  },
  {
    id: "ORD-90411",
    customer: "Helix Labs",
    date: "2026-09-23",
    items: 6,
    amount: 21750,
    status: "Pending",
    channel: "Marketplace",
  },
  {
    id: "ORD-90410",
    customer: "Atlas Manufacturing",
    date: "2026-09-22",
    items: 32,
    amount: 96400,
    status: "Paid",
    channel: "Direct",
  },
  {
    id: "ORD-90409",
    customer: "Brightline Services",
    date: "2026-09-20",
    items: 9,
    amount: 13980,
    status: "Overdue",
    channel: "Partner",
  },
  {
    id: "ORD-90408",
    customer: "Cobalt Foods",
    date: "2026-09-19",
    items: 21,
    amount: 34120,
    status: "Paid",
    channel: "E-commerce",
  },
  {
    id: "ORD-90407",
    customer: "Vertex Digital",
    date: "2026-09-18",
    items: 4,
    amount: 8760,
    status: "Pending",
    channel: "E-commerce",
  },
  {
    id: "ORD-90406",
    customer: "Seaboard Logistics",
    date: "2026-09-17",
    items: 18,
    amount: 52300,
    status: "Overdue",
    channel: "Direct",
  },
];

export const revenueByLine = [
  { name: "Product", value: 2140000 },
  { name: "Subscription", value: 1380000 },
  { name: "Services", value: 860000 },
  { name: "Support", value: 440000 },
];

export const products = [
  {
    sku: "SKU-4471",
    name: "Cobalt Sensor Module",
    stock: 6,
    min: 15,
    supplier: "Hansen Components",
    demand: "Surging",
    price: 320,
  },
  {
    sku: "SKU-2210",
    name: "Industrial Relay Kit",
    stock: 58,
    min: 25,
    supplier: "Atlas Parts",
    demand: "Stable",
    price: 145,
  },
  {
    sku: "SKU-8834",
    name: "Thermal Controller X2",
    stock: 12,
    min: 20,
    supplier: "Nordic Systems",
    demand: "Rising",
    price: 610,
  },
  {
    sku: "SKU-1176",
    name: "Edge Gateway Pro",
    stock: 143,
    min: 40,
    supplier: "Hansen Components",
    demand: "Softening",
    price: 899,
  },
  {
    sku: "SKU-5590",
    name: "Precision Bearing Set",
    stock: 21,
    min: 30,
    supplier: "Meridian Supply",
    demand: "Rising",
    price: 78,
  },
  {
    sku: "SKU-7702",
    name: "Fiber Patch Bundle",
    stock: 264,
    min: 60,
    supplier: "Lightpath Co",
    demand: "Stable",
    price: 42,
  },
];

export const stockMovements = [
  { id: "MV-7781", sku: "SKU-4471", type: "Out", qty: 24, ref: "ORD-90412", date: "2026-09-24" },
  { id: "MV-7780", sku: "SKU-1176", type: "In", qty: 120, ref: "PO-3391", date: "2026-09-23" },
  { id: "MV-7779", sku: "SKU-8834", type: "Out", qty: 8, ref: "ORD-90410", date: "2026-09-22" },
  { id: "MV-7778", sku: "SKU-5590", type: "Out", qty: 40, ref: "ORD-90408", date: "2026-09-21" },
  { id: "MV-7777", sku: "SKU-2210", type: "In", qty: 75, ref: "PO-3388", date: "2026-09-20" },
];

export const suppliers = [
  {
    name: "Hansen Components",
    lead: "12 days",
    reliability: "96%",
    spend: "$482K",
    terms: "Net 30",
  },
  { name: "Atlas Parts", lead: "9 days", reliability: "91%", spend: "$318K", terms: "Net 15" },
  { name: "Nordic Systems", lead: "21 days", reliability: "88%", spend: "$254K", terms: "Net 45" },
  { name: "Meridian Supply", lead: "7 days", reliability: "94%", spend: "$142K", terms: "Net 30" },
];

export const purchaseOrders = [
  {
    id: "PO-3392",
    supplier: "Hansen Components",
    sku: "SKU-4471",
    qty: 150,
    value: 48000,
    status: "Draft",
  },
  {
    id: "PO-3391",
    supplier: "Hansen Components",
    sku: "SKU-1176",
    qty: 120,
    value: 107880,
    status: "Received",
  },
  {
    id: "PO-3390",
    supplier: "Nordic Systems",
    sku: "SKU-8834",
    qty: 60,
    value: 36600,
    status: "In transit",
  },
  {
    id: "PO-3388",
    supplier: "Atlas Parts",
    sku: "SKU-2210",
    qty: 75,
    value: 10875,
    status: "Received",
  },
];

export const customers = [
  {
    name: "Northwind Retail",
    segment: "High-Value",
    ltv: 482000,
    orders: 64,
    churn: 8,
    owner: "R. Mehta",
    last: "2026-09-24",
  },
  {
    name: "Helix Labs",
    segment: "At-Risk",
    ltv: 196000,
    orders: 21,
    churn: 72,
    owner: "S. Iyer",
    last: "2026-07-30",
  },
  {
    name: "Atlas Manufacturing",
    segment: "High-Value",
    ltv: 738000,
    orders: 89,
    churn: 5,
    owner: "R. Mehta",
    last: "2026-09-22",
  },
  {
    name: "Brightline Services",
    segment: "Regular",
    ltv: 124000,
    orders: 33,
    churn: 41,
    owner: "D. Okafor",
    last: "2026-08-28",
  },
  {
    name: "Cobalt Foods",
    segment: "Regular",
    ltv: 88000,
    orders: 27,
    churn: 18,
    owner: "D. Okafor",
    last: "2026-09-19",
  },
  {
    name: "Vertex Digital",
    segment: "At-Risk",
    ltv: 61000,
    orders: 12,
    churn: 66,
    owner: "S. Iyer",
    last: "2026-08-04",
  },
];

export const receivables = [
  {
    invoice: "INV-10884",
    customer: "Northwind Retail",
    due: "2026-09-10",
    amount: 48200,
    age: "14 days",
    status: "Overdue",
  },
  {
    invoice: "INV-10891",
    customer: "Helix Labs",
    due: "2026-10-02",
    amount: 21750,
    age: "Current",
    status: "Pending",
  },
  {
    invoice: "INV-10877",
    customer: "Seaboard Logistics",
    due: "2026-09-02",
    amount: 52300,
    age: "22 days",
    status: "Overdue",
  },
  {
    invoice: "INV-10902",
    customer: "Cobalt Foods",
    due: "2026-10-09",
    amount: 34120,
    age: "Current",
    status: "Pending",
  },
];

export const payables = [
  {
    bill: "BILL-5521",
    vendor: "Hansen Components",
    due: "2026-10-05",
    amount: 48000,
    status: "Scheduled",
  },
  {
    bill: "BILL-5518",
    vendor: "Nordic Systems",
    due: "2026-09-28",
    amount: 36600,
    status: "Approval needed",
  },
  {
    bill: "BILL-5510",
    vendor: "Lightpath Co",
    due: "2026-09-30",
    amount: 11080,
    status: "Scheduled",
  },
  { bill: "BILL-5504", vendor: "Meridian Supply", due: "2026-09-26", amount: 9240, status: "Paid" },
];

export const plSummary = [
  { label: "Revenue", value: "$4,820,000" },
  { label: "Cost of goods sold", value: "$2,880,000" },
  { label: "Gross profit", value: "$1,940,000" },
  { label: "Operating expenses", value: "$1,164,000" },
  { label: "EBITDA", value: "$776,000" },
  { label: "Net profit", value: "$612,400" },
];

export const campaigns = [
  {
    name: "Q3 Enterprise Demand",
    channel: "Google Ads",
    spend: 84000,
    leads: 1240,
    cac: 68,
    roi: "3.4x",
    conv: "4.8%",
  },
  {
    name: "Retargeting — Product",
    channel: "Meta",
    spend: 46000,
    leads: 910,
    cac: 51,
    roi: "1.9x",
    conv: "2.6%",
  },
  {
    name: "Lifecycle Nurture",
    channel: "Email",
    spend: 9000,
    leads: 620,
    cac: 15,
    roi: "6.1x",
    conv: "7.4%",
  },
  {
    name: "Partner Co-Marketing",
    channel: "Google Ads",
    spend: 31000,
    leads: 402,
    cac: 77,
    roi: "2.2x",
    conv: "3.1%",
  },
];

export const churnRadar = [
  { account: "Helix Labs", risk: 72, driver: "Order frequency down 62%" },
  { account: "Vertex Digital", risk: 66, driver: "3 support escalations open" },
  { account: "Brightline Services", risk: 41, driver: "Contract renewal in 28 days" },
  { account: "Cobalt Foods", risk: 18, driver: "Stable, minor payment delay" },
];

export const anomalies = [
  {
    id: "AN-881",
    time: "09:42",
    type: "Payment",
    detail: "Vendor bank details changed before $92,400 payout",
    score: "High",
  },
  {
    id: "AN-880",
    time: "08:15",
    type: "Order",
    detail: "Duplicate order pattern from same IP (4 orders)",
    score: "Medium",
  },
  {
    id: "AN-879",
    time: "Yesterday",
    type: "Inventory",
    detail: "Stock write-off 3.2x monthly average",
    score: "High",
  },
  {
    id: "AN-878",
    time: "Yesterday",
    type: "Expense",
    detail: "Travel claim above policy for cost center OPS-3",
    score: "Low",
  },
];

export const agents = [
  {
    name: "Autonomous AI Manager",
    status: "Active",
    task: "Re-prioritised 14 open exceptions",
    updated: "2 min ago",
  },
  {
    name: "Business Analyst Agent",
    status: "Processing",
    task: "Building Q3 revenue variance narrative",
    updated: "just now",
  },
  {
    name: "Finance Agent",
    status: "Active",
    task: "Matched 38 payments to invoices",
    updated: "11 min ago",
  },
  {
    name: "Inventory Agent",
    status: "Processing",
    task: "Drafting PO-3392 for SKU-4471",
    updated: "just now",
  },
  {
    name: "Marketing Agent",
    status: "Idle",
    task: "Waiting on channel budget approval",
    updated: "1 h ago",
  },
  {
    name: "Workflow Automation Agent",
    status: "Active",
    task: "Executed 6 overdue-invoice reminders",
    updated: "18 min ago",
  },
];

export const agentLog = [
  { time: "16:04", agent: "Inventory Agent", event: "Created draft PO-3392 (150 units, SKU-4471)" },
  {
    time: "15:52",
    agent: "Finance Agent",
    event: "Flagged BILL-5518 for approval — above $5,000 limit",
  },
  {
    time: "15:31",
    agent: "Workflow Automation Agent",
    event: "Sent reminder for INV-10877 (22 days overdue)",
  },
  {
    time: "15:12",
    agent: "Business Analyst Agent",
    event: "Published weekly margin digest to leadership",
  },
  {
    time: "14:48",
    agent: "Autonomous AI Manager",
    event: "Escalated churn risk on Helix Labs to CSM queue",
  },
];

export const approvalQueue = [
  {
    id: "AP-771",
    request: "Vendor payment — Nordic Systems",
    amount: 36600,
    rule: "Above $5,000 manager limit",
    requester: "Finance Agent",
  },
  {
    id: "AP-770",
    request: "Discount 18% — Northwind Retail renewal",
    amount: 48200,
    rule: "Discount above 15% policy",
    requester: "R. Mehta",
  },
  {
    id: "AP-769",
    request: "Purchase order PO-3392",
    amount: 48000,
    rule: "New stock commitment",
    requester: "Inventory Agent",
  },
  {
    id: "AP-768",
    request: "Write-off damaged stock (SKU-5590)",
    amount: 3120,
    rule: "Inventory adjustment review",
    requester: "Ops Desk",
  },
];

export const policyRules = [
  {
    rule: "Manager approval limit",
    value: "$5,000",
    scope: "All outbound payments",
    state: "Enforced",
  },
  { rule: "Discount ceiling", value: "15%", scope: "Sales quotes & renewals", state: "Enforced" },
  { rule: "New vendor cooling period", value: "7 days", scope: "First payout", state: "Enforced" },
  { rule: "Credit hold", value: "30 days overdue", scope: "Order acceptance", state: "Monitoring" },
];

export const smartAlerts = [
  {
    category: "Inventory Below Threshold",
    severity: "Critical",
    count: 6,
    detail: "SKU-4471, SKU-8834 and 4 more below reorder point.",
  },
  {
    category: "Customer Churn Risk",
    severity: "High",
    count: 9,
    detail: "Accounts with risk score above 60%.",
  },
  {
    category: "Overdue Payments",
    severity: "High",
    count: 11,
    detail: "$214,300 outstanding beyond terms.",
  },
  {
    category: "Unusual High-Value Transactions",
    severity: "Medium",
    count: 3,
    detail: "Payments above policy from new vendors.",
  },
];

export const workflows = [
  {
    id: "WF-01",
    name: "Auto-create PO when stock < 15 units",
    trigger: "Inventory threshold",
    runs: 42,
    enabled: true,
  },
  {
    id: "WF-02",
    name: "Send reminder when invoice overdue > 7 days",
    trigger: "Receivables ageing",
    runs: 118,
    enabled: true,
  },
  {
    id: "WF-03",
    name: "Escalate churn risk above 60% to CSM",
    trigger: "Churn model",
    runs: 27,
    enabled: true,
  },
  {
    id: "WF-04",
    name: "Hold orders for customers 30 days overdue",
    trigger: "Credit policy",
    runs: 9,
    enabled: false,
  },
  {
    id: "WF-05",
    name: "Weekly margin digest to leadership",
    trigger: "Schedule — Monday 08:00",
    runs: 36,
    enabled: true,
  },
];

export const reportTypes = [
  { name: "Sales performance", detail: "Orders, channels, revenue by line and rep." },
  { name: "Inventory health", detail: "Stock cover, movement velocity, reorder gaps." },
  { name: "Customer intelligence", detail: "Segments, LTV, churn risk and retention." },
  { name: "Finance summary", detail: "P&L, receivables ageing and cash flow." },
  { name: "Marketing ROI", detail: "Spend, CAC, conversion and channel ROI." },
];

export const assistantPrompts = [
  "Why did revenue dip in Q3?",
  "Draft PO for low stock items",
  "Summarize monthly overdue receivables",
  "Which customers are most likely to churn?",
];

export const assistantAnswers: Record<
  string,
  { summary: string; table: { columns: string[]; rows: string[][] }; note: string }
> = {
  "Why did revenue dip in Q3?": {
    summary:
      "Q3 revenue fell 4.1% against Q2, driven mostly by the Services line and a fulfilment delay in July. Product and Subscription both grew.",
    table: {
      columns: ["Line", "Q2", "Q3", "Change"],
      rows: [
        ["Product", "$712K", "$741K", "+4.1%"],
        ["Subscription", "$448K", "$468K", "+4.5%"],
        ["Services", "$286K", "$212K", "-25.9%"],
        ["Support", "$142K", "$138K", "-2.8%"],
      ],
    },
    note: "Services shortfall tracks to 3 delayed implementations and 2 churned accounts.",
  },
  "Draft PO for low stock items": {
    summary:
      "4 SKUs are below their reorder point. Suggested draft covers 45 days of predicted demand.",
    table: {
      columns: ["SKU", "On hand", "Reorder qty", "Supplier"],
      rows: [
        ["SKU-4471", "6", "150", "Hansen Components"],
        ["SKU-8834", "12", "60", "Nordic Systems"],
        ["SKU-5590", "21", "90", "Meridian Supply"],
        ["SKU-2210", "58", "40", "Atlas Parts"],
      ],
    },
    note: "Total commitment $101,475 — above the $5,000 manager limit, so approval is required.",
  },
  "Summarize monthly overdue receivables": {
    summary: "$214,300 is overdue across 11 invoices. Two accounts carry 47% of the balance.",
    table: {
      columns: ["Customer", "Invoices", "Amount", "Worst ageing"],
      rows: [
        ["Seaboard Logistics", "3", "$78,400", "22 days"],
        ["Northwind Retail", "2", "$48,200", "14 days"],
        ["Brightline Services", "4", "$52,900", "11 days"],
        ["Others", "2", "$34,800", "9 days"],
      ],
    },
    note: "A net-15 early-pay discount could recover an estimated $132K inside 30 days.",
  },
  "Which customers are most likely to churn?": {
    summary:
      "9 accounts sit above a 60% churn score. Helix Labs is the largest exposure at $196K LTV.",
    table: {
      columns: ["Account", "Risk", "LTV", "Primary driver"],
      rows: [
        ["Helix Labs", "72%", "$196K", "Order frequency -62%"],
        ["Vertex Digital", "66%", "$61K", "Open escalations"],
        ["Brightline Services", "41%", "$124K", "Renewal in 28 days"],
        ["Cobalt Foods", "18%", "$88K", "Payment delays"],
      ],
    },
    note: "Recommended play: executive check-in plus a usage review for the top two accounts.",
  },
};

export const extractedInvoice = {
  vendor: "Hansen Components",
  invoiceNumber: "HC-2026-4471",
  issued: "2026-09-21",
  due: "2026-10-21",
  currency: "USD",
  lineItems: [
    { description: "Cobalt Sensor Module (SKU-4471)", qty: 150, unit: 320, total: 48000 },
    { description: "Freight & handling", qty: 1, unit: 1240, total: 1240 },
  ],
  subtotal: 49240,
  tax: 4431.6,
  total: 53671.6,
};

export function currency(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}
