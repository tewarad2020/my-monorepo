import { calculateAverage, MAX_AVERAGE_NUMBERS } from './shared-types';

describe('calculateAverage', () => {
  it('returns the average, sum and count', () => {
    expect(calculateAverage([10, 20, 30])).toEqual({ average: 20, sum: 60, count: 3 });
  });
  it('supports decimals, negative values and zero', () => {
    expect(calculateAverage([-2.5, 0, 4])).toEqual({ average: 0.5, sum: 1.5, count: 3 });
    expect(calculateAverage([0])).toEqual({ average: 0, sum: 0, count: 1 });
  });
  it.each([undefined, null, [], '10', [1, '2'], [NaN], [Infinity], [-Infinity], [true], [{}]])(
    'rejects invalid input %j', (input) => { expect(() => calculateAverage(input)).toThrow(); },
  );
  it('enforces the maximum count', () => {
    expect(calculateAverage(Array(MAX_AVERAGE_NUMBERS).fill(1)).average).toBe(1);
    expect(() => calculateAverage(Array(MAX_AVERAGE_NUMBERS + 1).fill(1))).toThrow();
  });
  it('rejects overflowing sums', () => {
    expect(() => calculateAverage([Number.MAX_VALUE, Number.MAX_VALUE])).toThrow();
  });
});