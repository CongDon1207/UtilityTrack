type ElectricityReportFiltersProps = {
  month: number | '';
  year: number;
  onMonthChange: (month: number | '') => void;
  onYearChange: (year: number) => void;
};

const months = Array.from({ length: 12 }, (_, index) => index + 1);

export function ElectricityReportFilters({
  month,
  year,
  onMonthChange,
  onYearChange,
}: ElectricityReportFiltersProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Year
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
            min="2000"
            type="number"
            value={year}
            onChange={(event) => onYearChange(Number(event.target.value))}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Month
          <select
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
            value={month}
            onChange={(event) =>
              onMonthChange(
                event.target.value === '' ? '' : Number(event.target.value),
              )
            }
          >
            <option value="">All months</option>
            {months.map((monthValue) => (
              <option key={monthValue} value={monthValue}>
                Month {monthValue}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
