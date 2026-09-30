import * as React from 'react'
import { act, render, screen } from '@testing-library/react'
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

import { ConfirmDialogProvider, useConfirm } from '@omit/react-confirm-dialog'

type ConfirmApi = ReturnType<typeof useConfirm>

function Harness({ onReady }: { onReady: (api: ConfirmApi) => void }) {
  const api = useConfirm()
  React.useEffect(() => {
    onReady(api)
  }, [api, onReady])
  return <span>child</span>
}

function setup() {
  let api: ConfirmApi | undefined
  const view = render(
    <React.StrictMode>
      <ConfirmDialogProvider>
        <Harness
          onReady={(value) => {
            api = value
          }}
        />
      </ConfirmDialogProvider>
    </React.StrictMode>
  )
  if (!api) {
    throw new Error('useConfirm was not rendered')
  }
  const confirm = api
  return { ...view, confirm }
}

const PENDING = Symbol('pending')
const outcome = (promise: Promise<boolean>) =>
  Promise.race([
    promise,
    new Promise<typeof PENDING>((resolve) => {
      setTimeout(() => resolve(PENDING), 0)
    })
  ])

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

describe('robustness', () => {
  it('survives many open/close cycles and settles every promise exactly as answered', async () => {
    const user = userEvent.setup()
    const { confirm } = setup()
    const results: boolean[] = []

    for (let i = 0; i < 40; i += 1) {
      let promise!: Promise<boolean>
      act(() => {
        promise = confirm({ title: `Dialog ${i}`, description: 'D' })
      })
      await user.click(
        screen.getByRole('button', { name: i % 2 === 0 ? 'Confirm' : 'Cancel' })
      )
      results.push(await promise)
    }

    expect(results).toEqual(Array.from({ length: 40 }, (_, i) => i % 2 === 0))
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('restores body pointer-events and scroll after the dialog closes', async () => {
    const user = userEvent.setup()
    const { confirm } = setup()

    let promise!: Promise<boolean>
    act(() => {
      promise = confirm({ title: 'T', description: 'D' })
    })
    expect(document.body.style.pointerEvents).toBe('none')

    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    await promise

    expect(document.body.style.pointerEvents).toBe('')
    expect(document.body.style.overflow).toBe('')
    expect(document.body.getAttribute('data-scroll-locked')).toBeNull()
  })

  it('a double click on confirm resolves once with true and does not throw', async () => {
    const user = userEvent.setup()
    const { confirm } = setup()

    let promise!: Promise<boolean>
    act(() => {
      promise = confirm({ title: 'T', description: 'D' })
    })
    await user.dblClick(screen.getByRole('button', { name: 'Confirm' }))

    await expect(promise).resolves.toBe(true)
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('keeps the promise pending (never rejects) when the provider unmounts with an open dialog', async () => {
    const { confirm, unmount } = setup()

    let promise!: Promise<boolean>
    act(() => {
      promise = confirm({ title: 'T', description: 'D' })
    })
    unmount()

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(document.body.style.pointerEvents).toBe('')
    expect(await outcome(promise)).toBe(PENDING)
  })

  it('hydrates server-rendered markup without mismatch warnings', async () => {
    const { renderToString } = await import('react-dom/server')
    const { hydrateRoot } = await import('react-dom/client')

    const tree = (
      <ConfirmDialogProvider>
        <p>hydrated</p>
      </ConfirmDialogProvider>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(tree)
    document.body.appendChild(container)
    // Rendering to a string inside jsdom is not a real server: Radix sees a
    // `document` and uses the real useLayoutEffect, which React 18 reports
    // during renderToString. Real SSR (no document) is covered by ssr.test.tsx.
    consoleError.mock.calls = consoleError.mock.calls.filter(
      (call) =>
        !String(call[0]).includes('useLayoutEffect does nothing on the server')
    )

    let root: ReturnType<typeof hydrateRoot> | undefined
    await act(async () => {
      root = hydrateRoot(container, tree)
      await Promise.resolve()
    })
    expect(container).toHaveTextContent('hydrated')

    await act(async () => {
      root?.unmount()
      await Promise.resolve()
    })
    container.remove()
  })
})
