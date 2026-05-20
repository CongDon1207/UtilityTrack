import { API_BASE_URL, parseJsonResponse } from '../../../shared/api/http';
import type { ElectricityReportResponse } from '../types/electricityReport';

export type ElectricityReportQuery = {
  year: number;
  month?: number;
};

export async function getElectricityReport({
  year,
  month,
}: ElectricityReportQuery): Promise<ElectricityReportResponse> {
  const params = new URLSearchParams({
    year: String(year),
  });

  if (month) {
    params.set('month', String(month));
  }

  const response = await fetch(
    `${API_BASE_URL}/electricity-records/report?${params.toString()}`,
  );

  return parseJsonResponse<ElectricityReportResponse>(
    response,
    'Không tải được báo cáo điện',
  );
}
