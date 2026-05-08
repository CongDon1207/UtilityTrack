import type { Location, CreateLocationInput } from '../types/location';

const API_BASE_URL = 'http://localhost:3000';



export async function getLocations(): Promise<Location[]> {
  const res = await fetch(`${API_BASE_URL}/locations`);

  if (!res.ok) {
    throw new Error('Failed to load locations');
  }

  return res.json();
}

export async function createLocation(
  input: CreateLocationInput,
): Promise<Location> {
  const res = await fetch(`${API_BASE_URL}/locations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error('Failed to create location');
  }

  return res.json();
}
