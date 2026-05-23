export interface UtilityMetric {
  totalKm: number;
  totalLiters: number;
  totalCost: number;
  costPerKm: number;
  kmPerLiter: number;
}

export interface ElectricityMetric {
  totalKwh: number;
  totalCost: number;
}

export interface DashboardResponse {
  year: number;
  month?: number;
  overall: {
    electricity: ElectricityMetric;
    vehicles: UtilityMetric;
    totalUtilityCost: number;
  };
  byVehicle: Array<{
    vehicleId: number;
    vehicleName: string;
    isActive: number;
    totalKm: number;
    totalLiters: number;
    totalCost: number;
    costPerKm: number;
    kmPerLiter: number;
  }>;
  monthlyTrend: Array<{
    month: number;
    electricityKwh: number;
    electricityCost: number;
    vehicleKm: number;
    vehicleFuelLiters: number;
    vehicleFuelCost: number;
    totalUtilityCost: number;
  }>;
}
