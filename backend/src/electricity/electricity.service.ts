import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateElectricityRecordDto } from './dto/create-electricity-record.dto';
import { UpdateElectricityRecordDto } from './dto/update-electricity-record.dto';
import { ElectricityRecordEntity } from './electricity-record.entity';

@Injectable()
export class ElectricityService {
  constructor(
    @InjectRepository(ElectricityRecordEntity)
    private readonly electricityRecordsRepository: Repository<ElectricityRecordEntity>,
  ) {}

  async findAll(query: PaginationQueryDto) {
    const currentPage = query.page;
    const pageSize = query.limit;
    const skip = (currentPage - 1) * pageSize;

    const [records, total] =
      await this.electricityRecordsRepository.findAndCount({
        order: {
          recordYear: 'DESC',
          recordMonth: 'DESC',
          id: 'DESC',
        },
        skip,
        take: pageSize,
      });

    return {
      data: records,
      meta: {
        page: currentPage,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async findOne(id: string) {
    const record = await this.electricityRecordsRepository.findOne({
      where: { id: Number(id) },
    });

    if (!record) {
      throw new NotFoundException(`Electricity record with id ${id} not found`);
    }

    return record;
  }

  create(data: CreateElectricityRecordDto) {
    const newRecord = this.electricityRecordsRepository.create(data);
    return this.electricityRecordsRepository.save(newRecord);
  }

  async update(id: string, data: UpdateElectricityRecordDto) {
    const record = await this.findOne(id);

    Object.assign(record, data);
    return this.electricityRecordsRepository.save(record);
  }

  async remove(id: string) {
    const result = await this.electricityRecordsRepository.delete({
      id: Number(id),
    });

    if (!result.affected) {
      throw new NotFoundException(`Electricity record with id ${id} not found`);
    }

    return { deleted: true };
  }
}
