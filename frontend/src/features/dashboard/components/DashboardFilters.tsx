type DashboardFiltersProps = {
  month: number | '';
  year: number;
  onMonthChange: (month: number | '') => void;
  onYearChange: (year: number) => void;
};

const months = Array.from({ length: 12 }, (_, index) => index + 1);

export function DashboardFilters({
  month,
  year,
  onMonthChange,
  onYearChange,
}: DashboardFiltersProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 md:max-w-2xl">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Năm báo cáo
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
            min="2000"
            type="number"
            value={year}
            onChange={(event) => onYearChange(Number(event.target.value))}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Tháng
          <select
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
            value={month}
            onChange={(event) =>
              onMonthChange(
                event.target.value === '' ? '' : Number(event.target.value),
              )
            }
          >
            <option value="">Tất cả các tháng</option>
            {months.map((m) => (
              <option key={m} value={m}>
                Tháng {m}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
