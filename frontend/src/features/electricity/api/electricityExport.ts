import { API_BASE_URL } from '../../../shared/api/http';

export type ElectricityExportQuery = {
  year: number;
  month?: number;
};

export function getElectricityExportUrl({
  year,
  month,
}: ElectricityExportQuery) {
  const params = new URLSearchParams({
    year: String(year),
  });

  if (month) {
    params.set('month', String(month));
  }

  return `${API_BASE_URL}/electricity-records/export?${params.toString()}`;
}
