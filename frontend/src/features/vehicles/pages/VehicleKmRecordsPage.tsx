import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Navbar } from '../../../shared/components/Navbar';
import {
  createVehicleKmRecord,
  deleteVehicleKmRecord,
  getVehicleKmRecordsExportUrl,
  getVehicleKmRecords,
  getVehicles,
  updateVehicleKmRecord,
} from '../api/vehicles';
import {
  VehicleKmRecordForm,
  type VehicleKmRecordFormState,
} from '../components/VehicleKmRecordForm';
import { VehicleKmRecordsTable } from '../components/VehicleKmRecordsTable';
import type {
  CreateVehicleKmRecordInput,
  VehicleKmRecord,
} from '../types/vehicle';

const pageSize = 10;

const emptyFormState: VehicleKmRecordFormState = {
  vehicleId: '',
  tripDate: new Date().toISOString().slice(0, 10),
  driverName: '',
  tripPurpose: '',
  departureTime: '',
  departureOdometer: '',
  arrivalTime: '',
  arrivalOdometer: '',
  note: '',
};

function getFormState(record: VehicleKmRecord): VehicleKmRecordFormState {
  return {
    vehicleId: String(record.vehicleId),
    tripDate: record.tripDate.slice(0, 10),
    driverName: record.driverName ?? '',
    tripPurpose: record.tripPurpose ?? '',
    departureTime: record.departureTime ?? '',
    departureOdometer: String(record.departureOdometer),
    arrivalTime: record.arrivalTime ?? '',
    arrivalOdometer:
      record.arrivalOdometer === null || record.arrivalOdometer === undefined
        ? ''
        : String(record.arrivalOdometer),
    note: record.note ?? '',
  };
}

export function VehicleKmRecordsPage({ showNavbar = true }: { showNavbar?: boolean }) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [editingRecord, setEditingRecord] = useState<VehicleKmRecord | null>(
    null,
  );
  const [formData, setFormData] = useState<VehicleKmRecordFormState>(
    emptyFormState,
  );
  const [deletingRecordId, setDeletingRecordId] = useState<number | null>(null);

  // States bộ lọc
  const [filterYear, setFilterYear] = useState<number | ''>('');
  const [filterMonth, setFilterMonth] = useState<number | ''>('');
  const [filterVehicleId, setFilterVehicleId] = useState<number | ''>('');

  const vehiclesQuery = useQuery({
    queryKey: ['vehicles', 'all'],
    queryFn: () => getVehicles(1, 100, 1),
  });

  const recordsQuery = useQuery({
    queryKey: ['vehicle-km-records', page, pageSize, filterVehicleId, filterYear, filterMonth],
    queryFn: () =>
      getVehicleKmRecords(
        page,
        pageSize,
        filterVehicleId === '' ? undefined : filterVehicleId,
        filterYear === '' ? undefined : filterYear,
        filterMonth === '' ? undefined : filterMonth,
      ),
  });

  const selectedVehicleId = Number(formData.vehicleId);
  const lastKmRecordQuery = useQuery({
    enabled: selectedVehicleId > 0,
    queryKey: ['vehicle-km-records', 'last', selectedVehicleId],
    queryFn: () => getVehicleKmRecords(1, 100, selectedVehicleId),
  });

  const saveMutation = useMutation({
    mutationFn: (input: CreateVehicleKmRecordInput) => {
      if (editingRecord) {
        return updateVehicleKmRecord(editingRecord.id, input);
      }

      return createVehicleKmRecord(input);
    },
    onSuccess: () => {
      setEditingRecord(null);
      setFormData(emptyFormState);
      queryClient.invalidateQueries({ queryKey: ['vehicle-km-records'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVehicleKmRecord,
    onMutate: (id) => {
      setDeletingRecordId(id);
    },
    onSettled: () => {
      setDeletingRecordId(null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-km-records'] });
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
    totalKm: 0,
  };
  const lastArrivalOdometer =
    lastKmRecordQuery.data?.data.find(
      (record) =>
        record.arrivalOdometer !== null &&
        record.arrivalOdometer !== undefined,
    )?.arrivalOdometer ?? undefined;
  const exportUrl = getVehicleKmRecordsExportUrl({
    vehicleId: filterVehicleId === '' ? undefined : filterVehicleId,
    year: filterYear === '' ? undefined : filterYear,
    month: filterMonth === '' ? undefined : filterMonth,
  });

  function updateField<K extends keyof VehicleKmRecordFormState>(
    key: K,
    value: VehicleKmRecordFormState[K],
  ) {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function startEdit(record: VehicleKmRecord) {
    setEditingRecord(record);
    setFormData(getFormState(record));
  }

  function cancelEdit() {
    setEditingRecord(null);
    setFormData(emptyFormState);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {showNavbar && <Navbar />}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-6">
        <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              UtilityTrack
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950">
              Nhập KM xe
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Nhập thông tin xe ra vào theo sổ KM xe của bảo vệ.
            </p>
          </div>

          <a
            className="inline-flex w-fit rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-sm"
            href={exportUrl}
          >
            Xuất Excel
          </a>
        </header>

        <VehicleKmRecordForm
          editingRecord={editingRecord}
          formData={formData}
          isSubmitting={saveMutation.isPending}
          lastArrivalOdometer={lastArrivalOdometer}
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
          <section className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase text-slate-500">Tổng số chuyến đi</p>
              <p className="mt-1 text-lg font-bold text-slate-950">{summary.totalRecords}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase text-slate-500">Tổng quãng đường</p>
              <p className="mt-1 text-lg font-bold text-slate-950">{new Intl.NumberFormat('vi-VN').format(summary.totalKm)} km</p>
            </div>
          </section>
        )}

        {recordsQuery.isLoading ? (
          <p className="rounded-md border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500 shadow-sm">
            Đang tải dữ liệu KM xe...
          </p>
        ) : recordsQuery.error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {recordsQuery.error.message}
          </p>
        ) : (
          <VehicleKmRecordsTable
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
