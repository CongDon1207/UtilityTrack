import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { ElectricityRecordEntity } from '../electricity/electricity-record.entity';
import { FuelRecordEntity } from '../vehicles/fuel-record.entity';
import { VehicleKmRecordEntity } from '../vehicles/vehicle-km-record.entity';
import { VehicleEntity } from '../vehicles/vehicle.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ElectricityRecordEntity,
      VehicleEntity,
      VehicleKmRecordEntity,
      FuelRecordEntity,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
