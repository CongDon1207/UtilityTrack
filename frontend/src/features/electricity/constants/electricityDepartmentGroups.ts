import type { ElectricityDepartmentGroup } from '../types/electricityRecord';

export const electricityDepartmentGroupOptions: {
  value: ElectricityDepartmentGroup;
  label: string;
}[] = [
  {
    value: 'MAY_MAY_DIEN_TU_VAN_PHONG_NHA_BEP_KHO',
    label: 'May, máy điện tử, văn phòng, nhà bếp, kho',
  },
  {
    value: 'CAT_CHUAN_BI_UV_TECH_CU',
    label: 'Cắt, chuẩn bị, UV, tech cũ',
  },
  {
    value: 'LASTING',
    label: 'Lasting',
  },
  {
    value: 'PHONG_TECH_MOI',
    label: 'Phòng tech mới',
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
