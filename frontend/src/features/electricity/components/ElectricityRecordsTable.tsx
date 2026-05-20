import { getElectricityDepartmentGroupLabel } from '../constants/electricityDepartmentGroups';
import type { ElectricityRecord } from '../types/electricityRecord';

type ElectricityRecordsTableProps = {
  records: ElectricityRecord[];
  isDeletingId: number | null;
  onDelete: (id: number) => void;
  onEdit: (record: ElectricityRecord) => void;
};

const numberFormatter = new Intl.NumberFormat('vi-VN');

export function ElectricityRecordsTable({
  records,
  isDeletingId,
  onDelete,
  onEdit,
}: ElectricityRecordsTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Kỳ</th>
              <th className="px-4 py-3 font-semibold">Bộ phận</th>
              <th className="px-4 py-3 text-right font-semibold">kWh</th>
              <th className="px-4 py-3 text-right font-semibold">Chi phí</th>
              <th className="px-4 py-3 font-semibold">Ghi chú</th>
              <th className="px-4 py-3 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((record) => (
              <tr key={record.id} className="align-top">
                <td className="px-4 py-3 font-medium text-slate-950">
                  {record.recordMonth}/{record.recordYear}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {getElectricityDepartmentGroupLabel(record.departmentGroup)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                  {numberFormatter.format(record.kwhUsed)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                  {numberFormatter.format(record.totalCost)}
                </td>
                <td className="max-w-56 px-4 py-3 text-slate-500">
                  {record.note || '-'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700"
                      type="button"
                      onClick={() => onEdit(record)}
                    >
                      Sửa
                    </button>
                    <button
                      className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 disabled:cursor-not-allowed disabled:text-red-300"
                      disabled={isDeletingId === record.id}
                      type="button"
                      onClick={() => onDelete(record.id)}
                    >
                      {isDeletingId === record.id ? 'Đang xóa...' : 'Xóa'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {records.length === 0 && (
              <tr>
                <td className="px-4 py-10 text-center text-slate-500" colSpan={6}>
                  Không tìm thấy dữ liệu điện.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
