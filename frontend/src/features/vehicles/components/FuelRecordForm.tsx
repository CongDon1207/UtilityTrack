import type { CreateFuelRecordInput, FuelRecord, Vehicle } from '../types/vehicle';

export type FuelRecordFormState = {
  vehicleId: string;
  fuelDate: string;
  unitPrice: string;
  liters: string;
  note: string;
};

type FuelRecordFormProps = {
  editingRecord: FuelRecord | null;
  formData: FuelRecordFormState;
  isSubmitting: boolean;
  vehicles: Vehicle[];
  onCancelEdit: () => void;
  onSubmit: (input: CreateFuelRecordInput) => void;
  onUpdateField: <K extends keyof FuelRecordFormState>(
    key: K,
    value: FuelRecordFormState[K],
  ) => void;
};

const currencyFormatter = new Intl.NumberFormat('vi-VN');

export function FuelRecordForm({
  editingRecord,
  formData,
  isSubmitting,
  vehicles,
  onCancelEdit,
  onSubmit,
  onUpdateField,
}: FuelRecordFormProps) {
  const totalAmount = Number(formData.unitPrice) * Number(formData.liters);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit({
      vehicleId: Number(formData.vehicleId),
      fuelDate: formData.fuelDate,
      unitPrice: Number(formData.unitPrice),
      liters: Number(formData.liters),
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
          Ngày đổ dầu
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
            required
            type="date"
            value={formData.fuelDate}
            onChange={(event) => onUpdateField('fuelDate', event.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Đơn giá
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
            inputMode="numeric"
            min="0"
            required
            step="1"
            type="number"
            value={formData.unitPrice}
            onChange={(event) => onUpdateField('unitPrice', event.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Số lít
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
            inputMode="decimal"
            min="0"
            required
            step="0.01"
            type="number"
            value={formData.liters}
            onChange={(event) => onUpdateField('liters', event.target.value)}
          />
        </label>
      </div>

      <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
        <span className="text-slate-500">Số tiền tự tính</span>
        <strong className="ml-2 text-slate-950">
          {currencyFormatter.format(Number.isFinite(totalAmount) ? totalAmount : 0)}
        </strong>
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
              : 'Thêm lượt đổ dầu'}
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
