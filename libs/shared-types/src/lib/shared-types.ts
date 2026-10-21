export function sharedTypes(): string {
  return 'shared-types';
}

export interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
}

export interface AverageRequest {
  numbers: number[];
}

export interface AverageResponse {
  average: number;
  sum: number;
  count: number;
}

export const MAX_AVERAGE_NUMBERS = 10_000;

export function calculateAverage(numbers: unknown): AverageResponse {
  if (
    !Array.isArray(numbers) || numbers.length === 0 ||
    numbers.length > MAX_AVERAGE_NUMBERS ||
    !numbers.every((value) => typeof value === 'number' && Number.isFinite(value))
  ) {
    throw new Error('กรุณาระบุตัวเลขที่ถูกต้อง 1–10,000 ค่า');
  }
  const sum = numbers.reduce((total, value) => total + value, 0);
  if (!Number.isFinite(sum)) {
    throw new Error('ผลรวมมีขนาดใหญ่เกินไป กรุณาลดขนาดตัวเลข');
  }
  return { average: sum / numbers.length, sum, count: numbers.length };
}

export function calculateVat(price: number): number {
  return price * 0.07;
}

export function formatBaht(price: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
  }).format(price);
}