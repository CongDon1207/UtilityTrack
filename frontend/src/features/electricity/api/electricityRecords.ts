import { API_BASE_URL, parseJsonResponse } from '../../../shared/api/http';
import type {
  CreateElectricityRecordInput,
  ElectricityRecord,
  ElectricityRecordsResponse,
  UpdateElectricityRecordInput,
} from '../types/electricityRecord';

export async function getElectricityRecords(
  page = 1,
  limit = 10,
): Promise<ElectricityRecordsResponse> {
  const response = await fetch(
    `${API_BASE_URL}/electricity-records?page=${page}&limit=${limit}`,
  );

  return parseJsonResponse<ElectricityRecordsResponse>(
    response,
    'Không tải được dữ liệu điện',
  );
}

export async function getElectricityRecord(
  id: number,
): Promise<ElectricityRecord> {
  const response = await fetch(`${API_BASE_URL}/electricity-records/${id}`);

  return parseJsonResponse<ElectricityRecord>(
    response,
    'Không tải được bản ghi điện',
  );
}

export async function createElectricityRecord(
  input: CreateElectricityRecordInput,
): Promise<ElectricityRecord> {
  const response = await fetch(`${API_BASE_URL}/electricity-records`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return parseJsonResponse<ElectricityRecord>(
    response,
    'Không tạo được bản ghi điện',
  );
}

export async function updateElectricityRecord(
  id: number,
  input: UpdateElectricityRecordInput,
): Promise<ElectricityRecord> {
  const response = await fetch(`${API_BASE_URL}/electricity-records/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return parseJsonResponse<ElectricityRecord>(
    response,
    'Không cập nhật được bản ghi điện',
  );
}

export async function deleteElectricityRecord(
  id: number,
): Promise<{ deleted: boolean }> {
  const response = await fetch(`${API_BASE_URL}/electricity-records/${id}`, {
    method: 'DELETE',
  });

  return parseJsonResponse<{ deleted: boolean }>(
    response,
    'Không xóa được bản ghi điện',
  );
}
