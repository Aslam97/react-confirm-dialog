import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const here = path.dirname(fileURLToPath(import.meta.url))
const packagesDir = path.resolve(here, '..')

// Every module that must bind to React 18 is resolved from this package's own
// node_modules (where pnpm installed the React 18 dependency graph). The
// library bundle lives outside node_modules, so Vite transforms it and the
// aliases apply to its imports as well.
const react18Packages = [
  'react',
  'react-dom',
  '@radix-ui/react-alert-dialog',
  '@radix-ui/react-compose-refs',
  '@radix-ui/react-slot',
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
  '@testing-library/dom',
  '@testing-library/jest-dom',
  '@testing-library/react',
  '@testing-library/user-event'
]

export default defineConfig({
  root: packagesDir,
  resolve: {
    alias: [
      {
        find: '@omit/react-confirm-dialog',
        replacement: path.join(packagesDir, 'confirm-dialog/dist/index.mjs')
      },
      ...react18Packages.map((name) => ({
        find: name,
        replacement: path.join(here, 'node_modules', name)
      }))
    ]
  },
  test: {
    environment: 'jsdom',
    include: [
      'confirm-dialog/tests/**/*.test.{ts,tsx}',
      'react18-tests/tests/**/*.test.{ts,tsx}'
    ],
    setupFiles: [path.join(here, 'tests/setup.ts')]
  }
})
