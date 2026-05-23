import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateVehicleKmRecordDto } from './dto/create-vehicle-km-record.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleKmRecordDto } from './dto/update-vehicle-km-record.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleKmRecordsQueryDto } from './dto/vehicle-km-records-query.dto';
import { VehicleKmRecordEntity } from './vehicle-km-record.entity';
import { VehicleEntity } from './vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly vehiclesRepository: Repository<VehicleEntity>,
    @InjectRepository(VehicleKmRecordEntity)
    private readonly vehicleKmRecordsRepository: Repository<VehicleKmRecordEntity>,
  ) {}

  async findAll(query: PaginationQueryDto) {
    const currentPage = query.page;
    const pageSize = query.limit;
    const skip = (currentPage - 1) * pageSize;

    const [vehicles, total] = await this.vehiclesRepository.findAndCount({
      where: { isActive: 1 },
      order: {
        vehicleName: 'ASC',
        id: 'ASC',
      },
      skip,
      take: pageSize,
    });

    return {
      data: vehicles,
      meta: {
        page: currentPage,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async findOne(id: string) {
    const vehicle = await this.vehiclesRepository.findOne({
      where: { id: Number(id), isActive: 1 },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with id ${id} not found`);
    }

    return vehicle;
  }

  create(data: CreateVehicleDto) {
    const newVehicle = this.vehiclesRepository.create({
      ...data,
      isActive: 1,
    });

    return this.vehiclesRepository.save(newVehicle);
  }

  async update(id: string, data: UpdateVehicleDto) {
    const vehicle = await this.findOne(id);

    Object.assign(vehicle, data);
    return this.vehiclesRepository.save(vehicle);
  }

  async remove(id: string) {
    const vehicle = await this.findOne(id);

    vehicle.isActive = 0;
    await this.vehiclesRepository.save(vehicle);

    return { deleted: true };
  }

  async findAllKmRecords(query: VehicleKmRecordsQueryDto) {
    const currentPage = query.page;
    const pageSize = query.limit;
    const skip = (currentPage - 1) * pageSize;

    const [records, total] = await this.vehicleKmRecordsRepository.findAndCount(
      {
        relations: {
          vehicle: true,
        },
        where: query.vehicleId ? { vehicleId: query.vehicleId } : {},
        order: {
          tripDate: 'DESC',
          id: 'DESC',
        },
        skip,
        take: pageSize,
      },
    );

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

  async findOneKmRecord(id: string) {
    const record = await this.vehicleKmRecordsRepository.findOne({
      relations: {
        vehicle: true,
      },
      where: { id: Number(id) },
    });

    if (!record) {
      throw new NotFoundException(`Vehicle KM record with id ${id} not found`);
    }

    return record;
  }

  async createKmRecord(data: CreateVehicleKmRecordDto) {
    await this.findOne(String(data.vehicleId));
    this.validateOdometerOrder(data.departureOdometer, data.arrivalOdometer);

    const newRecord = this.vehicleKmRecordsRepository.create({
      ...data,
      tripDate: new Date(data.tripDate),
    });

    return this.vehicleKmRecordsRepository.save(newRecord);
  }

  async updateKmRecord(id: string, data: UpdateVehicleKmRecordDto) {
    const record = await this.findOneKmRecord(id);

    if (data.vehicleId) {
      await this.findOne(String(data.vehicleId));
    }

    this.validateOdometerOrder(
      data.departureOdometer ?? record.departureOdometer,
      data.arrivalOdometer ?? record.arrivalOdometer,
    );

    Object.assign(record, {
      ...data,
      ...(data.tripDate ? { tripDate: new Date(data.tripDate) } : {}),
    });

    return this.vehicleKmRecordsRepository.save(record);
  }

  async removeKmRecord(id: string) {
    const result = await this.vehicleKmRecordsRepository.delete({
      id: Number(id),
    });

    if (!result.affected) {
      throw new NotFoundException(`Vehicle KM record with id ${id} not found`);
    }

    return { deleted: true };
  }

  private validateOdometerOrder(
    departureOdometer: number,
    arrivalOdometer: number,
  ) {
    if (arrivalOdometer < departureOdometer) {
      throw new BadRequestException(
        'Arrival odometer must be greater than or equal to departure odometer',
      );
    }
  }
}
