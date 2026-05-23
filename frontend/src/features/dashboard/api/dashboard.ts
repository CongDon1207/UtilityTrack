import { API_BASE_URL, parseJsonResponse } from '../../../shared/api/http';
import type { DashboardResponse } from '../types/dashboard';

export type DashboardQuery = {
  year: number;
  month?: number;
};

export async function getDashboardData({
  year,
  month,
}: DashboardQuery): Promise<DashboardResponse> {
  const params = new URLSearchParams({
    year: String(year),
  });

  if (month !== undefined && month !== null) {
    params.set('month', String(month));
  }

  const response = await fetch(`${API_BASE_URL}/dashboard?${params.toString()}`);

  return parseJsonResponse<DashboardResponse>(
    response,
    'Không tải được dữ liệu dashboard',
  );
}
