import * as React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance
} from 'vitest'

import {
  ConfirmDialogProvider,
  useConfirm,
  type ConfirmOptions,
  type CustomActionsProps
} from '@omit/react-confirm-dialog'

type ConfirmApi = ReturnType<typeof useConfirm>

const PENDING = Symbol('pending')

/**
 * Resolves with the promise's value when it is already settled, otherwise
 * with `PENDING` after the current macrotask. Used to assert that a dialog is
 * still waiting for the user.
 */
function outcome(promise: Promise<boolean>) {
  return Promise.race([
    promise,
    new Promise<typeof PENDING>((resolve) => {
      setTimeout(() => resolve(PENDING), 0)
    })
  ])
}

interface RenderOptions {
  defaultOptions?: ConfirmOptions
  children?: React.ReactNode
  strictMode?: boolean
}

function renderWithProvider({
  defaultOptions,
  children,
  strictMode = true
}: RenderOptions = {}) {
  const apiRef: { current: ConfirmApi | null } = { current: null }

  function CaptureApi() {
    apiRef.current = useConfirm()
    return null
  }

  const makeTree = (options: ConfirmOptions | undefined) => {
    const tree = (
      <ConfirmDialogProvider defaultOptions={options}>
        <CaptureApi />
        {children}
      </ConfirmDialogProvider>
    )
    return strictMode ? <React.StrictMode>{tree}</React.StrictMode> : tree
  }

  const view = render(makeTree(defaultOptions))

  const api = (): ConfirmApi => {
    if (!apiRef.current) {
      throw new Error('useConfirm was not rendered')
    }
    return apiRef.current
  }

  const confirm = (options: ConfirmOptions) => {
    let promise: Promise<boolean> | undefined
    act(() => {
      promise = api()(options)
    })
    if (!promise) {
      throw new Error('confirm() did not return a promise')
    }
    return promise
  }

  return {
    ...view,
    api,
    confirm,
    rerenderWithDefaults: (options: ConfirmOptions | undefined) => {
      view.rerender(makeTree(options))
    }
  }
}

const getDialog = () => screen.getByRole('alertdialog')
const getButton = (name: string) => screen.getByRole('button', { name })

let consoleError: MockInstance
let consoleWarn: MockInstance

beforeEach(() => {
  consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
  consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  // Any React, Radix or library warning is a test failure.
  expect(consoleError).not.toHaveBeenCalled()
  expect(consoleWarn).not.toHaveBeenCalled()
  vi.restoreAllMocks()
})

