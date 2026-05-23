import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateVehicleKmRecordDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  vehicleId!: number;

  @IsDateString()
  tripDate!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  driverName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  tripPurpose?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  departureTime?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  departureOdometer!: number;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  arrivalTime?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  arrivalOdometer!: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
