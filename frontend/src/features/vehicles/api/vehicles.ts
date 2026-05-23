import { API_BASE_URL, parseJsonResponse } from '../../../shared/api/http';
import type {
  CreateVehicleInput,
  CreateVehicleKmRecordInput,
  UpdateVehicleInput,
  UpdateVehicleKmRecordInput,
  Vehicle,
  VehicleKmRecord,
  VehicleKmRecordsResponse,
  VehiclesResponse,
} from '../types/vehicle';

export async function getVehicles(
  page = 1,
  limit = 10,
): Promise<VehiclesResponse> {
  const response = await fetch(
    `${API_BASE_URL}/vehicles?page=${page}&limit=${limit}`,
  );

  return parseJsonResponse<VehiclesResponse>(
    response,
    'Could not load vehicles',
  );
}

export async function createVehicle(
  input: CreateVehicleInput,
): Promise<Vehicle> {
  const response = await fetch(`${API_BASE_URL}/vehicles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return parseJsonResponse<Vehicle>(response, 'Could not create vehicle');
}

export async function updateVehicle(
  id: number,
  input: UpdateVehicleInput,
): Promise<Vehicle> {
  const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return parseJsonResponse<Vehicle>(response, 'Could not update vehicle');
}

export async function deleteVehicle(id: number): Promise<{ deleted: boolean }> {
  const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
    method: 'DELETE',
  });

  return parseJsonResponse<{ deleted: boolean }>(
    response,
    'Could not delete vehicle',
  );
}

export async function getVehicleKmRecords(
  page = 1,
  limit = 10,
  vehicleId?: number,
): Promise<VehicleKmRecordsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (vehicleId) {
    params.set('vehicleId', String(vehicleId));
  }

  const response = await fetch(
    `${API_BASE_URL}/vehicles/km-records?${params.toString()}`,
  );

  return parseJsonResponse<VehicleKmRecordsResponse>(
    response,
    'Could not load vehicle KM records',
  );
}

export async function createVehicleKmRecord(
  input: CreateVehicleKmRecordInput,
): Promise<VehicleKmRecord> {
  const response = await fetch(`${API_BASE_URL}/vehicles/km-records`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return parseJsonResponse<VehicleKmRecord>(
    response,
    'Could not create vehicle KM record',
  );
}

export async function updateVehicleKmRecord(
  id: number,
  input: UpdateVehicleKmRecordInput,
): Promise<VehicleKmRecord> {
  const response = await fetch(`${API_BASE_URL}/vehicles/km-records/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return parseJsonResponse<VehicleKmRecord>(
    response,
    'Could not update vehicle KM record',
  );
}

export async function deleteVehicleKmRecord(
  id: number,
): Promise<{ deleted: boolean }> {
  const response = await fetch(`${API_BASE_URL}/vehicles/km-records/${id}`, {
    method: 'DELETE',
  });

  return parseJsonResponse<{ deleted: boolean }>(
    response,
    'Could not delete vehicle KM record',
  );
}
