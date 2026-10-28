import { useConfirm } from '@omit/react-confirm-dialog'

/** Compile-time contract check; this file is included by package type-check. */
export function confirmRequestRequiresTitle(
  confirm: ReturnType<typeof useConfirm>
) {
  // @ts-expect-error A confirm request needs a title for an accessible name.
  void confirm({ description: 'This request has no accessible name.' })
  void confirm({
    title: 'Confirm action',
    description: 'This request is labeled.'
  })
}
