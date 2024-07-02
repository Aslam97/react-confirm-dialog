'use client'

import { useConfirm } from '@omit/react-confirm-dialog'

export const ConfirmComp = () => {
  const confirm = useConfirm()

  const handleClick = async () => {
    await confirm({ title: 'Hello', description: 'Are you sure?' })
  }

  return (
    <div className="max-w-7xl mx-auto flex justify-center">
      <button onClick={handleClick}>
        <strong>Click me</strong>
      </button>
    </div>
  )
}
