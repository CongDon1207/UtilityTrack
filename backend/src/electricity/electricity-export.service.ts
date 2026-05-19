import { Injectable } from '@nestjs/common';
import ExcelJS from 'exceljs';
import { ElectricityReportQueryDto } from './dto/electricity-report-query.dto';
import { ElectricityReportService } from './electricity-report.service';
import type {
  ElectricityReportGroup,
  ElectricityReportResponse,
} from './types/electricity-report';

type ExportedElectricityReport = {
  buffer: Buffer;
  filename: string;
};

const departmentGroupLabels: Record<string, string> = {
  MAY_MAY_DIEN_TU_VAN_PHONG_NHA_BEP_KHO:
    '(MAY, MAY DIEN TU, VAN PHONG, NHA BEP, KHO)',
  CAT_CHUAN_BI_UV_TECH_CU: '(CAT, CHUAN BI, UV, TECH CU)',
  LASTING: 'LASTING',
  PHONG_TECH_MOI: 'PHONG TECH MOI',
};

@Injectable()
export class ElectricityExportService {
  constructor(
    private readonly electricityReportService: ElectricityReportService,
  ) {}

  async exportReport(
    query: ElectricityReportQueryDto,
  ): Promise<ExportedElectricityReport> {
    const report = await this.electricityReportService.getReport(query);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Electricity Report');

    this.setupColumns(worksheet);
    this.writeTitle(worksheet, report);
    this.writeHeader(worksheet);
    this.writeGroups(worksheet, report.groups);

    const buffer = Buffer.from(await workbook.xlsx.writeBuffer());

    return {
      buffer,
      filename: this.buildFilename(query),
    };
  }

  private setupColumns(worksheet: ExcelJS.Worksheet) {
    worksheet.columns = [
      { key: 'departmentGroup', width: 24 },
      { key: 'month', width: 10 },
      { key: 'kwhUsed', width: 18 },
      { key: 'totalCost', width: 18 },
      { key: 'costDiffFromPreviousMonth', width: 26 },
    ];
  }

  private writeTitle(
    worksheet: ExcelJS.Worksheet,
    report: ElectricityReportResponse,
  ) {
    worksheet.mergeCells('A1:E1');
    const titleCell = worksheet.getCell('A1');

    titleCell.value = `BANG CHI TIET SU DUNG DIEN CUA CAC BO PHAN TRONG NAM ${report.year}`;
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(1).height = 24;
  }

  private writeHeader(worksheet: ExcelJS.Worksheet) {
    const headerRow = worksheet.addRow([
      'BO PHAN',
      'THANG',
      'SO DIEN SU DUNG (KW)',
      'SO TIEN',
      'CHENH LECH SO VOI THANG TRUOC',
    ]);

    headerRow.font = { bold: true };
    headerRow.height = 36;
    headerRow.eachCell((cell) => {
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true,
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9E2F3' },
      };
      this.applyBorder(cell);
    });
  }

  private writeGroups(
    worksheet: ExcelJS.Worksheet,
    groups: ElectricityReportGroup[],
  ) {
    for (const group of groups) {
      const startRow = worksheet.rowCount + 1;

      for (const row of group.rows) {
        const dataRow = worksheet.addRow([
          null,
          row.month,
          row.kwhUsed,
          row.totalCost,
          row.costDiffFromPreviousMonth,
        ]);

        this.formatDataRow(dataRow);
      }

      const endRow = worksheet.rowCount;

      if (endRow >= startRow) {
        worksheet.mergeCells(startRow, 1, endRow, 1);
        const groupCell = worksheet.getCell(startRow, 1);

        groupCell.value =
          departmentGroupLabels[group.departmentGroup] ?? group.departmentGroup;
        groupCell.font = { bold: true };
        groupCell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
          wrapText: true,
        };
        groupCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE7E6E6' },
        };
        this.applyBorder(groupCell);
      }

      const totalRow = worksheet.addRow([
        'TONG',
        null,
        group.summary.totalKwhUsed,
        group.summary.totalCost,
        null,
      ]);

      this.formatTotalRow(totalRow);
    }
  }

  private formatDataRow(row: ExcelJS.Row) {
    row.eachCell((cell, columnNumber) => {
      cell.alignment = {
        horizontal: columnNumber === 2 ? 'center' : 'right',
        vertical: 'middle',
      };
      this.applyBorder(cell);
    });

    row.getCell(3).numFmt = '#,##0.##';
    row.getCell(4).numFmt = '#,##0';
    row.getCell(5).numFmt = '#,##0';
  }

  private formatTotalRow(row: ExcelJS.Row) {
    row.font = { bold: true };
    row.eachCell((cell, columnNumber) => {
      cell.alignment = {
        horizontal: columnNumber <= 2 ? 'center' : 'right',
        vertical: 'middle',
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF2F2F2' },
      };
      this.applyBorder(cell);
    });

    row.getCell(3).numFmt = '#,##0.##';
    row.getCell(4).numFmt = '#,##0';
  }

  private applyBorder(cell: ExcelJS.Cell) {
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  }

  private buildFilename(query: ElectricityReportQueryDto) {
    const monthPart = query.month ? `-${query.month}` : '';

    return `electricity-report-${query.year}${monthPart}.xlsx`;
  }
}
