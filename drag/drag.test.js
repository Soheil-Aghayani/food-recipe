const { clamp } = require('./drag.js');

describe('clamp function', () => {
  test('should return v if v is within [min, max]', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });

  test('should return min if v < min', () => {
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(-100, -10, 10)).toBe(-10);
  });

  test('should return max if v > max', () => {
    expect(clamp(11, 0, 10)).toBe(10);
    expect(clamp(100, 0, 10)).toBe(10);
  });

  test('should handle negative numbers correctly', () => {
    expect(clamp(-5, -10, -1)).toBe(-5);
    expect(clamp(-11, -10, -1)).toBe(-10);
    expect(clamp(0, -10, -1)).toBe(-1);
  });

  test('should handle min == max', () => {
    expect(clamp(5, 10, 10)).toBe(10);
    expect(clamp(15, 10, 10)).toBe(10);
    expect(clamp(0, 10, 10)).toBe(10);
  });

  test('should handle min > max by returning max (current behavior)', () => {
    // Math.min(Math.max(5, 10), 0) -> Math.min(10, 0) -> 0
    expect(clamp(5, 10, 0)).toBe(0);
    // Math.min(Math.max(15, 10), 0) -> Math.min(15, 0) -> 0
    expect(clamp(15, 10, 0)).toBe(0);
    // Math.min(Math.max(-5, 10), 0) -> Math.min(10, 0) -> 0
    expect(clamp(-5, 10, 0)).toBe(0);
  });
});
