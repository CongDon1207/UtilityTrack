import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ExcelJS from 'exceljs';
import { Between, FindOptionsWhere, Raw, Repository } from 'typeorm';
import { FuelRecordsQueryDto } from './dto/fuel-records-query.dto';
import { VehicleKmRecordsQueryDto } from './dto/vehicle-km-records-query.dto';
import { FuelRecordEntity } from './fuel-record.entity';
import { VehicleKmRecordEntity } from './vehicle-km-record.entity';
import {
  formatDataRow,
  setupWorksheet,
  writeEmptyState,
  writeHeader,
  writeSummaryRow,
  writeTitle,
} from './vehicles-export-format';

type ExportedVehicleReport = {
  buffer: Buffer;
  filename: string;
};

@Injectable()
export class VehiclesExportService {
  constructor(
    @InjectRepository(VehicleKmRecordEntity)
    private readonly kmRecordsRepository: Repository<VehicleKmRecordEntity>,
    @InjectRepository(FuelRecordEntity)
    private readonly fuelRecordsRepository: Repository<FuelRecordEntity>,
  ) {}

  async exportKmRecords(
    query: VehicleKmRecordsQueryDto,
  ): Promise<ExportedVehicleReport> {
    const records = await this.kmRecordsRepository.find({
      relations: { vehicle: true },
      where: this.buildKmWhere(query),
      order: { tripDate: 'ASC', id: 'ASC' },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Nhật ký KM');
    workbook.creator = 'UtilityTrack';
    workbook.created = new Date();

    setupWorksheet(worksheet, [14, 18, 18, 34, 12, 16, 12, 16, 14, 14, 32]);
    writeTitle(worksheet, 'NHẬT KÝ KM XE', this.buildSubtitle(query), 11);
    this.writeKmSummary(worksheet, records);
    writeHeader(worksheet, [
      'Ngày',
      'Xe',
      'Tài xế',
      'Nội dung',
      'Giờ ra',
      'CSDH ra',
      'Giờ vào',
      'CSDH vào',
      'KM',
      'Trạng thái',
      'Ghi chú',
    ]);

    for (const record of records) {
      const distance = this.getCompletedDistance(record);
      const row = worksheet.addRow([
        record.tripDate,
        record.vehicle.vehicleName,
        record.driverName || null,
        record.tripPurpose || null,
        record.departureTime || null,
        record.departureOdometer,
        record.arrivalTime || null,
        record.arrivalOdometer ?? null,
        distance,
        distance === null ? 'Chưa vào' : 'Hoàn tất',
        record.note || null,
      ]);

      formatDataRow(row, [4, 11]);
      this.formatKmNumbers(row);
    }

    writeEmptyState(worksheet, records.length, 11);

    const buffer = Buffer.from(await workbook.xlsx.writeBuffer());
    return { buffer, filename: this.buildFilename('vehicle-km-records', query) };
  }

  async exportFuelRecords(
    query: FuelRecordsQueryDto,
  ): Promise<ExportedVehicleReport> {
    const records = await this.fuelRecordsRepository.find({
      relations: { vehicle: true },
      where: this.buildFuelWhere(query),
      order: { fuelDate: 'ASC', id: 'ASC' },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Đổ xăng dầu');
    workbook.creator = 'UtilityTrack';
    workbook.created = new Date();

    setupWorksheet(worksheet, [14, 20, 16, 14, 18, 40]);
    writeTitle(worksheet, 'NHẬT KÝ ĐỔ XĂNG DẦU', this.buildSubtitle(query), 6);
    this.writeFuelSummary(worksheet, records);
    writeHeader(worksheet, [
      'Ngày',
      'Xe',
      'Đơn giá',
      'Số lít',
      'Số tiền',
      'Ghi chú',
    ]);

    for (const record of records) {
      const row = worksheet.addRow([
        record.fuelDate,
        record.vehicle.vehicleName,
        record.unitPrice,
        record.liters,
        Number(record.unitPrice || 0) * Number(record.liters || 0),
        record.note || null,
      ]);

      formatDataRow(row, [6]);
      this.formatFuelNumbers(row);
    }

    writeEmptyState(worksheet, records.length, 6);

    const buffer = Buffer.from(await workbook.xlsx.writeBuffer());
    return { buffer, filename: this.buildFilename('fuel-records', query) };
  }

  private writeKmSummary(
    worksheet: ExcelJS.Worksheet,
    records: VehicleKmRecordEntity[],
  ) {
    const totalKm = records.reduce(
      (sum, record) => sum + (this.getCompletedDistance(record) ?? 0),
      0,
    );
    const completed = records.filter(
      (record) => this.getCompletedDistance(record) !== null,
    ).length;

    writeSummaryRow(worksheet, [
      `Tổng lượt: ${records.length}`,
      `Hoàn tất: ${completed}`,
      `Chưa vào: ${records.length - completed}`,
      `Tổng KM: ${totalKm.toLocaleString('vi-VN')}`,
    ]);
  }

  private writeFuelSummary(
    worksheet: ExcelJS.Worksheet,
    records: FuelRecordEntity[],
  ) {
    const totalLiters = records.reduce((sum, r) => sum + Number(r.liters || 0), 0);
    const totalCost = records.reduce(
      (sum, r) => sum + Number(r.unitPrice || 0) * Number(r.liters || 0),
      0,
    );
    const avgUnitPrice = totalLiters > 0 ? totalCost / totalLiters : 0;

    writeSummaryRow(worksheet, [
      `Tổng hóa đơn: ${records.length}`,
      `Tổng lít: ${totalLiters.toLocaleString('vi-VN')}`,
      `Tổng tiền: ${totalCost.toLocaleString('vi-VN')}`,
      `Đơn giá TB: ${avgUnitPrice.toLocaleString('vi-VN')}`,
    ]);
  }

  private formatKmNumbers(row: ExcelJS.Row) {
    row.getCell(1).numFmt = 'dd/mm/yyyy';
    row.getCell(6).numFmt = '#,##0';
    row.getCell(8).numFmt = '#,##0';
    row.getCell(9).numFmt = '#,##0';
  }

  private formatFuelNumbers(row: ExcelJS.Row) {
    row.getCell(1).numFmt = 'dd/mm/yyyy';
    row.getCell(3).numFmt = '#,##0';
    row.getCell(4).numFmt = '#,##0.##';
    row.getCell(5).numFmt = '#,##0';
  }

  private buildKmWhere(query: VehicleKmRecordsQueryDto) {
    const where: FindOptionsWhere<VehicleKmRecordEntity> = {};
    if (query.vehicleId) where.vehicleId = query.vehicleId;
    if (query.year || query.month) {
      where.tripDate = this.buildDateFilter(query.year, query.month);
    }
    return where;
  }

  private buildFuelWhere(query: FuelRecordsQueryDto) {
    const where: FindOptionsWhere<FuelRecordEntity> = {};
    if (query.vehicleId) where.vehicleId = query.vehicleId;
    if (query.year || query.month) {
      where.fuelDate = this.buildDateFilter(query.year, query.month);
    }
    return where;
  }

  private buildDateFilter(year?: number, month?: number) {
    if (year) {
      const start = new Date(
        Date.UTC(year, month ? month - 1 : 0, 1, 0, 0, 0, 0),
      );
      const end = month
        ? new Date(Date.UTC(year, month, 0, 23, 59, 59, 999))
        : new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

      return Between(start, end);
    }

    return Raw((alias) => `EXTRACT(MONTH FROM ${alias}) = :month`, {
      month,
    });
  }

  private getCompletedDistance(record: VehicleKmRecordEntity) {
    if (record.arrivalOdometer === null || record.arrivalOdometer === undefined) {
      return null;
    }

    return Number(record.arrivalOdometer) - Number(record.departureOdometer);
  }

  private buildSubtitle(query: { year?: number; month?: number; vehicleId?: number }) {
    const period = query.year
      ? query.month
        ? `Tháng ${query.month} / ${query.year}`
        : `Năm ${query.year}`
      : 'Tất cả thời gian';
    return query.vehicleId ? `${period} - Xe #${query.vehicleId}` : period;
  }

  private buildFilename(prefix: string, query: { year?: number; month?: number }) {
    const yearPart = query.year ? `-${query.year}` : '';
    const monthPart = query.month ? `-${query.month}` : '';
    return `${prefix}${yearPart}${monthPart}.xlsx`;
  }
}
