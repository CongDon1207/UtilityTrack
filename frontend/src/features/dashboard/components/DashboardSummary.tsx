import type { DashboardResponse } from '../types/dashboard';

type DashboardSummaryProps = {
  data: DashboardResponse;
};

const numberFormatter = new Intl.NumberFormat('vi-VN');
const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  maximumFractionDigits: 0,
});

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value) + ' đ';
}

export function DashboardSummary({ data }: DashboardSummaryProps) {
  const { overall } = data;

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Card 1: Tổng chi phí tiện ích */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm flex items-start gap-4">
        <div className="rounded-md bg-slate-100 p-2 text-slate-700">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Tổng chi phí tiện ích
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-950">
            {formatCurrency(overall.totalUtilityCost)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Tổng chi phí điện và xăng xe
          </p>
        </div>
      </div>

      {/* Card 2: Chi phí điện năng */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm flex items-start gap-4">
        <div className="rounded-md bg-amber-50 p-2 text-amber-600">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 10V3L4 14h7v7l9-11h-7z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Chi phí điện năng
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-950">
            {formatCurrency(overall.electricity.totalCost)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Tiêu thụ: <strong className="text-slate-700">{formatNumber(overall.electricity.totalKwh)} kWh</strong>
          </p>
        </div>
      </div>

      {/* Card 3: Chi phí nhiên liệu */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm flex items-start gap-4">
        <div className="rounded-md bg-sky-50 p-2 text-sky-600">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Chi phí nhiên liệu
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-950">
            {formatCurrency(overall.vehicles.totalCost)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Đã nạp: <strong className="text-slate-700">{formatNumber(overall.vehicles.totalLiters)} lít</strong>
          </p>
        </div>
      </div>

      {/* Card 4: Hiệu năng vận hành xe */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm flex items-start gap-4">
        <div className="rounded-md bg-emerald-50 p-2 text-emerald-600">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Hiệu suất xe cộ
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-950">
            {formatNumber(overall.vehicles.totalKm)} km
          </p>
          <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-xs text-slate-500">
            <span>{formatCurrency(overall.vehicles.costPerKm)}/km</span>
            <span className="text-slate-300">|</span>
            <span>{overall.vehicles.kmPerLiter.toFixed(1)} km/lít</span>
          </div>
        </div>
      </div>
    </section>
  );
}
