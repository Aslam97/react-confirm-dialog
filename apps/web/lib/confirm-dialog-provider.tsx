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
