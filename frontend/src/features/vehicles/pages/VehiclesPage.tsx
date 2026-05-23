import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Navbar } from '../../../shared/components/Navbar';
import {
  createVehicle,
  getVehicles,
  updateVehicle,
} from '../api/vehicles';
import type { CreateVehicleInput, Vehicle } from '../types/vehicle';

const pageSize = 10;

function getInitialVehicleName(vehicle: Vehicle | null) {
  return vehicle?.vehicleName ?? '';
}

export function VehiclesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehicleName, setVehicleName] = useState('');
  const [isActive, setIsActive] = useState<number>(1);
  const [updatingActiveId, setUpdatingActiveId] = useState<number | null>(null);

  const { data, error, isLoading } = useQuery({
    queryKey: ['vehicles', page, pageSize],
    queryFn: () => getVehicles(page, pageSize),
  });

  const saveMutation = useMutation({
    mutationFn: (input: CreateVehicleInput) => {
      if (editingVehicle) {
        return updateVehicle(editingVehicle.id, input);
      }

      return createVehicle(input);
    },
    onSuccess: () => {
      setEditingVehicle(null);
      setVehicleName('');
      setIsActive(1);
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActiveValue }: { id: number; isActiveValue: number }) => {
      return updateVehicle(id, { isActive: isActiveValue });
    },
    onMutate: ({ id }) => {
      setUpdatingActiveId(id);
    },
    onSettled: () => {
      setUpdatingActiveId(null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  const vehicles = data?.data ?? [];
  const meta = data?.meta ?? {
    page,
    limit: pageSize,
    total: 0,
    totalPages: 1,
  };

  function startEdit(vehicle: Vehicle) {
    setEditingVehicle(vehicle);
    setVehicleName(getInitialVehicleName(vehicle));
    setIsActive(vehicle.isActive);
  }

  function cancelEdit() {
    setEditingVehicle(null);
    setVehicleName('');
    setIsActive(1);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextVehicleName = vehicleName.trim();

    if (!nextVehicleName) {
      return;
    }

    saveMutation.mutate({
      vehicleName: nextVehicleName,
      isActive,
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            UtilityTrack
          </p>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-950">
                Quản lý xe
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Quản lý danh sách xe dùng cho nhập KM xe và dữ liệu đổ dầu.
              </p>
            </div>
            <div className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
              <span className="text-slate-500">Tổng số xe</span>
              <strong className="ml-2 text-slate-950">{meta.total}</strong>
            </div>
          </div>
        </header>

        <form
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold text-slate-950">
              {editingVehicle ? 'Sửa xe' : 'Thêm xe'}
            </h2>
            <p className="text-sm text-slate-500">
              Nhập tên xe và trạng thái hoạt động của xe.
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
              Tên xe
              <input
                className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900 bg-white"
                maxLength={100}
                required
                value={vehicleName}
                onChange={(event) => setVehicleName(event.target.value)}
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
              Trạng thái
              <select
                className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900 bg-white"
                value={isActive}
                onChange={(event) => setIsActive(Number(event.target.value))}
              >
                <option value={1}>Đang dùng</option>
                <option value={0}>Ngừng dùng</option>
              </select>
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
              disabled={saveMutation.isPending || !vehicleName.trim()}
              type="submit"
            >
              {saveMutation.isPending
                ? 'Đang lưu...'
                : editingVehicle
                  ? 'Lưu thay đổi'
                  : 'Thêm xe'}
            </button>

            {editingVehicle && (
              <button
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
                disabled={saveMutation.isPending}
                type="button"
                onClick={cancelEdit}
              >
                Hủy
              </button>
            )}
          </div>
        </form>

        {saveMutation.error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {saveMutation.error.message}
          </p>
        )}

        {toggleActiveMutation.error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {toggleActiveMutation.error.message}
          </p>
        )}

        {isLoading ? (
          <p className="rounded-md border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500 shadow-sm">
            Đang tải danh sách xe...
          </p>
        ) : error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error.message}
          </p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Xe</th>
                    <th className="px-4 py-3 font-semibold">Trạng thái</th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id}>
                      <td className="px-4 py-3 font-medium text-slate-950">
                        {vehicle.vehicleName}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {vehicle.isActive === 1 ? (
                          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            Đang dùng
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                            Ngừng dùng
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50"
                            type="button"
                            onClick={() => startEdit(vehicle)}
                          >
                            Sửa
                          </button>
                          {vehicle.isActive === 1 ? (
                            <button
                              className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 disabled:cursor-not-allowed"
                              disabled={updatingActiveId === vehicle.id}
                              type="button"
                              onClick={() =>
                                toggleActiveMutation.mutate({
                                  id: vehicle.id,
                                  isActiveValue: 0,
                                })
                              }
                            >
                              {updatingActiveId === vehicle.id
                                ? 'Đang lưu...'
                                : 'Ngừng dùng'}
                            </button>
                          ) : (
                            <button
                              className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 disabled:cursor-not-allowed"
                              disabled={updatingActiveId === vehicle.id}
                              type="button"
                              onClick={() =>
                                toggleActiveMutation.mutate({
                                  id: vehicle.id,
                                  isActiveValue: 1,
                                })
                              }
                            >
                              {updatingActiveId === vehicle.id
                                ? 'Đang lưu...'
                                : 'Kích hoạt'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {vehicles.length === 0 && (
                    <tr>
                      <td
                        className="px-4 py-10 text-center text-slate-500"
                        colSpan={3}
                      >
                        Chưa có xe.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
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
