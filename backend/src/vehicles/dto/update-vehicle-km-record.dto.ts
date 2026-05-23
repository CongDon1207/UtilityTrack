import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleKmRecordDto } from './create-vehicle-km-record.dto';

export class UpdateVehicleKmRecordDto extends PartialType(
  CreateVehicleKmRecordDto,
) {}
