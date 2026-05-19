import type { ElectricityDepartmentGroup } from '../types/electricityRecord';

export const electricityDepartmentGroupOptions: {
  value: ElectricityDepartmentGroup;
  label: string;
}[] = [
  {
    value: 'MAY_MAY_DIEN_TU_VAN_PHONG_NHA_BEP_KHO',
    label: 'May, may dien tu, van phong, nha bep, kho',
  },
  {
    value: 'CAT_CHUAN_BI_UV_TECH_CU',
    label: 'Cat, chuan bi, UV, tech cu',
  },
  {
    value: 'LASTING',
    label: 'Lasting',
  },
  {
    value: 'PHONG_TECH_MOI',
    label: 'Phong tech moi',
  },
];

export function getElectricityDepartmentGroupLabel(
  value: ElectricityDepartmentGroup,
) {
  return (
    electricityDepartmentGroupOptions.find((option) => option.value === value)
      ?.label ?? value
  );
}
