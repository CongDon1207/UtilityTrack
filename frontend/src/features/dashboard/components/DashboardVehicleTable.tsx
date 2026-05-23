import type { DashboardResponse } from '../types/dashboard';

type DashboardVehicleTableProps = {
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

export function DashboardVehicleTable({ data }: DashboardVehicleTableProps) {
  const { byVehicle } = data;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-slate-950">
          Thống kê chi tiết và hiệu suất vận hành theo từng xe
        </h3>
        <p className="text-xs text-slate-500">
          Danh sách xe và các chỉ số hiệu quả năng lượng (VND/km, km/lít) trong khoảng thời gian được lọc
        </p>
      </div>

      <div className="mt-5 overflow-hidden rounded-md border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Tên xe</th>
                <th className="px-4 py-3 font-semibold text-center">Trạng thái</th>
                <th className="px-4 py-3 font-semibold text-right">Quãng đường (km)</th>
                <th className="px-4 py-3 font-semibold text-right">Nhiên liệu (lít)</th>
                <th className="px-4 py-3 font-semibold text-right">Chi phí xăng dầu</th>
                <th className="px-4 py-3 font-semibold text-right">Chi phí / KM</th>
                <th className="px-4 py-3 font-semibold text-right">KM / Lít</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {byVehicle.map((v) => (
                <tr className="hover:bg-slate-50 transition-colors" key={v.vehicleId}>
                  <td className="px-4 py-3 font-medium text-slate-950">
                    {v.vehicleName}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        v.isActive === 1
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {v.isActive === 1 ? 'Đang dùng' : 'Ngừng dùng'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-900 font-medium">
                    {formatNumber(v.totalKm)}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600">
                    {formatNumber(v.totalLiters)}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600">
                    {formatCurrency(v.totalCost)}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-900 font-semibold">
                    {formatCurrency(v.costPerKm)}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-900 font-semibold">
                    {v.kmPerLiter > 0 ? `${v.kmPerLiter.toFixed(1)} km/l` : '0.0 km/l'}
                  </td>
                </tr>
              ))}

              {byVehicle.length === 0 && (
                <tr>
                  <td
                    className="px-4 py-10 text-center text-slate-500"
                    colSpan={7}
                  >
                    Không có dữ liệu vận hành xe trong kỳ lọc này.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
