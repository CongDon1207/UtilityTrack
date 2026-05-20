type ElectricityRecordsPaginationProps = {
  page: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function ElectricityRecordsPagination({
  page,
  total,
  totalPages,
  onPageChange,
}: ElectricityRecordsPaginationProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <span>
        Trang {page} / {Math.max(totalPages, 1)} · {total} bản ghi
      </span>

      <div className="flex gap-2">
        <button
          className="rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-700 disabled:cursor-not-allowed disabled:text-slate-300"
          disabled={page <= 1}
          type="button"
          onClick={() => onPageChange(page - 1)}
        >
          Trước
        </button>
        <button
          className="rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-700 disabled:cursor-not-allowed disabled:text-slate-300"
          disabled={page >= totalPages}
          type="button"
          onClick={() => onPageChange(page + 1)}
        >
          Sau
        </button>
      </div>
    </div>
  );
}
