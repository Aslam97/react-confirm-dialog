'use client'

import {
  ConfirmDialogProvider,
  ConfirmOptions
} from '@omit/react-confirm-dialog'

interface Props {
  children: React.ReactNode
  defaultOptions?: ConfirmOptions
}

export const ConfirmWrapper = ({ children, defaultOptions }: Props) => {
  return (
    <ConfirmDialogProvider defaultOptions={defaultOptions}>
      {children}
    </ConfirmDialogProvider>
  )
}

export default ConfirmWrapper
