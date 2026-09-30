import type { ConfirmOptions } from '@omit/react-confirm-dialog'

export type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>

/** One entry of the "Confirm Dialog Types" showcase. */
export interface DialogType {
  name: string
  snippet: string
  /** Opens the dialog and resolves with the user's answer. */
  action: (confirm: ConfirmFn) => Promise<boolean>
}
