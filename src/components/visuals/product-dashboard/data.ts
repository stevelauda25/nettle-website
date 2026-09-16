// Figma: Hero › visual-container › product-visual (388:5797).
// Content of the illustrated Nettle dashboard, exactly as drawn in Figma
// (including the "Portofolio" spelling and "Site Visit" / "Site visit" casing).

import type { DashboardData } from "./types";

export const dashboardIcon = (name: string) => `/assets/icons/product/${name}.svg`;
const icon = dashboardIcon;

// Figma canvas size. The dashboard lays out at this size and scales as a unit.
export const DASHBOARD_WIDTH = 1144;
export const DASHBOARD_HEIGHT = 701;

const sidebarItems: DashboardData["sidebarItems"] = [
  { label: "Dashboard", icon: icon("grid-01"), active: true },
  { label: "Analytics", icon: icon("bar-chart-10") },
  { label: "Portofolio", icon: icon("folder") },
  { label: "Surveys", icon: icon("file-check-02") },
  { label: "Recommendations", icon: icon("stars-02") },
  { label: "Clients", icon: icon("building-06") },
  { label: "Team", icon: icon("users-02") },
  { label: "Integration", icon: icon("dataflow-01") },
];

const statCards: DashboardData["statCards"] = [
  { title: "Assigned surveys", icon: icon("card-file-check-02"), value: "24", delta: "+3 this week" },
  { title: "Same-day report rate", icon: icon("pie-chart-01"), value: "94%", delta: "+6% this month" },
  { title: "Recommendations resolved", icon: icon("check-verified-02"), value: "86%", delta: "+8% this month" },
  { title: "Portfolio assessed", icon: icon("folder-check"), value: "78%", delta: "+12% this month" },
];

const tableColumns: DashboardData["tableColumns"] = [
  { label: "Account", width: 193 },
  { label: "Line of Business", width: 213 },
  { label: "Risk Score", width: 101 },
  { label: "Status", width: 105 },
  { label: "Location", width: 101 },
  { label: "Date", width: 100 },
];

const surveyRows: DashboardData["surveyRows"] = [
  {
    account: "Caldwell Aerospace", icon: icon("rocket-02"), lineOfBusiness: "Aerospace & Defense",
    risk: { score: 91, tone: "critical" }, status: { label: "Site Visit", tone: "visit" },
    location: "Seattle, WA", date: "Sep 14, 2026",
  },
  {
    account: "Bridgeport Energy Solutions", icon: icon("flash"), lineOfBusiness: "Energy",
    risk: { score: 74, tone: "high" }, status: { label: "Desk review", tone: "review" },
    location: "Houston, TX", date: "Sep 16, 2026",
  },
  {
    account: "Summit Health Partners", icon: icon("building-07"), lineOfBusiness: "Healthcare",
    risk: { score: 63, tone: "high" }, status: { label: "Site Visit", tone: "visit" },
    location: "Denver, CO", date: "Sep 18, 2026",
  },
  {
    account: "Lakeview Construction Group", icon: icon("building-07"), lineOfBusiness: "Construction",
    risk: { score: 45, tone: "neutral" }, status: { label: "Additional Info", tone: "neutral" },
    location: "Milwaukee, WI", date: "Sep 19, 2026",
  },
  {
    account: "Northgate Financial Services", icon: icon("file-07"), lineOfBusiness: "Financial Services",
    risk: { score: 82, tone: "high" }, status: { label: "Desk review", tone: "review" },
    location: "Charlotte, NC", date: "Sep 22, 2026",
  },
  {
    account: "Meridian Dynamics", icon: icon("building-07"), lineOfBusiness: "Industrial Manufacturing",
    risk: { score: 74, tone: "high" }, status: { label: "Quarterly review", tone: "visit" },
    location: "Portland, OR", date: "Oct 3, 2026",
  },
  {
    account: "Apex Health Systems", icon: icon("building-07"), lineOfBusiness: "Healthcare & Biotech",
    risk: { score: 88, tone: "critical" }, status: { label: "On-site audit", tone: "visit" },
    location: "Austin, TX", date: "Oct 8, 2026",
  },
  {
    account: "Solaris Energy Group", icon: icon("flash"), lineOfBusiness: "Renewable Energy",
    risk: { score: 65, tone: "high" }, status: { label: "Document review", tone: "review" },
    location: "Denver, CO", date: "Oct 15, 2026",
  },
  {
    account: "Pinnacle Logistics Corp", icon: icon("truck-01"), lineOfBusiness: "Supply Chain & Logistics",
    risk: { score: 93, tone: "critical" }, status: { label: "Site visit", tone: "review" },
    location: "Chicago, IL", date: "Oct 21, 2026",
  },
];

export const browserIcons = {
  trafficLights: icon("traffic-lights"),
  sidebar: icon("toolbar-sidebar"),
  back: icon("toolbar-back"),
  forward: icon("toolbar-forward"),
  shield: icon("toolbar-shield"),
  lock: icon("lock"),
  reload: icon("reload"),
  trailing: [icon("toolbar-download"), icon("toolbar-share"), icon("toolbar-new-tab"), icon("toolbar-tabs")],
};

export const defaultDashboardData: DashboardData = {
  url: "getnettle.com",
  teamName: "Allianz Team",
  greeting: "Good morning, Jacob.",
  primaryActionLabel: "New Survey",
  sidebarItems,
  statCards,
  tableTitle: "Priority Surveys",
  tableColumns,
  surveyRows,
};
