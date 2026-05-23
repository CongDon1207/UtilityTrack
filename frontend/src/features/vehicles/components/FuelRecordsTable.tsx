import type { FuelRecord } from '../types/vehicle';

type FuelRecordsTableProps = {
  deletingRecordId: number | null;
  records: FuelRecord[];
  onDelete: (id: number) => void;
  onEdit: (record: FuelRecord) => void;
};

const numberFormatter = new Intl.NumberFormat('vi-VN');

function formatDate(value: string) {
  return new Intl.DateTimeFormat('vi-VN').format(new Date(value));
}

export function FuelRecordsTable({
  deletingRecordId,
  records,
  onDelete,
  onEdit,
}: FuelRecordsTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Ngày</th>
              <th className="px-4 py-3 font-semibold">Xe</th>
              <th className="px-4 py-3 text-right font-semibold">Đơn giá</th>
              <th className="px-4 py-3 text-right font-semibold">Số lít</th>
              <th className="px-4 py-3 text-right font-semibold">Số tiền</th>
              <th className="px-4 py-3 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((record) => (
              <tr key={record.id} className="align-top">
                <td className="px-4 py-3">{formatDate(record.fuelDate)}</td>
                <td className="px-4 py-3 font-medium text-slate-950">
                  {record.vehicle.vehicleName}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {numberFormatter.format(record.unitPrice)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {numberFormatter.format(record.liters)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {numberFormatter.format(record.unitPrice * record.liters)}
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
                      disabled={deletingRecordId === record.id}
                      type="button"
                      onClick={() => onDelete(record.id)}
                    >
                      {deletingRecordId === record.id ? 'Đang xóa...' : 'Xóa'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {records.length === 0 && (
              <tr>
                <td className="px-4 py-10 text-center text-slate-500" colSpan={6}>
                  Chưa có dữ liệu đổ dầu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
