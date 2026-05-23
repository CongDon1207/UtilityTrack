import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Navbar } from '../../../shared/components/Navbar';
import { getDashboardData } from '../api/dashboard';
import { DashboardCharts } from '../components/DashboardCharts';
import { DashboardFilters } from '../components/DashboardFilters';
import { DashboardSummary } from '../components/DashboardSummary';
import { DashboardVehicleTable } from '../components/DashboardVehicleTable';

export function DashboardPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState<number | ''>('');

  const { data, error, isLoading } = useQuery({
    queryKey: ['dashboard-data', year, month],
    queryFn: () =>
      getDashboardData({
        year,
        month: month === '' ? undefined : month,
      }),
  });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              UtilityTrack
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-950 tracking-tight">
              Dashboard Tổng Vụ
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Thống kê toàn diện chi phí và hiệu suất sử dụng điện năng, nhiên liệu xăng dầu và quãng đường xe chạy.
            </p>
          </div>
        </header>

        <DashboardFilters
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
        />

        {isLoading ? (
          <p className="rounded-md border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500 shadow-sm">
            Đang tải dữ liệu dashboard...
          </p>
        ) : error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error.message}
          </p>
        ) : data ? (
          <>
            <DashboardSummary data={data} />
            <DashboardCharts data={data} />
            <DashboardVehicleTable data={data} />
          </>
        ) : null}
      </div>
    </main>
  );
}
