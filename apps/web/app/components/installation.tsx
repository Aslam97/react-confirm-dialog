'use client'

import { CopyFeedbackIcon, useCopyFeedback } from './copy-feedback'

const INSTALL_COMMAND = 'npm install @omit/react-confirm-dialog'

export const Installation = () => {
  const { copied, copy } = useCopyFeedback(INSTALL_COMMAND)

  return (
    <div className="space-y-3">
      <h2 className="text-base font-medium">Installation</h2>
      <button
        type="button"
        onClick={copy}
        className="relative flex h-10 w-full cursor-copy items-center rounded-md border bg-muted p-0 pr-16 pl-3 text-left font-mono text-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden"
      >
        <code>{INSTALL_COMMAND}</code>
        <span className="sr-only" aria-live="polite">
          {copied ? 'Copied to clipboard' : 'Copy to clipboard'}
        </span>
        <span
          className="absolute top-1/2 right-1.5 flex size-6 -translate-y-1/2 items-center justify-center rounded-md"
          aria-hidden="true"
        >
          <CopyFeedbackIcon copied={copied} />
        </span>
      </button>
    </div>
  )
}
