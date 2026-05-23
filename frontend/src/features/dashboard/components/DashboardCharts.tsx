import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DashboardResponse } from '../types/dashboard';

type DashboardChartsProps = {
  data: DashboardResponse;
};

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('vi-VN');

function formatCurrency(value: number) {
  return currencyFormatter.format(value) + ' đ';
}

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

type ChartTooltipPayload = {
  name?: string;
  value?: number;
  color?: string;
  dataKey?: string;
};

type ChartTooltipProps = {
  active?: boolean;
  label?: string;
  payload?: ChartTooltipPayload[];
};

// Tooltip tùy chỉnh cho biểu đồ chi phí
function CostTooltip({ active, label, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
      <p className="font-semibold text-slate-950">{label}</p>
      {payload.map((item) => (
        <p className="mt-1 text-slate-600" key={item.dataKey}>
          <span
            className="inline-block h-2 w-2 rounded-full mr-1.5"
            style={{ backgroundColor: item.color }}
          />
          {item.name}: <strong>{formatCurrency(item.value ?? 0)}</strong>
        </p>
      ))}
    </div>
  );
}

// Tooltip tùy chỉnh cho biểu đồ vận hành xe cộ
function PerformanceTooltip({ active, label, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
      <p className="font-semibold text-slate-950">{label}</p>
      {payload.map((item) => {
        const unit = item.dataKey === 'vehicleKm' ? ' km' : ' lít';
        return (
          <p className="mt-1 text-slate-600" key={item.dataKey}>
            <span
              className="inline-block h-2 w-2 rounded-full mr-1.5"
              style={{ backgroundColor: item.color }}
            />
            {item.name}: <strong>{formatNumber(item.value ?? 0)}{unit}</strong>
          </p>
        );
      })}
    </div>
  );
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  const chartData = data.monthlyTrend.map((t) => ({
    month: `Tháng ${t.month}`,
    electricityCost: t.electricityCost,
    vehicleFuelCost: t.vehicleFuelCost,
    vehicleKm: t.vehicleKm,
    vehicleFuelLiters: t.vehicleFuelLiters,
  }));

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      {/* Biểu đồ 1: So sánh chi phí điện & nhiên liệu */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-950">
          Xu hướng chi phí tiện ích hàng tháng
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          So sánh chi phí hóa đơn điện và chi phí nhiên liệu xăng dầu qua các tháng trong năm
        </p>
        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: -10, right: 10 }}>
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis
                tickFormatter={(val) => currencyFormatter.format(val)}
                tick={{ fontSize: 11, fill: '#64748b' }}
                width={80}
              />
              <Tooltip content={<CostTooltip />} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12 }} />
              <Bar
                dataKey="electricityCost"
                fill="#d97706"
                name="Chi phí điện"
                radius={[3, 3, 0, 0]}
              />
              <Bar
                dataKey="vehicleFuelCost"
                fill="#0284c7"
                name="Chi phí xăng dầu"
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Biểu đồ 2: Hiệu suất vận hành xe cộ */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-950">
          Hiệu suất vận hành và tiêu hao nhiên liệu xe cộ
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Xu hướng so sánh giữa số km xe di chuyển (Cột) và lượng xăng dầu tiêu thụ (Đường)
        </p>
        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ left: -15, right: -15 }}>
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11, fill: '#64748b' }}
                width={55}
                label={{
                  value: 'Quãng đường (km)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: '#64748b', fontSize: 10 },
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: '#64748b' }}
                width={55}
                label={{
                  value: 'Nhiên liệu (lít)',
                  angle: 90,
                  position: 'insideRight',
                  style: { textAnchor: 'middle', fill: '#64748b', fontSize: 10 },
                }}
              />
              <Tooltip content={<PerformanceTooltip />} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12 }} />
              <Bar
                yAxisId="left"
                dataKey="vehicleKm"
                fill="#10b981"
                name="Quãng đường (km)"
                radius={[3, 3, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="vehicleFuelLiters"
                stroke="#0284c7"
                strokeWidth={2.5}
                name="Nhiên liệu (lít)"
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
