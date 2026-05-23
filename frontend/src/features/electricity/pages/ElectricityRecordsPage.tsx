import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../../shared/components/Navbar';
import {
  createElectricityRecord,
  deleteElectricityRecord,
  getElectricityRecords,
  updateElectricityRecord,
} from '../api/electricityRecords';
import { ElectricityRecordForm } from '../components/ElectricityRecordForm';
import { ElectricityRecordsPagination } from '../components/ElectricityRecordsPagination';
import { ElectricityRecordsTable } from '../components/ElectricityRecordsTable';
import type {
  CreateElectricityRecordInput,
  ElectricityRecord,
} from '../types/electricityRecord';

const pageSize = 10;

export function ElectricityRecordsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [editingRecord, setEditingRecord] = useState<ElectricityRecord | null>(
    null,
  );
  const [deletingRecordId, setDeletingRecordId] = useState<number | null>(null);

  const queryKey = ['electricity-records', page, pageSize];

  const { data, error, isLoading } = useQuery({
    queryKey,
    queryFn: () => getElectricityRecords(page, pageSize),
  });

  const saveMutation = useMutation({
    mutationFn: (input: CreateElectricityRecordInput) => {
      if (editingRecord) {
        return updateElectricityRecord(editingRecord.id, input);
      }

      return createElectricityRecord(input);
    },
    onSuccess: () => {
      setEditingRecord(null);
      queryClient.invalidateQueries({ queryKey: ['electricity-records'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteElectricityRecord,
    onMutate: (id) => {
      setDeletingRecordId(id);
    },
    onSettled: () => {
      setDeletingRecordId(null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['electricity-records'] });
    },
  });

  const records = data?.data ?? [];
  const meta = data?.meta ?? {
    page,
    limit: pageSize,
    total: 0,
    totalPages: 1,
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            UtilityTrack
          </p>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-950">
                Quản lý điện
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Quản lý sản lượng điện tiêu thụ và chi phí hằng tháng theo bộ phận.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
                to="/electricity-records/report"
              >
                Xem báo cáo
              </Link>
              <div className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
                <span className="text-slate-500">Tổng số bản ghi</span>
                <strong className="ml-2 text-slate-950">{meta.total}</strong>
              </div>
            </div>
          </div>
        </header>

        <ElectricityRecordForm
          editingRecord={editingRecord}
          isSubmitting={saveMutation.isPending}
          key={editingRecord?.id ?? 'new-record'}
          onCancelEdit={() => setEditingRecord(null)}
          onSubmit={(input) => saveMutation.mutate(input)}
        />

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

        {isLoading ? (
          <p className="rounded-md border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500 shadow-sm">
            Đang tải dữ liệu điện...
          </p>
        ) : error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error.message}
          </p>
        ) : (
          <>
            <ElectricityRecordsTable
              isDeletingId={deletingRecordId}
              records={records}
              onDelete={(id) => deleteMutation.mutate(id)}
              onEdit={setEditingRecord}
            />

            <ElectricityRecordsPagination
              page={meta.page}
              total={meta.total}
              totalPages={meta.totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </main>
  );
}
