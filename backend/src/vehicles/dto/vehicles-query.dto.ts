import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class VehiclesQueryDto extends PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  isActive?: number;
}
