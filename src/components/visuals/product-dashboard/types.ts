export type BadgeTone = "critical" | "high" | "visit" | "review" | "neutral";

export type SidebarItem = { label: string; icon: string; active?: boolean };

export type StatCardData = { title: string; icon: string; value: string; delta: string };

export type TableColumn = { label: string; width: number };

export type SurveyRowData = {
  account: string;
  icon: string;
  lineOfBusiness: string;
  risk: { score: number; tone: BadgeTone };
  status: { label: string; tone: BadgeTone };
  location: string;
  date: string;
};

export type DashboardData = {
  url: string;
  teamName: string;
  greeting: string;
  primaryActionLabel: string;
  sidebarItems: SidebarItem[];
  statCards: StatCardData[];
  tableTitle: string;
  tableColumns: TableColumn[];
  surveyRows: SurveyRowData[];
};
