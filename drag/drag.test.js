const { clamp, isInteractiveTarget, makeDraggable } = require('./drag.js');

describe('makeDraggable function', () => {
  let originalWindow;

  beforeAll(() => {
    originalWindow = global.window;
    // Mock window object
    global.window = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      innerWidth: 1024,
      innerHeight: 768,
    };
  });

  afterAll(() => {
    global.window = originalWindow;
  });

  test('should not add event listeners (disabled)', () => {
    const el = {
      style: {},
      getBoundingClientRect: jest.fn(() => ({ left: 0, top: 0, width: 100, height: 100 })),
    };
    const handle = {
      addEventListener: jest.fn(),
      setPointerCapture: jest.fn(),
    };

    makeDraggable({ el, handle });

    expect(handle.addEventListener).not.toHaveBeenCalled();
  });
});

describe('isInteractiveTarget function', () => {
  test('should return false if target is falsy', () => {
    expect(isInteractiveTarget(null)).toBe(false);
    expect(isInteractiveTarget(undefined)).toBe(false);
  });

  test('should return true if target is in .traffic element', () => {
    const target = {
      closest: jest.fn((selector) => selector === '.traffic'),
    };
    expect(isInteractiveTarget(target)).toBe(true);
    expect(target.closest).toHaveBeenCalledWith('.traffic');
  });

  test('should return true for interactive tag names', () => {
    const interactiveTags = ['INPUT', 'BUTTON', 'A', 'TEXTAREA', 'SELECT', 'LABEL'];
    interactiveTags.forEach((tag) => {
      const target = { tagName: tag };
      expect(isInteractiveTarget(target)).toBe(true);
    });
  });

  test('should return true for interactive tag names regardless of case', () => {
    const interactiveTags = ['input', 'Button', 'a', 'TextArea', 'SELECT', 'label'];
    interactiveTags.forEach((tag) => {
      const target = { tagName: tag };
      expect(isInteractiveTarget(target)).toBe(true);
    });
  });

  test('should return false for non-interactive tag names', () => {
    const nonInteractiveTags = ['DIV', 'SPAN', 'P', 'SECTION'];
    nonInteractiveTags.forEach((tag) => {
      const target = { tagName: tag };
      expect(isInteractiveTarget(target)).toBe(false);
    });
  });

  test('should return false if tagName is missing', () => {
    const target = {};
    expect(isInteractiveTarget(target)).toBe(false);
  });

  test('should handle target with closest returning null', () => {
    const target = {
      closest: () => null,
      tagName: 'DIV',
    };
    expect(isInteractiveTarget(target)).toBe(false);
  });

  test('should not crash if target.closest is undefined', () => {
    const target = { tagName: 'DIV' }; // closest is undefined
    expect(isInteractiveTarget(target)).toBe(false);
  });
});

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
    expect(clamp(5, 10, 0)).toBe(0);
    expect(clamp(15, 10, 0)).toBe(0);
    expect(clamp(-5, 10, 0)).toBe(0);
  });
});
