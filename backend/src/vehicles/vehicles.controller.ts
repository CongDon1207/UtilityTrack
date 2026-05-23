import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateVehicleKmRecordDto } from './dto/create-vehicle-km-record.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleKmRecordDto } from './dto/update-vehicle-km-record.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleKmRecordsQueryDto } from './dto/vehicle-km-records-query.dto';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.vehiclesService.findAll(query);
  }

  @Get('km-records')
  findAllKmRecords(@Query() query: VehicleKmRecordsQueryDto) {
    return this.vehiclesService.findAllKmRecords(query);
  }

  @Get('km-records/:id')
  findOneKmRecord(@Param('id') id: string) {
    return this.vehiclesService.findOneKmRecord(id);
  }

  @Post('km-records')
  createKmRecord(@Body() body: CreateVehicleKmRecordDto) {
    return this.vehiclesService.createKmRecord(body);
  }

  @Patch('km-records/:id')
  updateKmRecord(
    @Param('id') id: string,
    @Body() body: UpdateVehicleKmRecordDto,
  ) {
    return this.vehiclesService.updateKmRecord(id, body);
  }

  @Delete('km-records/:id')
  removeKmRecord(@Param('id') id: string) {
    return this.vehiclesService.removeKmRecord(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateVehicleDto) {
    return this.vehiclesService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateVehicleDto) {
    return this.vehiclesService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(id);
  }
}
