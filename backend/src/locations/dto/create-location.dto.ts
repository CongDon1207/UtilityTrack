import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['home', 'office', 'factory', 'warehouse', 'rental_room', 'other'])
  type: string;

  @IsOptional()
  @IsString()
  address?: string;
}
