export const API_BASE_URL = 'http://localhost:3000';

export async function parseJsonResponse<T>(
  response: Response,
  errorMessage: string,
): Promise<T> {
  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}
