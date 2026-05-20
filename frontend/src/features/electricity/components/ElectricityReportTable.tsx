import { Fragment } from 'react';
import { getElectricityDepartmentGroupLabel } from '../constants/electricityDepartmentGroups';
import type { ElectricityReportResponse } from '../types/electricityReport';
import type { ElectricityDepartmentGroup } from '../types/electricityRecord';

type ElectricityReportTableProps = {
  report: ElectricityReportResponse;
};

const numberFormatter = new Intl.NumberFormat('vi-VN');

const departmentGroupClasses: Record<ElectricityDepartmentGroup, string> = {
  MAY_MAY_DIEN_TU_VAN_PHONG_NHA_BEP_KHO:
    'border-sky-200 bg-sky-50 text-sky-900',
  CAT_CHUAN_BI_UV_TECH_CU: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  LASTING: 'border-amber-200 bg-amber-50 text-amber-900',
  PHONG_TECH_MOI: 'border-violet-200 bg-violet-50 text-violet-900',
};

function formatDiff(value: number | null) {
  if (value === null) {
    return '-';
  }

  return value > 0
    ? `+${numberFormatter.format(value)}`
    : numberFormatter.format(value);
}

export function ElectricityReportTable({ report }: ElectricityReportTableProps) {
  if (report.groups.length === 0) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500 shadow-sm">
        Không tìm thấy dữ liệu báo cáo.
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-sky-200 bg-sky-900 px-4 py-3 text-center">
        <h2 className="text-sm font-bold uppercase text-white">
          BẢNG CHI TIẾT SỬ DỤNG ĐIỆN CỦA CÁC BỘ PHẬN TRONG NĂM {report.year}
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-sky-50 text-sky-950">
              <th className="w-48 border border-sky-200 px-3 py-2.5 text-center font-semibold">
                BỘ PHẬN
              </th>
              <th className="w-20 border border-sky-200 px-3 py-2.5 text-center font-semibold">
                THÁNG
              </th>
              <th className="border border-sky-200 px-3 py-2.5 text-right font-semibold">
                SỐ ĐIỆN SỬ DỤNG (KW)
              </th>
              <th className="border border-sky-200 px-3 py-2.5 text-right font-semibold">
                SỐ TIỀN
              </th>
              <th className="border border-sky-200 px-3 py-2.5 text-right font-semibold">
                CHÊNH LỆCH SO VỚI THÁNG TRƯỚC
              </th>
              <th className="min-w-48 border border-sky-200 px-3 py-2.5 text-left font-semibold">
                GHI CHÚ
              </th>
            </tr>
          </thead>
          <tbody>
            {report.groups.map((group) => (
              <Fragment key={group.departmentGroup}>
                {group.rows.map((row, rowIndex) => (
                  <tr
                    className="odd:bg-white even:bg-slate-50/60 hover:bg-sky-50/50"
                    key={`${group.departmentGroup}-${row.month}`}
                  >
                    {rowIndex === 0 && (
                      <td
                        className={`border px-3 py-3 text-center align-middle text-sm font-bold uppercase leading-5 ${departmentGroupClasses[group.departmentGroup]}`}
                        rowSpan={group.rows.length}
                      >
                        {getElectricityDepartmentGroupLabel(
                          group.departmentGroup,
                        )}
                      </td>
                    )}
                    <td className="border border-slate-200 px-3 py-2.5 text-center font-semibold text-slate-950">
                      {row.month}
                    </td>
                    <td className="border border-slate-200 px-3 py-2.5 text-right tabular-nums text-slate-700">
                      {numberFormatter.format(row.kwhUsed)}
                    </td>
                    <td className="border border-slate-200 px-3 py-2.5 text-right tabular-nums text-slate-700">
                      {numberFormatter.format(row.totalCost)}
                    </td>
                    <td className="border border-slate-200 px-3 py-2.5 text-right tabular-nums text-slate-700">
                      {formatDiff(row.costDiffFromPreviousMonth)}
                    </td>
                    <td className="border border-slate-200 px-3 py-2.5 text-left text-slate-600">
                      {row.note || '-'}
                    </td>
                  </tr>
                ))}
                <tr className="bg-sky-100 font-semibold text-sky-950">
                  <td className="border border-sky-200 px-3 py-2.5 text-center">
                    TỔNG
                  </td>
                  <td className="border border-sky-200 px-3 py-2.5" />
                  <td className="border border-sky-200 px-3 py-2.5 text-right tabular-nums">
                    {numberFormatter.format(group.summary.totalKwhUsed)}
                  </td>
                  <td className="border border-sky-200 px-3 py-2.5 text-right tabular-nums">
                    {numberFormatter.format(group.summary.totalCost)}
                  </td>
                  <td className="border border-sky-200 px-3 py-2.5" />
                  <td className="border border-sky-200 px-3 py-2.5" />
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
