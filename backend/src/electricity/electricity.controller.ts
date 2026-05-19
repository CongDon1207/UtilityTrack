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
import { CreateElectricityRecordDto } from './dto/create-electricity-record.dto';
import { ElectricityReportQueryDto } from './dto/electricity-report-query.dto';
import { UpdateElectricityRecordDto } from './dto/update-electricity-record.dto';
import { ElectricityReportService } from './electricity-report.service';
import { ElectricityService } from './electricity.service';

@Controller('electricity-records')
export class ElectricityController {
  constructor(
    private readonly electricityService: ElectricityService,
    private readonly electricityReportService: ElectricityReportService,
  ) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.electricityService.findAll(query);
  }

  @Get('report')
  getReport(@Query() query: ElectricityReportQueryDto) {
    return this.electricityReportService.getReport(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.electricityService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateElectricityRecordDto) {
    return this.electricityService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateElectricityRecordDto) {
    return this.electricityService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.electricityService.remove(id);
  }
}
