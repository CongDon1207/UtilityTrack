import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Navbar } from '../../../shared/components/Navbar';
import {
  createFuelRecord,
  deleteFuelRecord,
  getFuelRecords,
  getVehicles,
  updateFuelRecord,
} from '../api/vehicles';
import {
  FuelRecordForm,
  type FuelRecordFormState,
} from '../components/FuelRecordForm';
import { FuelRecordsTable } from '../components/FuelRecordsTable';
import type { CreateFuelRecordInput, FuelRecord } from '../types/vehicle';

const pageSize = 10;

const emptyFormState: FuelRecordFormState = {
  vehicleId: '',
  fuelDate: new Date().toISOString().slice(0, 10),
  unitPrice: '',
  liters: '',
  note: '',
};

function getFormState(record: FuelRecord): FuelRecordFormState {
  return {
    vehicleId: String(record.vehicleId),
    fuelDate: record.fuelDate.slice(0, 10),
    unitPrice: String(record.unitPrice),
    liters: String(record.liters),
    note: record.note ?? '',
  };
}

export function FuelRecordsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [editingRecord, setEditingRecord] = useState<FuelRecord | null>(null);
  const [formData, setFormData] = useState<FuelRecordFormState>(emptyFormState);
  const [deletingRecordId, setDeletingRecordId] = useState<number | null>(null);

  // States bộ lọc
  const [filterYear, setFilterYear] = useState<number | ''>('');
  const [filterMonth, setFilterMonth] = useState<number | ''>('');
  const [filterVehicleId, setFilterVehicleId] = useState<number | ''>('');

  const vehiclesQuery = useQuery({
    queryKey: ['vehicles', 'all'],
    queryFn: () => getVehicles(1, 100),
  });

  const recordsQuery = useQuery({
    queryKey: ['fuel-records', page, pageSize, filterVehicleId, filterYear, filterMonth],
    queryFn: () =>
      getFuelRecords(
        page,
        pageSize,
        filterVehicleId === '' ? undefined : filterVehicleId,
        filterYear === '' ? undefined : filterYear,
        filterMonth === '' ? undefined : filterMonth,
      ),
  });

  const saveMutation = useMutation({
    mutationFn: (input: CreateFuelRecordInput) => {
      if (editingRecord) {
        return updateFuelRecord(editingRecord.id, input);
      }

      return createFuelRecord(input);
    },
    onSuccess: () => {
      setEditingRecord(null);
      setFormData(emptyFormState);
      queryClient.invalidateQueries({ queryKey: ['fuel-records'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFuelRecord,
    onMutate: (id) => {
      setDeletingRecordId(id);
    },
    onSettled: () => {
      setDeletingRecordId(null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-records'] });
    },
  });

  const vehicles = vehiclesQuery.data?.data ?? [];
  const records = recordsQuery.data?.data ?? [];
  const meta = recordsQuery.data?.meta ?? {
    page,
    limit: pageSize,
    total: 0,
    totalPages: 1,
  };

  const summary = recordsQuery.data?.summary ?? {
    totalRecords: 0,
    totalLiters: 0,
    totalCost: 0,
    avgUnitPrice: 0,
  };

  function updateField<K extends keyof FuelRecordFormState>(
    key: K,
    value: FuelRecordFormState[K],
  ) {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function startEdit(record: FuelRecord) {
    setEditingRecord(record);
    setFormData(getFormState(record));
  }

  function cancelEdit() {
    setEditingRecord(null);
    setFormData(emptyFormState);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            UtilityTrack
          </p>
          <h1 className="text-2xl font-semibold text-slate-950">
            Nhập đổ dầu
          </h1>
          <p className="max-w-2xl text-sm text-slate-600">
            Nhập dữ liệu đổ dầu theo xe, đơn giá và số lít.
          </p>
        </header>

        <FuelRecordForm
          editingRecord={editingRecord}
          formData={formData}
          isSubmitting={saveMutation.isPending}
          vehicles={vehicles}
          onCancelEdit={cancelEdit}
          onSubmit={(input) => saveMutation.mutate(input)}
          onUpdateField={updateField}
        />

        {/* Bộ lọc trong trang */}
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
              Lọc theo năm
              <input
                className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
                type="number"
                placeholder="Tất cả các năm"
                value={filterYear}
                onChange={(event) => {
                  const val = event.target.value;
                  setFilterYear(val === '' ? '' : Number(val));
                  setPage(1);
                }}
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
              Lọc theo tháng
              <select
                className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
                value={filterMonth}
                onChange={(event) => {
                  const val = event.target.value;
                  setFilterMonth(val === '' ? '' : Number(val));
                  setPage(1);
                }}
              >
                <option value="">Tất cả các tháng</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    Tháng {m}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
              Lọc theo xe
              <select
                className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
                value={filterVehicleId}
                onChange={(event) => {
                  const val = event.target.value;
                  setFilterVehicleId(val === '' ? '' : Number(val));
                  setPage(1);
                }}
              >
                <option value="">Tất cả các xe</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.vehicleName}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        {saveMutation.error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {saveMutation.error.message}
          </p>
        )}

        {deleteMutation.error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {deleteMutation.error.message}
          </p>
        )}

        {vehiclesQuery.error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {vehiclesQuery.error.message}
          </p>
        )}

        {/* Panel chỉ số tổng hợp */}
        {recordsQuery.data && (
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase text-slate-500">Tổng số hóa đơn</p>
              <p className="mt-1 text-lg font-bold text-slate-950">{summary.totalRecords}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase text-slate-500">Tổng số lít</p>
              <p className="mt-1 text-lg font-bold text-slate-950">{new Intl.NumberFormat('vi-VN').format(summary.totalLiters)} lít</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase text-slate-500">Tổng chi phí</p>
              <p className="mt-1 text-lg font-bold text-slate-950">{new Intl.NumberFormat('vi-VN').format(summary.totalCost)} đ</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase text-slate-500">Đơn giá trung bình / Lít</p>
              <p className="mt-1 text-lg font-bold text-slate-950">{new Intl.NumberFormat('vi-VN').format(summary.avgUnitPrice)} đ</p>
            </div>
          </section>
        )}

        {recordsQuery.isLoading ? (
          <p className="rounded-md border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500 shadow-sm">
            Đang tải dữ liệu đổ dầu...
          </p>
        ) : recordsQuery.error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {recordsQuery.error.message}
          </p>
        ) : (
          <FuelRecordsTable
            deletingRecordId={deletingRecordId}
            records={records}
            onDelete={(id) => deleteMutation.mutate(id)}
            onEdit={startEdit}
          />
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
          <span className="text-slate-500">
            Trang {meta.page} / {meta.totalPages || 1}
          </span>
          <div className="flex gap-2">
            <button
              className="rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-700 disabled:cursor-not-allowed disabled:text-slate-300"
              disabled={meta.page <= 1}
              type="button"
              onClick={() => setPage((current) => Math.max(current - 1, 1))}
            >
              Trước
            </button>
            <button
              className="rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-700 disabled:cursor-not-allowed disabled:text-slate-300"
              disabled={meta.page >= meta.totalPages}
              type="button"
              onClick={() => setPage((current) => current + 1)}
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
