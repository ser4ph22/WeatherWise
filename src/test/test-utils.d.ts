// src/test/test-utils.d.ts

import '@testing-library/jest-dom';

declare global {
  namespace Vi {
    interface JestAssertion<T = unknown> extends jest.Matchers<void, T> {
      toBeInTheDocument(): void;
      toHaveTextContent(text: string): void;
      toBeVisible(): void;
      toHaveClass(className: string): void;
    }
  }
}

export {};
