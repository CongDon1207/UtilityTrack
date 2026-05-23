import { useState } from 'react';
import { electricityDepartmentGroupOptions } from '../constants/electricityDepartmentGroups';
import type {
  CreateElectricityRecordInput,
  ElectricityDepartmentGroup,
  ElectricityRecord,
} from '../types/electricityRecord';

type ElectricityRecordFormProps = {
  editingRecord: ElectricityRecord | null;
  isSubmitting: boolean;
  onCancelEdit: () => void;
  onSubmit: (input: CreateElectricityRecordInput) => void;
};

type FormState = {
  recordYear: string;
  recordMonth: string;
  departmentGroup: ElectricityDepartmentGroup;
  kwhUsed: string;
  totalCost: string;
  note: string;
};

const defaultFormState: FormState = {
  recordYear: String(new Date().getFullYear()),
  recordMonth: '1',
  departmentGroup: 'MAY_MAY_DIEN_TU_VAN_PHONG_NHA_BEP_KHO',
  kwhUsed: '',
  totalCost: '',
  note: '',
};

function formatWithSeparator(val: string | number): string {
  const clean = typeof val === 'number' ? String(val) : val.replace(/\D/g, '');
  if (!clean) return '';
  const num = Number(clean);
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('vi-VN').format(num);
}

function getInitialFormState(record: ElectricityRecord | null): FormState {
  if (!record) {
    return defaultFormState;
  }

  return {
    recordYear: String(record.recordYear),
    recordMonth: String(record.recordMonth),
    departmentGroup: record.departmentGroup,
    kwhUsed: formatWithSeparator(record.kwhUsed),
    totalCost: formatWithSeparator(record.totalCost),
    note: record.note ?? '',
  };
}

export function ElectricityRecordForm({
  editingRecord,
  isSubmitting,
  onCancelEdit,
  onSubmit,
}: ElectricityRecordFormProps) {
  const [formData, setFormData] = useState<FormState>(() =>
    getInitialFormState(editingRecord),
  );

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setFormData((current) => {
      let formattedValue = value;
      if (key === 'kwhUsed' || key === 'totalCost') {
        formattedValue = formatWithSeparator(value as string) as FormState[K];
      }
      return {
        ...current,
        [key]: formattedValue,
      };
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanKwh = Number(formData.kwhUsed.replace(/\D/g, ''));
    const cleanCost = Number(formData.totalCost.replace(/\D/g, ''));

    onSubmit({
      recordYear: Number(formData.recordYear),
      recordMonth: Number(formData.recordMonth),
      departmentGroup: formData.departmentGroup,
      kwhUsed: cleanKwh,
      totalCost: cleanCost,
      note: formData.note.trim() || undefined,
    });

    if (!editingRecord) {
      setFormData(defaultFormState);
    }
  }

  return (
    <form
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-slate-950">
          {editingRecord ? 'Sửa dữ liệu điện' : 'Thêm dữ liệu điện'}
        </h2>
        <p className="text-sm text-slate-500">
          Sản lượng điện và chi phí hằng tháng theo bộ phận.
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Năm
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900 bg-white"
            min="2000"
            required
            type="number"
            value={formData.recordYear}
            onChange={(event) => updateField('recordYear', event.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Tháng
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900 bg-white"
            max="12"
            min="1"
            required
            type="number"
            value={formData.recordMonth}
            onChange={(event) => updateField('recordMonth', event.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700 md:col-span-2 xl:col-span-1">
          Bộ phận
          <select
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900 bg-white"
            required
            value={formData.departmentGroup}
            onChange={(event) =>
              updateField(
                'departmentGroup',
                event.target.value as ElectricityDepartmentGroup,
              )
            }
          >
            {electricityDepartmentGroupOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Số điện sử dụng (kWh)
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900 bg-white"
            required
            type="text"
            value={formData.kwhUsed}
            onChange={(event) => updateField('kwhUsed', event.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Tổng chi phí (VND)
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900 bg-white"
            required
            type="text"
            value={formData.totalCost}
            onChange={(event) => updateField('totalCost', event.target.value)}
          />
        </label>
      </div>

      <label className="mt-4 flex flex-col gap-1.5 text-sm font-medium text-slate-700">
        Ghi chú
        <textarea
          className="min-h-24 rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900 bg-white"
          value={formData.note}
          onChange={(event) => updateField('note', event.target.value)}
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
              : 'Tạo bản ghi'}
        </button>

        {editingRecord && (
          <button
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
            disabled={isSubmitting}
            type="button"
            onClick={onCancelEdit}
          >
            Hủy sửa
          </button>
        )}
      </div>
    </form>
  );
}
