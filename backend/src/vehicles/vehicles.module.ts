import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleKmRecordEntity } from './vehicle-km-record.entity';
import { VehicleEntity } from './vehicle.entity';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleEntity, VehicleKmRecordEntity])],
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}
