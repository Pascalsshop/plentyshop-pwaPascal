import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['extensions/**/__tests__/*.spec.ts'],
    clearMocks: true,
  },
});
