import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateLocationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  @IsIn(['home', 'office', 'factory', 'warehouse', 'rental_room', 'other'])
  type?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
