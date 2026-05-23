import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Max,
  Min,
} from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  vehicleName!: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1)
  isActive?: number;
}
