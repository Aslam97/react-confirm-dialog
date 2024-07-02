'use client'

import { ConfirmDialogProvider, ConfirmOptions } from '@omit/confirm-dialog'

interface Props {
  children: React.ReactNode
  defaultOptions?: Partial<ConfirmOptions>
}

const ConfirmWrapper = ({ children, defaultOptions = {} }: Props) => {
  return (
    <ConfirmDialogProvider defaultOptions={defaultOptions}>
      {children}
    </ConfirmDialogProvider>
  )
}

export default ConfirmWrapper
