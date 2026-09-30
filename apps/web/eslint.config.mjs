import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    settings: {
      // eslint-plugin-react's automatic version detection still calls
      // `context.getFilename()`, which ESLint 10 removed. Naming the version
      // explicitly (the plugin's documented setting) avoids that code path.
      react: { version: '19.3' }
    }
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'playwright-report/**',
    'test-results/**'
  ])
])
