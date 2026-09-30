// @vitest-environment node
import { renderToString } from 'react-dom/server'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance
} from 'vitest'

import { ConfirmDialogProvider, useConfirm } from '@omit/react-confirm-dialog'

let consoleError: MockInstance
let consoleWarn: MockInstance

beforeEach(() => {
  consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
  consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  expect(consoleError).not.toHaveBeenCalled()
  expect(consoleWarn).not.toHaveBeenCalled()
  vi.restoreAllMocks()
})

describe('server rendering (no DOM)', () => {
  it('renders the provider and its children without a dialog', () => {
    expect(typeof document).toBe('undefined')

    function Consumer() {
      const confirm = useConfirm()
      return (
        <button type="button">
          {typeof confirm === 'function' &&
          typeof confirm.updateConfig === 'function'
            ? 'ready'
            : 'broken'}
        </button>
      )
    }

    const html = renderToString(
      <ConfirmDialogProvider defaultOptions={{ confirmText: 'Yes' }}>
        <Consumer />
      </ConfirmDialogProvider>
    )

    expect(html).toContain('ready')
    expect(html).not.toContain('alertdialog')
  })
})
