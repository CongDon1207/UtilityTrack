import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common';
import type { Response } from 'express';
import { VehiclesQueryDto } from './dto/vehicles-query.dto';
import { CreateFuelRecordDto } from './dto/create-fuel-record.dto';
import { CreateVehicleKmRecordDto } from './dto/create-vehicle-km-record.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { FuelRecordsQueryDto } from './dto/fuel-records-query.dto';
import { UpdateFuelRecordDto } from './dto/update-fuel-record.dto';
import { UpdateVehicleKmRecordDto } from './dto/update-vehicle-km-record.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleKmRecordsQueryDto } from './dto/vehicle-km-records-query.dto';
import { VehiclesExportService } from './vehicles-export.service';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
export class VehiclesController {
  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly vehiclesExportService: VehiclesExportService,
  ) {}

  @Get()
  findAll(@Query() query: VehiclesQueryDto) {
    return this.vehiclesService.findAll(query);
  }

  @Get('km-records')
  findAllKmRecords(@Query() query: VehicleKmRecordsQueryDto) {
    return this.vehiclesService.findAllKmRecords(query);
  }

  @Get('km-records/export')
  async exportKmRecords(
    @Query() query: VehicleKmRecordsQueryDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const exportedReport =
      await this.vehiclesExportService.exportKmRecords(query);

    response.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${exportedReport.filename}"`,
    });

    return new StreamableFile(exportedReport.buffer);
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

  @Get('fuel-records')
  findAllFuelRecords(@Query() query: FuelRecordsQueryDto) {
    return this.vehiclesService.findAllFuelRecords(query);
  }

  @Get('fuel-records/export')
  async exportFuelRecords(
    @Query() query: FuelRecordsQueryDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const exportedReport =
      await this.vehiclesExportService.exportFuelRecords(query);

    response.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${exportedReport.filename}"`,
    });

    return new StreamableFile(exportedReport.buffer);
  }

  @Get('fuel-records/:id')
  findOneFuelRecord(@Param('id') id: string) {
    return this.vehiclesService.findOneFuelRecord(id);
  }

  @Post('fuel-records')
  createFuelRecord(@Body() body: CreateFuelRecordDto) {
    return this.vehiclesService.createFuelRecord(body);
  }

  @Patch('fuel-records/:id')
  updateFuelRecord(@Param('id') id: string, @Body() body: UpdateFuelRecordDto) {
    return this.vehiclesService.updateFuelRecord(id, body);
  }

  @Delete('fuel-records/:id')
  removeFuelRecord(@Param('id') id: string) {
    return this.vehiclesService.removeFuelRecord(id);
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
