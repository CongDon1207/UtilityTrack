import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElectricityController } from './electricity.controller';
import { ElectricityRecordEntity } from './electricity-record.entity';
import { ElectricityService } from './electricity.service';

@Module({
  imports: [TypeOrmModule.forFeature([ElectricityRecordEntity])],
  controllers: [ElectricityController],
  providers: [ElectricityService],
})
export class ElectricityModule {}
