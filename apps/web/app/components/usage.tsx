'use client'

import { CodeBlock } from './code-block'

export const Usage = () => {
  return (
    <div className="space-y-3">
      <span>
        <h2 className="text-base font-medium">Usage</h2>
        <p className="text-sm">
          Render the <strong>ConfirmDialogProvider</strong> at the root of your
          application.
        </p>
      </span>
      <CodeBlock initialHeight={270}>{`// confirm-dialog-provider.tsx
'use client'

import {
  ConfirmDialogProvider as BaseConfirmDialogProvider,
  ConfirmOptions
} from '@omit/react-confirm-dialog'

interface Props {
  children: React.ReactNode
  defaultOptions?: ConfirmOptions
}

export const ConfirmDialogProvider = ({ children, defaultOptions }: Props) => {
  return (
    <BaseConfirmDialogProvider defaultOptions={defaultOptions}>
      {children}
    </BaseConfirmDialogProvider>
  )
}

export default ConfirmDialogProvider

// layout.tsx
import { ConfirmDialogProvider } from '@/confirm-dialog-provider'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ConfirmDialogProvider>
          {children}
        </ConfirmDialogProvider>
      </body>
    </html>
  )
}`}</CodeBlock>
    </div>
  )
}
