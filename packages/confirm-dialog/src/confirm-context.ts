import * as React from 'react'
import type { ConfirmContextType } from './types'

export const ConfirmContext = React.createContext<
  ConfirmContextType | undefined
>(undefined)
