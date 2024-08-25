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
      <CodeBlock initialHeight={270}>{`// confirm-wrapper.tsx
'use client'

import {
  ConfirmDialogProvider,
  ConfirmOptions
} from '@omit/react-confirm-dialog'

interface Props {
  children: React.ReactNode
  defaultOptions?: ConfirmOptions
}

const ConfirmWrapper = ({ children, defaultOptions }: Props) => {
  return (
    <ConfirmDialogProvider defaultOptions={defaultOptions}>
      {children}
    </ConfirmDialogProvider>
  )
}

export default ConfirmWrapper

// layout.tsx
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ConfirmDialogWrapper>{children}</ConfirmDialogWrapper>
      </body>
    </html>
  )
}`}</CodeBlock>
    </div>
  )
}
