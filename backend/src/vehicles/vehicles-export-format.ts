import ExcelJS from 'exceljs';

export function setupWorksheet(worksheet: ExcelJS.Worksheet, widths: number[]) {
  worksheet.views = [{ state: 'frozen', ySplit: 5 }];
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
  worksheet.columns = widths.map((width) => ({ width }));
}

export function writeTitle(
  worksheet: ExcelJS.Worksheet,
  title: string,
  subtitle: string,
  lastColumn: number,
) {
  worksheet.mergeCells(1, 1, 1, lastColumn);
  worksheet.mergeCells(2, 1, 2, lastColumn);

  const titleCell = worksheet.getCell(1, 1);
  titleCell.value = title;
  titleCell.font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  titleCell.fill = solidFill('FF0F172A');

  const subtitleCell = worksheet.getCell(2, 1);
  subtitleCell.value = subtitle;
  subtitleCell.font = { italic: true, color: { argb: 'FF334155' } };
  subtitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  subtitleCell.fill = solidFill('FFE2E8F0');

  worksheet.getRow(1).height = 30;
  worksheet.getRow(2).height = 24;
}

export function writeSummaryRow(
  worksheet: ExcelJS.Worksheet,
  values: string[],
) {
  const row = worksheet.addRow(values);
  row.height = 26;
  row.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FF0F766E' } };
    cell.fill = solidFill('FFCCFBF1');
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    applyBorder(cell, 'FF5EEAD4');
  });
  worksheet.addRow([]);
}

export function writeHeader(worksheet: ExcelJS.Worksheet, labels: string[]) {
  const row = worksheet.addRow(labels);
  row.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  row.height = 32;
  row.eachCell((cell) => {
    cell.alignment = {
      horizontal: 'center',
      vertical: 'middle',
      wrapText: true,
    };
    cell.fill = solidFill('FF0F766E');
    applyBorder(cell, 'FF99F6E4');
  });
}

export function formatDataRow(row: ExcelJS.Row, wrapColumns: number[]) {
  const fill = row.number % 2 === 0 ? 'FFF8FAFC' : 'FFFFFFFF';
  row.height = 24;
  row.eachCell({ includeEmpty: true }, (cell, columnNumber) => {
    cell.alignment = {
      horizontal: wrapColumns.includes(columnNumber) ? 'left' : 'center',
      vertical: 'middle',
      wrapText: wrapColumns.includes(columnNumber),
    };
    cell.fill = solidFill(fill);
    applyBorder(cell, 'FFE2E8F0');
  });
}

export function writeEmptyState(
  worksheet: ExcelJS.Worksheet,
  recordCount: number,
  lastColumn: number,
) {
  if (recordCount > 0) return;

  const row = worksheet.addRow(['Không có dữ liệu theo bộ lọc hiện tại.']);
  worksheet.mergeCells(row.number, 1, row.number, lastColumn);
  const cell = worksheet.getCell(row.number, 1);
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
  cell.font = { italic: true, color: { argb: 'FF64748B' } };
  applyBorder(cell, 'FFE2E8F0');
}

function solidFill(argb: string): ExcelJS.Fill {
  return { type: 'pattern', pattern: 'solid', fgColor: { argb } };
}

function applyBorder(cell: ExcelJS.Cell, color = 'FFCBD5E1') {
  cell.border = {
    top: { style: 'thin', color: { argb: color } },
    left: { style: 'thin', color: { argb: color } },
    bottom: { style: 'thin', color: { argb: color } },
    right: { style: 'thin', color: { argb: color } },
  };
}
