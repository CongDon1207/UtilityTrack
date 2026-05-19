import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateElectricityRecordDto {
  @IsInt()
  @Min(2000)
  recordYear!: number;

  @IsInt()
  @Min(1)
  @Max(12)
  recordMonth!: number;

  @IsString()
  @IsNotEmpty()
  @IsIn([
    'MAY_MAY_DIEN_TU_VAN_PHONG_NHA_BEP_KHO',
    'CAT_CHUAN_BI_UV_TECH_CU',
    'LASTING',
    'PHONG_TECH_MOI',
  ])
  location!: string;

  @IsString()
  @IsNotEmpty()
  departmentGroup!: string;

  @IsNumber()
  @Min(0)
  kwhUsed!: number;

  @IsNumber()
  @Min(0)
  totalCost!: number;

  @IsOptional()
  @IsString()
  note?: string;
}
