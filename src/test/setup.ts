// src/test/setup.ts

import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom';

// Extend Vitest's expect method with testing-library matchers
expect.extend(matchers);

// Runs a cleanup after each test case
afterEach(() => {
  cleanup();
});

// Enable better error messages for act() warnings
if (typeof window !== 'undefined') {
  // @ts-ignore - this is a valid property but TS doesn't know about it
  window.IS_REACT_ACT_ENVIRONMENT = true;
}