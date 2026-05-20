import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getElectricityDepartmentGroupLabel } from '../constants/electricityDepartmentGroups';
import type { ElectricityReportResponse } from '../types/electricityReport';

type ElectricityReportDashboardProps = {
  report: ElectricityReportResponse;
};

type ChartTooltipPayload = {
  name?: string;
  value?: number;
  color?: string;
};

type ChartTooltipProps = {
  active?: boolean;
  label?: string;
  payload?: ChartTooltipPayload[];
};

const numberFormatter = new Intl.NumberFormat('vi-VN');
const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  maximumFractionDigits: 0,
});

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function buildMonthlyCostData(report: ElectricityReportResponse) {
  const totalsByMonth = new Map<number, number>();

  for (const group of report.groups) {
    for (const row of group.rows) {
      totalsByMonth.set(
        row.month,
        (totalsByMonth.get(row.month) ?? 0) + row.totalCost,
      );
    }
  }

  return Array.from(totalsByMonth.entries())
    .sort(([monthA], [monthB]) => monthA - monthB)
    .map(([month, totalCost]) => ({
      month: `Tháng ${month}`,
      totalCost,
    }));
}

function buildDepartmentCostData(report: ElectricityReportResponse) {
  return report.groups.map((group) => ({
    departmentGroup: getElectricityDepartmentGroupLabel(group.departmentGroup),
    totalCost: group.summary.totalCost,
  }));
}

function buildSummary(report: ElectricityReportResponse) {
  const totalKwhUsed = report.groups.reduce(
    (total, group) => total + group.summary.totalKwhUsed,
    0,
  );
  const totalCost = report.groups.reduce(
    (total, group) => total + group.summary.totalCost,
    0,
  );
  const topDepartment = report.groups.reduce(
    (topGroup, group) =>
      !topGroup || group.summary.totalCost > topGroup.summary.totalCost
        ? group
        : topGroup,
    report.groups[0],
  );
  const monthlyCostData = buildMonthlyCostData(report);
  const peakMonth = monthlyCostData.reduce(
    (topMonth, month) =>
      !topMonth || month.totalCost > topMonth.totalCost ? month : topMonth,
    monthlyCostData[0],
  );

  return {
    monthlyCostData,
    totalCost,
    totalKwhUsed,
    topDepartment,
    peakMonth,
  };
}

function ChartTooltip({ active, label, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
      <p className="font-semibold text-slate-950">{label}</p>
      {payload.map((item) => (
        <p className="mt-1 text-slate-600" key={item.name}>
          {item.name}: {formatCurrency(item.value ?? 0)}
        </p>
      ))}
    </div>
  );
}

export function ElectricityReportDashboard({
  report,
}: ElectricityReportDashboardProps) {
  if (report.groups.length === 0) {
    return null;
  }

  const {
    monthlyCostData,
    totalCost,
    totalKwhUsed,
    topDepartment,
    peakMonth,
  } = buildSummary(report);
  const departmentCostData = buildDepartmentCostData(report);

  return (
    <section className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">
            Tổng kWh
          </p>
          <p className="mt-2 text-xl font-bold text-slate-950">
            {formatNumber(totalKwhUsed)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">
            Tổng chi phí
          </p>
          <p className="mt-2 text-xl font-bold text-slate-950">
            {formatCurrency(totalCost)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">
            Bộ phận cao nhất
          </p>
          <p className="mt-2 text-sm font-bold text-slate-950">
            {getElectricityDepartmentGroupLabel(topDepartment.departmentGroup)}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {formatCurrency(topDepartment.summary.totalCost)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">
            Tháng cao nhất
          </p>
          <p className="mt-2 text-xl font-bold text-slate-950">
            {peakMonth.month}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {formatCurrency(peakMonth.totalCost)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-950">
            Chi phí theo tháng
          </h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={monthlyCostData}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={formatCurrency} width={86} />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="totalCost"
                  fill="#0369a1"
                  name="Chi phí"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-950">
            Chi phí theo bộ phận
          </h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={departmentCostData} layout="vertical">
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis tickFormatter={formatCurrency} type="number" />
                <YAxis
                  dataKey="departmentGroup"
                  tick={{ fontSize: 12 }}
                  type="category"
                  width={132}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="totalCost"
                  fill="#0f766e"
                  name="Chi phí"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
