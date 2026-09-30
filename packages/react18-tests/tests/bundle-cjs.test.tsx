import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

// The CommonJS bundle is loaded with plain `require`, the way Jest-based
// consumer test-suites and CJS server frameworks load it. The React that the
// bundle resolves is the library package's own React 19, so the matching
// react-dom/server is taken from there as well.
const libraryDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../confirm-dialog'
)
const requireFromLibrary = createRequire(path.join(libraryDir, 'package.json'))

describe('CommonJS bundle', () => {
  it('loads with require() and renders on the server', () => {
    const lib = requireFromLibrary('./dist/index.js') as typeof import('@omit/react-confirm-dialog')
    const React = requireFromLibrary('react') as typeof import('react')
    const { renderToString } = requireFromLibrary('react-dom/server') as typeof import('react-dom/server')

    expect(typeof lib.ConfirmDialogProvider).toBe('function')
    expect(typeof lib.useConfirm).toBe('function')

    function Consumer() {
      const confirm = lib.useConfirm()
      return React.createElement('span', null, typeof confirm === 'function' ? 'ready' : 'broken')
    }
    const html = renderToString(
      React.createElement(lib.ConfirmDialogProvider, null, React.createElement(Consumer))
    )
    expect(html).toContain('ready')
  })
})
