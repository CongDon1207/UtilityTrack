import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ElectricityReportQueryDto } from './dto/electricity-report-query.dto';
import { ElectricityRecordEntity } from './electricity-record.entity';
import type {
  ElectricityReportGroup,
  ElectricityReportResponse,
  ElectricityReportRow,
} from './types/electricity-report';

@Injectable()
export class ElectricityReportService {
  constructor(
    @InjectRepository(ElectricityRecordEntity)
    private readonly electricityRecordsRepository: Repository<ElectricityRecordEntity>,
  ) {}

  async getReport(
    query: ElectricityReportQueryDto,
  ): Promise<ElectricityReportResponse> {
    const records = await this.electricityRecordsRepository.find({
      where: {
        recordYear: query.year,
        ...(query.month ? { recordMonth: query.month } : {}),
      },
      order: {
        departmentGroup: 'ASC',
        recordMonth: 'ASC',
      },
    });

    const groupsByDepartment = new Map<string, ElectricityRecordEntity[]>();

    for (const record of records) {
      const groupRecords =
        groupsByDepartment.get(record.departmentGroup) ?? [];

      groupRecords.push(record);
      groupsByDepartment.set(record.departmentGroup, groupRecords);
    }

    const groups: ElectricityReportGroup[] = Array.from(
      groupsByDepartment.entries(),
    ).map(([departmentGroup, groupRecords]) => {
      const rows = this.buildRows(groupRecords);

      return {
        departmentGroup,
        rows,
        summary: {
          totalKwhUsed: rows.reduce((total, row) => total + row.kwhUsed, 0),
          totalCost: rows.reduce((total, row) => total + row.totalCost, 0),
        },
      };
    });

    return {
      year: query.year,
      ...(query.month ? { month: query.month } : {}),
      groups,
    };
  }

  private buildRows(
    records: ElectricityRecordEntity[],
  ): ElectricityReportRow[] {
    return records.map((record, index) => {
      const previousRecord = records[index - 1];

      return {
        month: record.recordMonth,
        kwhUsed: record.kwhUsed,
        totalCost: record.totalCost,
        costDiffFromPreviousMonth: previousRecord
          ? record.totalCost - previousRecord.totalCost
          : null,
      };
    });
  }
}
