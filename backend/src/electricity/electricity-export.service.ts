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

type DepartmentStyle = {
  label: string;
  fill: string;
  font: string;
  border: string;
};

const departmentGroupStyles: Record<string, DepartmentStyle> = {
  MAY_MAY_DIEN_TU_VAN_PHONG_NHA_BEP_KHO: {
    label: 'May, máy điện tử, văn phòng, nhà bếp, kho',
    fill: 'FFE0F2FE',
    font: 'FF075985',
    border: 'FF7DD3FC',
  },
  CAT_CHUAN_BI_UV_TECH_CU: {
    label: 'Cắt, chuẩn bị, UV, tech cũ',
    fill: 'FFDCFCE7',
    font: 'FF166534',
    border: 'FF86EFAC',
  },
  LASTING: {
    label: 'Lasting',
    fill: 'FFFEF3C7',
    font: 'FF92400E',
    border: 'FFFCD34D',
  },
  PHONG_TECH_MOI: {
    label: 'Phòng tech mới',
    fill: 'FFF3E8FF',
    font: 'FF6B21A8',
    border: 'FFD8B4FE',
  },
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
    const worksheet = workbook.addWorksheet('Báo cáo điện');

    workbook.creator = 'UtilityTrack';
    workbook.created = new Date();

    this.setupWorksheet(worksheet);
    this.writeTitle(worksheet, report);
    this.writeHeader(worksheet);
    this.writeGroups(worksheet, report.groups);

    const buffer = Buffer.from(await workbook.xlsx.writeBuffer());

    return {
      buffer,
      filename: this.buildFilename(query),
    };
  }

  private setupWorksheet(worksheet: ExcelJS.Worksheet) {
    worksheet.views = [{ state: 'frozen', ySplit: 4 }];
    worksheet.properties.defaultRowHeight = 22;
    worksheet.pageSetup = {
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      paperSize: 9,
      margins: {
        left: 0.4,
        right: 0.4,
        top: 0.5,
        bottom: 0.5,
        header: 0.2,
        footer: 0.2,
      },
    };
    worksheet.columns = [
      { key: 'departmentGroup', width: 30 },
      { key: 'month', width: 10 },
      { key: 'kwhUsed', width: 20 },
      { key: 'totalCost', width: 22 },
      { key: 'costDiffFromPreviousMonth', width: 30 },
      { key: 'note', width: 34 },
    ];
  }

  private writeTitle(
    worksheet: ExcelJS.Worksheet,
    report: ElectricityReportResponse,
  ) {
    worksheet.mergeCells('A1:F1');
    worksheet.mergeCells('A2:F2');

    const titleCell = worksheet.getCell('A1');
    titleCell.value = `BẢNG CHI TIẾT SỬ DỤNG ĐIỆN CỦA CÁC BỘ PHẬN TRONG NĂM ${report.year}`;
    titleCell.font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.fill = this.solidFill('FF075985');

    const subtitleCell = worksheet.getCell('A2');
    subtitleCell.value = report.month
      ? `Tháng ${report.month} / ${report.year}`
      : `Tất cả các tháng trong năm ${report.year}`;
    subtitleCell.font = { italic: true, color: { argb: 'FF475569' } };
    subtitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    subtitleCell.fill = this.solidFill('FFE0F2FE');

    worksheet.getRow(1).height = 30;
    worksheet.getRow(2).height = 24;
    worksheet.addRow([]);
  }

  private writeHeader(worksheet: ExcelJS.Worksheet) {
    const headerRow = worksheet.addRow([
      'BỘ PHẬN',
      'THÁNG',
      'SỐ ĐIỆN SỬ DỤNG (KW)',
      'SỐ TIỀN',
      'CHÊNH LỆCH SO VỚI THÁNG TRƯỚC',
      'GHI CHÚ',
    ]);

    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.height = 38;
    headerRow.eachCell((cell) => {
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true,
      };
      cell.fill = this.solidFill('FF0F766E');
      this.applyBorder(cell, 'FF99F6E4');
    });
  }

  private writeGroups(
    worksheet: ExcelJS.Worksheet,
    groups: ElectricityReportGroup[],
  ) {
    for (const group of groups) {
      const startRow = worksheet.rowCount + 1;
      const style = this.getDepartmentStyle(group.departmentGroup);

      for (const row of group.rows) {
        const dataRow = worksheet.addRow([
          null,
          row.month,
          row.kwhUsed,
          row.totalCost,
          row.costDiffFromPreviousMonth,
          row.note || null,
        ]);

        this.formatDataRow(dataRow);
      }

      const endRow = worksheet.rowCount;

      if (endRow >= startRow) {
        worksheet.mergeCells(startRow, 1, endRow, 1);
        const groupCell = worksheet.getCell(startRow, 1);

        groupCell.value = style.label;
        groupCell.font = { bold: true, color: { argb: style.font } };
        groupCell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
          wrapText: true,
        };
        groupCell.fill = this.solidFill(style.fill);
        this.applyBorder(groupCell, style.border);
      }

      const totalRow = worksheet.addRow([
        'TỔNG',
        null,
        group.summary.totalKwhUsed,
        group.summary.totalCost,
        null,
        null,
      ]);

      this.formatTotalRow(totalRow);
    }
  }

  private formatDataRow(row: ExcelJS.Row) {
    const isEvenRow = row.number % 2 === 0;

    row.height = 24;
    row.eachCell({ includeEmpty: true }, (cell, columnNumber) => {
      cell.alignment = {
        horizontal: this.getDataCellAlignment(columnNumber),
        vertical: 'middle',
        wrapText: columnNumber === 6,
      };
      cell.fill = this.solidFill(isEvenRow ? 'FFF8FAFC' : 'FFFFFFFF');
      this.applyBorder(cell, 'FFE2E8F0');
    });

    row.getCell(2).font = { bold: true, color: { argb: 'FF0F172A' } };
    row.getCell(3).numFmt = '#,##0.##';
    row.getCell(4).numFmt = '#,##0';
    row.getCell(5).numFmt = '#,##0';
  }

  private formatTotalRow(row: ExcelJS.Row) {
    row.font = { bold: true, color: { argb: 'FF0F172A' } };
    row.height = 26;
    row.eachCell({ includeEmpty: true }, (cell, columnNumber) => {
      cell.alignment = {
        horizontal: columnNumber <= 2 ? 'center' : 'right',
        vertical: 'middle',
      };
      cell.fill = this.solidFill('FFCCFBF1');
      this.applyBorder(cell, 'FF5EEAD4');
    });

    row.getCell(3).numFmt = '#,##0.##';
    row.getCell(4).numFmt = '#,##0';
  }

  private getDataCellAlignment(columnNumber: number) {
    if (columnNumber === 2) {
      return 'center';
    }

    if (columnNumber === 6) {
      return 'left';
    }

    return 'right';
  }

  private getDepartmentStyle(departmentGroup: string) {
    return (
      departmentGroupStyles[departmentGroup] ?? {
        label: departmentGroup,
        fill: 'FFE2E8F0',
        font: 'FF334155',
        border: 'FFCBD5E1',
      }
    );
  }

  private solidFill(argb: string): ExcelJS.Fill {
    return {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb },
    };
  }

  private applyBorder(cell: ExcelJS.Cell, color = 'FFCBD5E1') {
    cell.border = {
      top: { style: 'thin', color: { argb: color } },
      left: { style: 'thin', color: { argb: color } },
      bottom: { style: 'thin', color: { argb: color } },
      right: { style: 'thin', color: { argb: color } },
    };
  }

  private buildFilename(query: ElectricityReportQueryDto) {
    const monthPart = query.month ? `-${query.month}` : '';

    return `electricity-report-${query.year}${monthPart}.xlsx`;
  }
}
