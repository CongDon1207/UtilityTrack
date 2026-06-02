import type { VehicleKmRecord } from '../types/vehicle';

type VehicleKmRecordsTableProps = {
  deletingRecordId: number | null;
  records: VehicleKmRecord[];
  onDelete: (id: number) => void;
  onEdit: (record: VehicleKmRecord) => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('vi-VN').format(new Date(value));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('vi-VN').format(value);
}

function getCompletedDistance(record: VehicleKmRecord) {
  if (record.arrivalOdometer === null || record.arrivalOdometer === undefined) {
    return null;
  }

  return record.arrivalOdometer - record.departureOdometer;
}

function formatCompletedDistance(record: VehicleKmRecord) {
  const distance = getCompletedDistance(record);
  return distance === null ? 'Chưa vào' : formatNumber(distance);
}

function isOpenRecord(record: VehicleKmRecord) {
  return record.arrivalOdometer === null || record.arrivalOdometer === undefined;
}

export function VehicleKmRecordsTable({
  deletingRecordId,
  records,
  onDelete,
  onEdit,
}: VehicleKmRecordsTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Ngày</th>
              <th className="px-4 py-3 font-semibold">Xe</th>
              <th className="px-4 py-3 font-semibold">Tài xế</th>
              <th className="px-4 py-3 font-semibold">Nội dung</th>
              <th className="px-4 py-3 text-right font-semibold">CSĐH ra</th>
              <th className="px-4 py-3 text-right font-semibold">CSĐH vào</th>
              <th className="px-4 py-3 text-right font-semibold">KM</th>
              <th className="px-4 py-3 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((record) => (
              <tr
                key={record.id}
                className={`align-top ${
                  isOpenRecord(record) ? 'bg-amber-50' : 'bg-white'
                }`}
              >
                <td className="px-4 py-3">{formatDate(record.tripDate)}</td>
                <td className="px-4 py-3 font-medium text-slate-950">
                  {record.vehicle.vehicleName}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {record.driverName || '-'}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {record.tripPurpose || '-'}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {formatNumber(record.departureOdometer)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {record.arrivalOdometer === null ||
                  record.arrivalOdometer === undefined
                    ? '-'
                    : formatNumber(record.arrivalOdometer)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {formatCompletedDistance(record)}
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
                <td
                  className="px-4 py-10 text-center text-slate-500"
                  colSpan={8}
                >
                  Chưa có dữ liệu KM xe.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
