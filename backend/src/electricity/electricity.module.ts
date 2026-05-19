import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElectricityController } from './electricity.controller';
import { ElectricityReportService } from './electricity-report.service';
import { ElectricityRecordEntity } from './electricity-record.entity';
import { ElectricityService } from './electricity.service';

@Module({
  imports: [TypeOrmModule.forFeature([ElectricityRecordEntity])],
  controllers: [ElectricityController],
  providers: [ElectricityService, ElectricityReportService],
})
export class ElectricityModule {}
