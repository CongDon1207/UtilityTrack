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
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateElectricityRecordDto } from './dto/create-electricity-record.dto';
import { ElectricityReportQueryDto } from './dto/electricity-report-query.dto';
import { UpdateElectricityRecordDto } from './dto/update-electricity-record.dto';
import { ElectricityExportService } from './electricity-export.service';
import { ElectricityReportService } from './electricity-report.service';
import { ElectricityService } from './electricity.service';

@Controller('electricity-records')
export class ElectricityController {
  constructor(
    private readonly electricityService: ElectricityService,
    private readonly electricityReportService: ElectricityReportService,
    private readonly electricityExportService: ElectricityExportService,
  ) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.electricityService.findAll(query);
  }

  @Get('report')
  getReport(@Query() query: ElectricityReportQueryDto) {
    return this.electricityReportService.getReport(query);
  }

  @Get('export')
  async exportReport(
    @Query() query: ElectricityReportQueryDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const exportedReport =
      await this.electricityExportService.exportReport(query);

    response.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${exportedReport.filename}"`,
    });

    return new StreamableFile(exportedReport.buffer);
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
