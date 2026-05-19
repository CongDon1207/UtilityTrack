import { getElectricityDepartmentGroupLabel } from '../constants/electricityDepartmentGroups';
import type { ElectricityReportResponse } from '../types/electricityReport';

type ElectricityReportTableProps = {
  report: ElectricityReportResponse;
};

const numberFormatter = new Intl.NumberFormat('en-US');

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
        No report data found.
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-100 px-4 py-3 text-center">
        <h2 className="text-sm font-bold uppercase text-slate-950">
          BANG CHI TIET SU DUNG DIEN CUA CAC BO PHAN TRONG NAM {report.year}
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-700">
              <th className="w-44 border border-slate-300 px-3 py-2 text-center font-semibold">
                BO PHAN
              </th>
              <th className="w-20 border border-slate-300 px-3 py-2 text-center font-semibold">
                THANG
              </th>
              <th className="border border-slate-300 px-3 py-2 text-right font-semibold">
                SO DIEN SU DUNG (KW)
              </th>
              <th className="border border-slate-300 px-3 py-2 text-right font-semibold">
                SO TIEN
              </th>
              <th className="border border-slate-300 px-3 py-2 text-right font-semibold">
                CHENH LECH SO VOI THANG TRUOC
              </th>
            </tr>
          </thead>
          <tbody>
            {report.groups.map((group) => (
              <>
                {group.rows.map((row, rowIndex) => (
                  <tr key={`${group.departmentGroup}-${row.month}`}>
                    {rowIndex === 0 && (
                      <td
                        className="border border-slate-300 bg-slate-100 px-3 py-2 text-center align-middle text-sm font-bold uppercase leading-5 text-slate-950"
                        rowSpan={group.rows.length}
                      >
                        {getElectricityDepartmentGroupLabel(
                          group.departmentGroup,
                        )}
                      </td>
                    )}
                    <td className="border border-slate-300 px-3 py-2 text-center font-medium text-slate-950">
                      {row.month}
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-right tabular-nums text-slate-700">
                      {numberFormatter.format(row.kwhUsed)}
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-right tabular-nums text-slate-700">
                      {numberFormatter.format(row.totalCost)}
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-right tabular-nums text-slate-700">
                      {formatDiff(row.costDiffFromPreviousMonth)}
                    </td>
                  </tr>
                ))}
                <tr
                  className="bg-slate-100 font-semibold text-slate-950"
                  key={`${group.departmentGroup}-summary`}
                >
                  <td className="border border-slate-300 px-3 py-2 text-center">
                    TONG
                  </td>
                  <td className="border border-slate-300 px-3 py-2" />
                  <td className="border border-slate-300 px-3 py-2 text-right tabular-nums">
                    {numberFormatter.format(group.summary.totalKwhUsed)}
                  </td>
                  <td className="border border-slate-300 px-3 py-2 text-right tabular-nums">
                    {numberFormatter.format(group.summary.totalCost)}
                  </td>
                  <td className="border border-slate-300 px-3 py-2" />
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
