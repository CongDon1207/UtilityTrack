export type Vehicle = {
  id: number;
  vehicleName: string;
  isActive: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateVehicleInput = {
  vehicleName: string;
};

export type UpdateVehicleInput = Partial<CreateVehicleInput>;

export type VehiclesResponse = {
  data: Vehicle[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type VehicleKmRecord = {
  id: number;
  vehicleId: number;
  vehicle: Vehicle;
  tripDate: string;
  driverName?: string;
  tripPurpose?: string;
  departureTime?: string;
  departureOdometer: number;
  arrivalTime?: string;
  arrivalOdometer: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateVehicleKmRecordInput = {
  vehicleId: number;
  tripDate: string;
  driverName?: string;
  tripPurpose?: string;
  departureTime?: string;
  departureOdometer: number;
  arrivalTime?: string;
  arrivalOdometer: number;
  note?: string;
};

export type UpdateVehicleKmRecordInput =
  Partial<CreateVehicleKmRecordInput>;

export type VehicleKmRecordsResponse = {
  data: VehicleKmRecord[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
