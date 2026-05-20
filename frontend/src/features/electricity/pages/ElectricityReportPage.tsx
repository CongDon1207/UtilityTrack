import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { getElectricityExportUrl } from '../api/electricityExport';
import { getElectricityReport } from '../api/electricityReport';
import { ElectricityReportDashboard } from '../components/ElectricityReportDashboard';
import { ElectricityReportFilters } from '../components/ElectricityReportFilters';
import { ElectricityReportTable } from '../components/ElectricityReportTable';

export function ElectricityReportPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState<number | ''>('');

  const { data, error, isLoading } = useQuery({
    queryKey: ['electricity-report', year, month],
    queryFn: () =>
      getElectricityReport({
        year,
        month: month === '' ? undefined : month,
      }),
  });

  const exportUrl = getElectricityExportUrl({
    year,
    month: month === '' ? undefined : month,
  });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              UtilityTrack
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950">
              Báo cáo điện
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Xem sản lượng điện tiêu thụ theo mẫu báo cáo hiện có.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              className="inline-flex w-fit rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-sm"
              href={exportUrl}
            >
              Xuất Excel
            </a>
            <Link
              className="inline-flex w-fit rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
              to="/electricity-records"
            >
              Quản lý dữ liệu
            </Link>
          </div>
        </header>

        <ElectricityReportFilters
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
        />

        {isLoading ? (
          <p className="rounded-md border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500 shadow-sm">
            Đang tải báo cáo điện...
          </p>
        ) : error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error.message}
          </p>
        ) : data ? (
          <>
            <ElectricityReportDashboard report={data} />
            <ElectricityReportTable report={data} />
          </>
        ) : null}
      </div>
    </main>
  );
}
