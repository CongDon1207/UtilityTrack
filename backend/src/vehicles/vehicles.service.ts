import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { CreateFuelRecordDto } from './dto/create-fuel-record.dto';
import { CreateVehicleKmRecordDto } from './dto/create-vehicle-km-record.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { FuelRecordsQueryDto } from './dto/fuel-records-query.dto';
import { UpdateFuelRecordDto } from './dto/update-fuel-record.dto';
import { UpdateVehicleKmRecordDto } from './dto/update-vehicle-km-record.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehiclesQueryDto } from './dto/vehicles-query.dto';
import { VehicleKmRecordsQueryDto } from './dto/vehicle-km-records-query.dto';
import { FuelRecordEntity } from './fuel-record.entity';
import { VehicleKmRecordEntity } from './vehicle-km-record.entity';
import { VehicleEntity } from './vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly vehiclesRepository: Repository<VehicleEntity>,
    @InjectRepository(VehicleKmRecordEntity)
    private readonly vehicleKmRecordsRepository: Repository<VehicleKmRecordEntity>,
    @InjectRepository(FuelRecordEntity)
    private readonly fuelRecordsRepository: Repository<FuelRecordEntity>,
  ) {}

  async findAll(query: VehiclesQueryDto) {
    const currentPage = query.page;
    const pageSize = query.limit;
    const skip = (currentPage - 1) * pageSize;

    const whereClause: FindOptionsWhere<VehicleEntity> = {};
    if (query.isActive !== undefined) {
      whereClause.isActive = query.isActive;
    }

    const [vehicles, total] = await this.vehiclesRepository.findAndCount({
      where: whereClause,
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
      where: { id: Number(id) },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with id ${id} not found`);
    }

    return vehicle;
  }

  create(data: CreateVehicleDto) {
    const newVehicle = this.vehiclesRepository.create({
      vehicleName: data.vehicleName,
      isActive: data.isActive !== undefined ? data.isActive : 1,
    });

    return this.vehiclesRepository.save(newVehicle);
  }

  async update(id: string, data: UpdateVehicleDto) {
    const vehicle = await this.findOne(id);

    Object.assign(vehicle, data);
    return this.vehiclesRepository.save(vehicle);
  }

  async remove(id: string) {
    await this.findOne(id);

    const vehicleId = Number(id);
    const [kmRecordCount, fuelRecordCount] = await Promise.all([
      this.vehicleKmRecordsRepository.count({ where: { vehicleId } }),
      this.fuelRecordsRepository.count({ where: { vehicleId } }),
    ]);

    if (kmRecordCount > 0 || fuelRecordCount > 0) {
      throw new BadRequestException(
        'Cannot delete a vehicle that has KM or fuel records. Deactivate it instead.',
      );
    }

    await this.vehiclesRepository.delete({ id: vehicleId });

    return { deleted: true };
  }

  async findAllKmRecords(query: VehicleKmRecordsQueryDto) {
    const currentPage = query.page;
    const pageSize = query.limit;
    const skip = (currentPage - 1) * pageSize;

    const whereClause: FindOptionsWhere<VehicleKmRecordEntity> = {};
    if (query.vehicleId) {
      whereClause.vehicleId = query.vehicleId;
    }
    if (query.year) {
      const start = new Date(
        Date.UTC(query.year, query.month ? query.month - 1 : 0, 1, 0, 0, 0, 0),
      );
      const end = query.month
        ? new Date(Date.UTC(query.year, query.month, 0, 23, 59, 59, 999))
        : new Date(Date.UTC(query.year, 11, 31, 23, 59, 59, 999));
      whereClause.tripDate = Between(start, end);
    }

    const [records, total] = await this.vehicleKmRecordsRepository.findAndCount(
      {
        relations: {
          vehicle: true,
        },
        where: whereClause,
        order: {
          tripDate: 'DESC',
          id: 'DESC',
        },
        skip,
        take: pageSize,
      },
    );

    // Tính toán summary cho tất cả bản ghi thỏa mãn bộ lọc
    const allMatchingRecords = await this.vehicleKmRecordsRepository.find({
      where: whereClause,
    });

    const totalKm = allMatchingRecords.reduce(
      (sum, r) =>
        sum +
        (Number(r.arrivalOdometer || 0) - Number(r.departureOdometer || 0)),
      0,
    );

    return {
      data: records,
      meta: {
        page: currentPage,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
      summary: {
        totalRecords: total,
        totalKm,
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
    const vehicle = await this.findOne(String(data.vehicleId));
    if (vehicle.isActive !== 1) {
      throw new BadRequestException('Selected vehicle is inactive');
    }
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

  async findAllFuelRecords(query: FuelRecordsQueryDto) {
    const currentPage = query.page;
    const pageSize = query.limit;
    const skip = (currentPage - 1) * pageSize;

    const whereClause: FindOptionsWhere<FuelRecordEntity> = {};
    if (query.vehicleId) {
      whereClause.vehicleId = query.vehicleId;
    }
    if (query.year) {
      const start = new Date(
        Date.UTC(query.year, query.month ? query.month - 1 : 0, 1, 0, 0, 0, 0),
      );
      const end = query.month
        ? new Date(Date.UTC(query.year, query.month, 0, 23, 59, 59, 999))
        : new Date(Date.UTC(query.year, 11, 31, 23, 59, 59, 999));
      whereClause.fuelDate = Between(start, end);
    }

    const [records, total] = await this.fuelRecordsRepository.findAndCount({
      relations: {
        vehicle: true,
      },
      where: whereClause,
      order: {
        fuelDate: 'DESC',
        id: 'DESC',
      },
      skip,
      take: pageSize,
    });

    // Tính toán summary cho tất cả bản ghi thỏa mãn bộ lọc
    const allMatchingRecords = await this.fuelRecordsRepository.find({
      where: whereClause,
    });

    const totalLiters = allMatchingRecords.reduce(
      (sum, r) => sum + Number(r.liters || 0),
      0,
    );
    const totalCost = allMatchingRecords.reduce(
      (sum, r) => sum + Number(r.unitPrice || 0) * Number(r.liters || 0),
      0,
    );
    const avgUnitPrice = totalLiters > 0 ? totalCost / totalLiters : 0;

    return {
      data: records,
      meta: {
        page: currentPage,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
      summary: {
        totalRecords: total,
        totalLiters,
        totalCost,
        avgUnitPrice,
      },
    };
  }

  async findOneFuelRecord(id: string) {
    const record = await this.fuelRecordsRepository.findOne({
      relations: {
        vehicle: true,
      },
      where: { id: Number(id) },
    });

    if (!record) {
      throw new NotFoundException(`Fuel record with id ${id} not found`);
    }

    return record;
  }

  async createFuelRecord(data: CreateFuelRecordDto) {
    const vehicle = await this.findOne(String(data.vehicleId));
    if (vehicle.isActive !== 1) {
      throw new BadRequestException('Selected vehicle is inactive');
    }

    const newRecord = this.fuelRecordsRepository.create({
      ...data,
      fuelDate: new Date(data.fuelDate),
    });

    return this.fuelRecordsRepository.save(newRecord);
  }

  async updateFuelRecord(id: string, data: UpdateFuelRecordDto) {
    const record = await this.findOneFuelRecord(id);

    if (data.vehicleId) {
      await this.findOne(String(data.vehicleId));
    }

    Object.assign(record, {
      ...data,
      ...(data.fuelDate ? { fuelDate: new Date(data.fuelDate) } : {}),
    });

    return this.fuelRecordsRepository.save(record);
  }

  async removeFuelRecord(id: string) {
    const result = await this.fuelRecordsRepository.delete({
      id: Number(id),
    });

    if (!result.affected) {
      throw new NotFoundException(`Fuel record with id ${id} not found`);
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
