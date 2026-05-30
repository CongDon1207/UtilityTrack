import { useState, type FormEvent } from 'react';
import type {
  CreateVehicleKmRecordInput,
  Vehicle,
  VehicleKmRecord,
} from '../types/vehicle';

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
  const [odometerError, setOdometerError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const departureOdometer = Number(formData.departureOdometer);
    const arrivalOdometer =
      formData.arrivalOdometer === ''
        ? undefined
        : Number(formData.arrivalOdometer);

    if (arrivalOdometer !== undefined && departureOdometer > arrivalOdometer) {
      setOdometerError(
        'CSDH ra không được lớn hơn CSDH vào. Vui lòng nhập lại vì CSDH vào phải lớn hơn hoặc bằng CSDH ra.',
      );
      return;
    }

    setOdometerError(null);

    onSubmit({
      vehicleId: Number(formData.vehicleId),
      tripDate: formData.tripDate,
      driverName: formData.driverName.trim() || undefined,
      tripPurpose: formData.tripPurpose.trim() || undefined,
      departureTime: formData.departureTime || undefined,
      departureOdometer,
      arrivalTime: formData.arrivalTime || undefined,
      ...(arrivalOdometer !== undefined ? { arrivalOdometer } : {}),
      note: formData.note.trim() || undefined,
    });
  }

  return (
    <form
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
      onSubmit={handleSubmit}
    >
      <div className="space-y-6">
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Thông tin chuyến đi
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
              Xe
              <select
                className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
                required
                value={formData.vehicleId}
                onChange={(event) =>
                  onUpdateField('vehicleId', event.target.value)
                }
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
                onChange={(event) =>
                  onUpdateField('tripDate', event.target.value)
                }
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
              Tài xế
              <input
                className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
                list="driver-options"
                maxLength={100}
                value={formData.driverName}
                onChange={(event) =>
                  onUpdateField('driverName', event.target.value)
                }
              />
              <datalist id="driver-options">
                {driverOptions.map((driver) => (
                  <option key={driver} value={driver} />
                ))}
              </datalist>
            </label>
          </div>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
            Nội dung
            <textarea
              className="min-h-20 rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
              maxLength={300}
              value={formData.tripPurpose}
              onChange={(event) =>
                onUpdateField('tripPurpose', event.target.value)
              }
            />
          </label>
        </section>

        <section className="space-y-4 border-t border-slate-200 pt-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Xe ra
          </h2>

          <div className="grid gap-4 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
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
                CSDH ra
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
          </div>
        </section>

        <section className="space-y-4 border-t border-slate-200 pt-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Xe vào
          </h2>

          <div className="grid gap-4 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
              Giờ vào
              <input
                className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
                type="time"
                value={formData.arrivalTime}
                onChange={(event) =>
                  onUpdateField('arrivalTime', event.target.value)
                }
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
              CSDH vào
              <input
                className={`rounded-md border px-3 py-2 text-slate-950 outline-none focus:border-slate-900 ${
                  odometerError ? 'border-red-300' : 'border-slate-300'
                }`}
                inputMode="numeric"
                min="0"
                step="1"
                type="number"
                value={formData.arrivalOdometer}
                onChange={(event) => {
                  setOdometerError(null);
                  onUpdateField('arrivalOdometer', event.target.value);
                }}
              />
            </label>
          </div>
        </section>
      </div>

      {odometerError && (
        <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {odometerError}
        </p>
      )}

      <label className="mt-6 flex flex-col gap-1.5 text-sm font-medium text-slate-700">
        Ghi chú
        <textarea
          className="min-h-24 rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
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
