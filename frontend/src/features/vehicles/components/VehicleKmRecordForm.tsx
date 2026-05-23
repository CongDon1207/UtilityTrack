import type { CreateVehicleKmRecordInput, Vehicle, VehicleKmRecord } from '../types/vehicle';

export type VehicleKmRecordFormState = {
  vehicleId: string;
  tripDate: string;
  driverName: string;
  tripPurpose: string;
  departureTime: string;
  departureOdometer: string;
  arrivalTime: string;
  arrivalOdometer: string;
  note: string;
};

type VehicleKmRecordFormProps = {
  editingRecord: VehicleKmRecord | null;
  formData: VehicleKmRecordFormState;
  isSubmitting: boolean;
  lastArrivalOdometer?: number;
  vehicles: Vehicle[];
  onCancelEdit: () => void;
  onSubmit: (input: CreateVehicleKmRecordInput) => void;
  onUpdateField: <K extends keyof VehicleKmRecordFormState>(
    key: K,
    value: VehicleKmRecordFormState[K],
  ) => void;
};

const driverOptions = ['Vinh', 'Poun', 'Lâm', 'Hoàng', 'Trường'];

export function VehicleKmRecordForm({
  editingRecord,
  formData,
  isSubmitting,
  lastArrivalOdometer,
  vehicles,
  onCancelEdit,
  onSubmit,
  onUpdateField,
}: VehicleKmRecordFormProps) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit({
      vehicleId: Number(formData.vehicleId),
      tripDate: formData.tripDate,
      driverName: formData.driverName.trim() || undefined,
      tripPurpose: formData.tripPurpose.trim() || undefined,
      departureTime: formData.departureTime || undefined,
      departureOdometer: Number(formData.departureOdometer),
      arrivalTime: formData.arrivalTime || undefined,
      arrivalOdometer: Number(formData.arrivalOdometer),
      note: formData.note.trim() || undefined,
    });
  }

  return (
    <form
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Xe
          <select
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
            required
            value={formData.vehicleId}
            onChange={(event) => onUpdateField('vehicleId', event.target.value)}
          >
            <option value="">Chọn xe</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.vehicleName}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Ngày
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
            required
            type="date"
            value={formData.tripDate}
            onChange={(event) => onUpdateField('tripDate', event.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Tài xế
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
            list="driver-options"
            maxLength={100}
            value={formData.driverName}
            onChange={(event) => onUpdateField('driverName', event.target.value)}
          />
          <datalist id="driver-options">
            {driverOptions.map((driver) => (
              <option key={driver} value={driver} />
            ))}
          </datalist>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Nội dung
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
            maxLength={300}
            value={formData.tripPurpose}
            onChange={(event) => onUpdateField('tripPurpose', event.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Giờ ra
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
            type="time"
            value={formData.departureTime}
            onChange={(event) =>
              onUpdateField('departureTime', event.target.value)
            }
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          <span className="flex items-center justify-between gap-2">
            CSĐH ra
            <button
              className="text-xs font-semibold text-slate-600 disabled:cursor-not-allowed disabled:text-slate-300"
              disabled={lastArrivalOdometer === undefined}
              type="button"
              onClick={() =>
                onUpdateField(
                  'departureOdometer',
                  String(lastArrivalOdometer ?? ''),
                )
              }
            >
              Dùng số cuối
            </button>
          </span>
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
            inputMode="numeric"
            min="0"
            required
            step="1"
            type="number"
            value={formData.departureOdometer}
            onChange={(event) =>
              onUpdateField('departureOdometer', event.target.value)
            }
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Giờ vào
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
            type="time"
            value={formData.arrivalTime}
            onChange={(event) => onUpdateField('arrivalTime', event.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          CSĐH vào
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
            inputMode="numeric"
            min="0"
            required
            step="1"
            type="number"
            value={formData.arrivalOdometer}
            onChange={(event) =>
              onUpdateField('arrivalOdometer', event.target.value)
            }
          />
        </label>
      </div>

      <label className="mt-4 flex flex-col gap-1.5 text-sm font-medium text-slate-700">
        Ghi chú
        <textarea
          className="min-h-20 rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
          maxLength={500}
          value={formData.note}
          onChange={(event) => onUpdateField('note', event.target.value)}
        />
      </label>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting
            ? 'Đang lưu...'
            : editingRecord
              ? 'Lưu thay đổi'
              : 'Thêm lượt xe'}
        </button>

        {editingRecord && (
          <button
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
            disabled={isSubmitting}
            type="button"
            onClick={onCancelEdit}
          >
            Hủy
          </button>
        )}
      </div>
    </form>
  );
}
