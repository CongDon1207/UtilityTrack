import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationEntity } from './location.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(LocationEntity)
    private readonly locationsRepository: Repository<LocationEntity>,
  ) {}

  async findAll(query: PaginationQueryDto) {
    const currentPage = query.page;
    const pageSize = query.limit;
    const skip = (currentPage - 1) * pageSize;

    const [locations, total] = await this.locationsRepository.findAndCount({
      order: { id: 'ASC' },
      skip,
      take: pageSize,
    });

    return {
      data: locations,
      meta: {
        page: currentPage,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async findOne(id: string) {
    const location = await this.locationsRepository.findOne({
      where: { id: Number(id) },
    });

    if (!location) {
      throw new NotFoundException(`Location with id ${id} not found`);
    }
    return location;
  }

  create(data: CreateLocationDto) {
    const newLocation = this.locationsRepository.create({
      name: data.name,
      code: data.code,
      type: data.type,
      address: data.address,
      isActive: 1,
    });
    return this.locationsRepository.save(newLocation);
  }

  async update(id: string, data: UpdateLocationDto) {
    const location = await this.findOne(id);

    Object.assign(location, data);
    return this.locationsRepository.save(location);
  }

  async remove(id: string) {
    const result = await this.locationsRepository.update(
      { id: Number(id) },
      { isActive: 0 },
    );

    if (!result.affected) {
      throw new NotFoundException(`Location with id ${id} not found`);
    }

    return { deleted: true };
  }
}
