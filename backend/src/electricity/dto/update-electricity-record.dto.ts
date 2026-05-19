import { PartialType } from '@nestjs/mapped-types';
import { CreateElectricityRecordDto } from './create-electricity-record.dto';

export class UpdateElectricityRecordDto extends PartialType(
  CreateElectricityRecordDto,
) {}