describe('confirm()', () => {
  it('resolves true when the confirm button is clicked', async () => {
    const user = userEvent.setup()
    const { confirm } = renderWithProvider()

    const promise = confirm({
      title: 'Delete item?',
      description: 'This cannot be undone.'
    })

    const dialog = screen.getByRole('alertdialog', { name: 'Delete item?' })
    expect(dialog).toHaveAccessibleDescription('This cannot be undone.')
    expect(await outcome(promise)).toBe(PENDING)

    await user.click(getButton('Confirm'))

    await expect(promise).resolves.toBe(true)
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('resolves false when the cancel button is clicked', async () => {
    const user = userEvent.setup()
    const { confirm } = renderWithProvider()

    const promise = confirm({ title: 'Sure?', description: 'Really?' })
    await user.click(getButton('Cancel'))

    await expect(promise).resolves.toBe(false)
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('resolves false when the dialog is dismissed with Escape', async () => {
    const user = userEvent.setup()
    const { confirm } = renderWithProvider()

    const promise = confirm({ title: 'Sure?', description: 'Really?' })
    await user.keyboard('{Escape}')

    await expect(promise).resolves.toBe(false)
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('does not close when the overlay is clicked (alert dialog semantics)', async () => {
    const { confirm } = renderWithProvider()

    const promise = confirm({ title: 'Sure?', description: 'Really?' })
    // Radix registers its outside-pointer listener asynchronously after the
    // dialog opened; wait one macrotask so the click is not ignored for the
    // wrong reason.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    const overlay = document.querySelector('[data-slot="alert-dialog-overlay"]')
    expect(overlay).not.toBeNull()
    fireEvent.pointerDown(overlay as Element)
    fireEvent.click(overlay as Element)

    expect(getDialog()).toBeInTheDocument()
    expect(await outcome(promise)).toBe(PENDING)
  })

  it('uses default texts, provider defaults and per-call overrides in that order', async () => {
    const user = userEvent.setup()
    const { confirm } = renderWithProvider({
      defaultOptions: { confirmText: 'Yes', cancelText: 'No' }
    })

    const first = confirm({ title: 'First', description: 'D' })
    expect(getButton('Yes')).toBeInTheDocument()
    expect(getButton('No')).toBeInTheDocument()
    await user.click(getButton('No'))
    await first

    const second = confirm({
      title: 'Second',
      description: 'D',
      confirmText: 'Go',
      cancelText: 'Stop'
    })
    expect(getButton('Go')).toBeInTheDocument()
    expect(getButton('Stop')).toBeInTheDocument()
    await user.click(getButton('Stop'))
    await second

    // Per-call options must not leak into the next dialog.
    const third = confirm({ title: 'Third', description: 'D' })
    expect(getButton('Yes')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Go' })).not.toBeInTheDocument()
    await user.click(getButton('No'))
    await third
  })

  it('falls back to "Confirm" and "Cancel" without provider defaults', () => {
    const { confirm } = renderWithProvider()
    void confirm({ title: 'T', description: 'D' })

    expect(getButton('Confirm')).toBeInTheDocument()
    expect(getButton('Cancel')).toBeInTheDocument()
  })

  it('resolves the previous dialog with false when confirm() is called while open', async () => {
    const user = userEvent.setup()
    const { confirm } = renderWithProvider()

    const first = confirm({ title: 'First', description: 'D' })
    const second = confirm({ title: 'Second', description: 'D' })

    await expect(first).resolves.toBe(false)
    expect(screen.getAllByRole('alertdialog')).toHaveLength(1)
    expect(
      screen.getByRole('alertdialog', { name: 'Second' })
    ).toBeInTheDocument()

    await user.click(getButton('Confirm'))
    await expect(second).resolves.toBe(true)
  })

  it('can be used again after the dialog was closed', async () => {
    const user = userEvent.setup()
    const { confirm } = renderWithProvider()

    const first = confirm({ title: 'One', description: 'D' })
    await user.click(getButton('Confirm'))
    await expect(first).resolves.toBe(true)

    const second = confirm({ title: 'Two', description: 'D' })
    expect(screen.getByRole('alertdialog', { name: 'Two' })).toBeInTheDocument()
    await user.click(getButton('Cancel'))
    await expect(second).resolves.toBe(false)
  })
})

describe('buttons', () => {
  it('hides the cancel button when cancelButton is null and keeps focus inside the dialog', () => {
    const { confirm } = renderWithProvider()
    void confirm({
      title: 'Done',
      description: 'All good.',
      cancelButton: null
    })

    expect(
      screen.queryByRole('button', { name: 'Cancel' })
    ).not.toBeInTheDocument()
    expect(getButton('Confirm')).toHaveFocus()
  })

  it('focuses the confirm button when the cancel button is disabled', () => {
    const { confirm } = renderWithProvider()
    void confirm({
      title: 'T',
      description: 'D',
      cancelButton: { disabled: true }
    })

    expect(getButton('Cancel')).toBeDisabled()
    expect(getButton('Confirm')).toHaveFocus()
  })

  it('focuses the cancel button on open and traps Tab inside the dialog', async () => {
    const user = userEvent.setup()
    const { confirm } = renderWithProvider()
    void confirm({ title: 'T', description: 'D' })

    expect(getButton('Cancel')).toHaveFocus()
    await user.tab()
    expect(getButton('Confirm')).toHaveFocus()
    await user.tab()
    expect(getButton('Cancel')).toHaveFocus()
    await user.tab({ shift: true })
    expect(getButton('Confirm')).toHaveFocus()
  })

  it('confirms with Enter on the focused confirm button', async () => {
    const user = userEvent.setup()
    const { confirm } = renderWithProvider()
    const promise = confirm({ title: 'T', description: 'D' })

    await user.tab()
    expect(getButton('Confirm')).toHaveFocus()
    await user.keyboard('{Enter}')

    await expect(promise).resolves.toBe(true)
  })

  it('calls consumer onClick handlers and still settles the promise', async () => {
    const user = userEvent.setup()
    const onConfirmClick = vi.fn()
    const onCancelClick = vi.fn()
    const { confirm } = renderWithProvider()

    const first = confirm({
      title: 'T',
      description: 'D',
      confirmButton: { onClick: onConfirmClick },
      cancelButton: { onClick: onCancelClick }
    })
    await user.click(getButton('Confirm'))
    expect(onConfirmClick).toHaveBeenCalledTimes(1)
    expect(onCancelClick).not.toHaveBeenCalled()
    await expect(first).resolves.toBe(true)

    const second = confirm({
      title: 'T',
      description: 'D',
      cancelButton: { onClick: onCancelClick }
    })
    await user.click(getButton('Cancel'))
    expect(onCancelClick).toHaveBeenCalledTimes(1)
    await expect(second).resolves.toBe(false)
  })

  it('keeps the dialog open when a consumer onClick handler prevents the default', async () => {
    const user = userEvent.setup()
    const { confirm } = renderWithProvider()

    const promise = confirm({
      title: 'T',
      description: 'D',
      confirmButton: {
        onClick: (event) => {
          event.preventDefault()
        }
      }
    })
    await user.click(getButton('Confirm'))

    expect(getDialog()).toBeInTheDocument()
    expect(await outcome(promise)).toBe(PENDING)

    await user.keyboard('{Escape}')
    await expect(promise).resolves.toBe(false)
  })

  it('merges consumer classNames with the variant classes', () => {
    const { confirm } = renderWithProvider()
    void confirm({
      title: 'T',
      description: 'D',
      confirmButton: { className: 'bg-green-500' },
      cancelButton: { className: 'rounded-none', variant: 'ghost' }
    })

    const confirmButton = getButton('Confirm')
    expect(confirmButton).toHaveClass('bg-green-500')
    expect(confirmButton).not.toHaveClass('bg-primary')
    expect(confirmButton).toHaveAttribute('data-slot', 'alert-dialog-action')

    const cancelButton = getButton('Cancel')
    expect(cancelButton).toHaveClass('rounded-none')
    expect(cancelButton).not.toHaveClass('rounded-lg')
    expect(cancelButton).toHaveAttribute('data-variant', 'ghost')
  })

  it('forwards refs passed through the options', () => {
    const contentRef = React.createRef<HTMLDivElement>()
    const confirmRef = React.createRef<HTMLButtonElement>()
    const cancelRef = React.createRef<HTMLButtonElement>()
    const titleRef = React.createRef<HTMLHeadingElement>()
    const { confirm } = renderWithProvider()

    void confirm({
      title: 'T',
      description: 'D',
      alertDialogContent: { ref: contentRef },
      alertDialogTitle: { ref: titleRef },
      confirmButton: { ref: confirmRef },
      cancelButton: { ref: cancelRef }
    })

    expect(contentRef.current).toBe(getDialog())
    expect(titleRef.current).toHaveTextContent('T')
    expect(confirmRef.current).toBe(getButton('Confirm'))
    expect(cancelRef.current).toBe(getButton('Cancel'))
  })
})

describe('customActions', () => {
  it('supports the legacy (onConfirm, onCancel) signature', async () => {
    const user = userEvent.setup()
    const { confirm } = renderWithProvider()

    const promise = confirm({
      title: 'T',
      description: 'D',
      customActions: (onConfirm, onCancel) => (
        <>
          <button type="button" onClick={onCancel}>
            Nope
          </button>
          <button type="button" onClick={onConfirm}>
            Yep
          </button>
        </>
      )
    })

    expect(
      screen.queryByRole('button', { name: 'Confirm' })
    ).not.toBeInTheDocument()
    expect(getButton('Nope')).toHaveFocus()
    await user.click(getButton('Yep'))
    await expect(promise).resolves.toBe(true)
  })

  it('supports legacy render functions that only declare onConfirm', async () => {
    const user = userEvent.setup()
    const { confirm } = renderWithProvider()

    const promise = confirm({
      title: 'T',
      description: 'D',
      customActions: (onConfirm: () => void) => (
        <button type="button" onClick={onConfirm}>
          Only confirm
        </button>
      )
    })

    await user.click(getButton('Only confirm'))
    await expect(promise).resolves.toBe(true)
  })

  it('supports the enhanced signature with config and setConfig', async () => {
    const user = userEvent.setup()
    const { confirm } = renderWithProvider()

    const promise = confirm({
      title: 'Original',
      description: 'D',
      confirmText: 'Apply',
      customActions: ({
        confirm,
        cancel,
        config,
        setConfig
      }: CustomActionsProps) => (
        <>
          <button
            type="button"
            onClick={() => {
              setConfig((prev) => ({ ...prev, title: 'Updated' }))
            }}
          >
            Rename
          </button>
          <button type="button" onClick={cancel}>
            Leave
          </button>
          <button type="button" onClick={confirm}>
            {config.confirmText}
          </button>
        </>
      )
    })

    expect(
      screen.getByRole('alertdialog', { name: 'Original' })
    ).toBeInTheDocument()
    await user.click(getButton('Rename'))
    expect(
      screen.getByRole('alertdialog', { name: 'Updated' })
    ).toBeInTheDocument()

    await user.click(getButton('Apply'))
    await expect(promise).resolves.toBe(true)
  })

  it('resolves false from a custom cancel action', async () => {
    const user = userEvent.setup()
    const { confirm } = renderWithProvider()

    const promise = confirm({
      title: 'T',
      description: 'D',
      customActions: ({ cancel }: CustomActionsProps) => (
        <button type="button" onClick={cancel}>
          Leave
        </button>
      )
    })

    await user.click(getButton('Leave'))
    await expect(promise).resolves.toBe(false)
  })
})

describe('updateConfig', () => {
  it('merges partial objects and applies updater functions while the dialog is open', () => {
    const { confirm, api } = renderWithProvider()
    void confirm({ title: 'T', description: 'D' })

    act(() => {
      api().updateConfig({
        confirmText: 'Proceed',
        confirmButton: { disabled: true }
      })
    })
    expect(getButton('Proceed')).toBeDisabled()
    expect(screen.getByRole('alertdialog', { name: 'T' })).toBeInTheDocument()

    act(() => {
      api().updateConfig((prev) => ({
        ...prev,
        confirmButton: { ...prev.confirmButton, disabled: false }
      }))
    })
    expect(getButton('Proceed')).toBeEnabled()
  })

  it('does not leak into the next dialog and is safe to call while closed', () => {
    const { confirm, api } = renderWithProvider()

    act(() => {
      api().updateConfig({ confirmText: 'Leaked' })
    })
    void confirm({ title: 'T', description: 'D' })

    expect(getButton('Confirm')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Leaked' })
    ).not.toBeInTheDocument()
  })
})

describe('rendering', () => {
  it('renders icon, media, content slot, size and part props', () => {
    const { confirm } = renderWithProvider()
    void confirm({
      title: 'T',
      description: 'D',
      icon: <svg data-testid="icon" aria-hidden="true" />,
      media: <span data-testid="media" />,
      contentSlot: <input aria-label="Repository name" />,
      alertDialogContent: { size: 'sm' },
      alertDialogTitle: { className: 'custom-title' },
      alertDialogFooter: { id: 'footer' }
    })

    const dialog = getDialog()
    expect(dialog).toHaveAttribute('data-size', 'sm')
    expect(
      screen.getByTestId('icon').closest('[data-slot="alert-dialog-title"]')
    ).toHaveClass('custom-title')
    expect(screen.getByTestId('media').parentElement).toHaveAttribute(
      'data-slot',
      'alert-dialog-media'
    )
    expect(
      screen.getByRole('textbox', { name: 'Repository name' })
    ).toBeInTheDocument()
    expect(document.getElementById('footer')).toHaveAttribute(
      'data-slot',
      'alert-dialog-footer'
    )
  })

  it('renders the title element when only an icon is provided', () => {
    const { confirm } = renderWithProvider()
    void confirm({
      description: 'D',
      icon: <svg data-testid="icon" aria-hidden="true" />
    })

    expect(
      getDialog().querySelector('[data-slot="alert-dialog-title"]')
    ).not.toBeNull()
  })

  it('omits the description reference and stays silent when description or title are missing', async () => {
    const user = userEvent.setup()
    const { confirm } = renderWithProvider()

    const first = confirm({ title: 'Only title' })
    const dialog = screen.getByRole('alertdialog', { name: 'Only title' })
    expect(dialog).not.toHaveAttribute('aria-describedby')
    expect(
      dialog.querySelector('[data-slot="alert-dialog-description"]')
    ).toBeNull()
    await user.click(getButton('Cancel'))
    await first

    const second = confirm({ description: 'Only description' })
    expect(
      getDialog().querySelector('[data-slot="alert-dialog-title"]')
    ).toBeNull()
    expect(getDialog()).toHaveAccessibleDescription('Only description')
    await user.click(getButton('Cancel'))
    await second
  })
})

describe('provider', () => {
  it('keeps confirm stable and does not re-render consumers on dialog activity', async () => {
    const user = userEvent.setup()
    let consumerRenders = 0

    function Consumer() {
      useConfirm()
      consumerRenders += 1
      return <span>consumer</span>
    }

    const { confirm, api, rerenderWithDefaults } = renderWithProvider({
      children: <Consumer />,
      strictMode: false
    })
    const rendersBefore = consumerRenders
    const confirmBefore = api()

    const promise = confirm({ title: 'T', description: 'D' })
    await user.click(getButton('Cancel'))
    await promise
    act(() => {
      api().updateConfig({ title: 'Changed' })
    })

    expect(consumerRenders).toBe(rendersBefore)

    // A new defaultOptions object must not produce a new confirm function.
    rerenderWithDefaults({ confirmText: 'Sure' })
    expect(api()).toBe(confirmBefore)
    void confirm({ title: 'T', description: 'D' })
    expect(getButton('Sure')).toBeInTheDocument()
  })

  it('exposes updateConfig on the confirm function', () => {
    const { api } = renderWithProvider()
    expect(typeof api().updateConfig).toBe('function')
  })

  it('throws when useConfirm is used outside of a provider', () => {
    function Consumer() {
      useConfirm()
      return null
    }

    expect(() => render(<Consumer />)).toThrow(
      'useConfirm must be used within a ConfirmDialogProvider'
    )
    // React reports the uncaught render error through console.error.
    consoleError.mockClear()
  })
})
