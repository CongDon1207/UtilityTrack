import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateFuelRecordDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  vehicleId!: number;

  @IsDateString()
  fuelDate!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  unitPrice!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  liters!: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
