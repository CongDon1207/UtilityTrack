export type ElectricityDepartmentGroup =
  | 'MAY_MAY_DIEN_TU_VAN_PHONG_NHA_BEP_KHO'
  | 'CAT_CHUAN_BI_UV_TECH_CU'
  | 'LASTING'
  | 'PHONG_TECH_MOI';

export type ElectricityRecord = {
  id: number;
  recordYear: number;
  recordMonth: number;
  departmentGroup: ElectricityDepartmentGroup;
  kwhUsed: number;
  totalCost: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateElectricityRecordInput = {
  recordYear: number;
  recordMonth: number;
  departmentGroup: ElectricityDepartmentGroup;
  kwhUsed: number;
  totalCost: number;
  note?: string;
};

export type UpdateElectricityRecordInput =
  Partial<CreateElectricityRecordInput>;

export type ElectricityRecordsResponse = {
  data: ElectricityRecord[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
