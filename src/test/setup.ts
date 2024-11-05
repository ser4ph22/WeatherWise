import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom';

// Extend Vitest's expect method with testing-library matchers
expect.extend(matchers);

// Add ResizeObserver mock
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Add to global before any tests run
if (typeof window !== 'undefined') {
  window.ResizeObserver = ResizeObserverMock;
  // Enable better error messages for act() warnings
  // @ts-ignore - this is a valid property but TS doesn't know about it
  window.IS_REACT_ACT_ENVIRONMENT = true;
}

// Mock the window.matchMedia function
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Runs a cleanup after each test case
afterEach(() => {
  cleanup();
});