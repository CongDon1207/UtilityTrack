export type ElectricityReportRow = {
  month: number;
  kwhUsed: number;
  totalCost: number;
  costDiffFromPreviousMonth: number | null;
  note?: string;
};

export type ElectricityReportGroup = {
  departmentGroup: string;
  rows: ElectricityReportRow[];
  summary: {
    totalKwhUsed: number;
    totalCost: number;
  };
};

export type ElectricityReportResponse = {
  year: number;
  month?: number;
  groups: ElectricityReportGroup[];
};
