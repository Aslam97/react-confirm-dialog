import * as React from 'react'
import { ConfirmContext } from './confirm-context'

export const useConfirm = () => {
  const context = React.useContext(ConfirmContext)

  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmDialogProvider')
  }

  return context.confirm
}
