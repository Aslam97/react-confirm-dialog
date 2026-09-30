'use client'

import { CodeBlock } from './code-block'

export const Usage = () => {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-base font-medium">Usage</h2>
        <p className="text-sm">
          Render the <strong>ConfirmDialogProvider</strong> at the root of your
          application. The package is marked as a client module, so it can be
          rendered directly from a Next.js server layout.
        </p>
      </div>
      <CodeBlock initialHeight={270}>{`// app/layout.tsx
import { ConfirmDialogProvider } from '@omit/react-confirm-dialog'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ConfirmDialogProvider
          defaultOptions={{ confirmText: 'Confirm', cancelText: 'Cancel' }}
        >
          {children}
        </ConfirmDialogProvider>
      </body>
    </html>
  )
}

// any client component
'use client'

import { useConfirm } from '@omit/react-confirm-dialog'

export function DeleteButton() {
  const confirm = useConfirm()

  const handleClick = async () => {
    const confirmed = await confirm({
      title: 'Delete item?',
      description: 'This action cannot be undone.'
    })

    if (confirmed) {
      // ...
    }
  }

  return <button onClick={handleClick}>Delete</button>
}`}</CodeBlock>
    </div>
  )
}
