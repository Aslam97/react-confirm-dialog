import React from 'react'
import { Trash2 } from 'lucide-react'
import { ConfirmOptions, useConfirm } from '@omit/react-confirm-dialog'
import { Button } from './ui/button'
import { Input } from '@/components/ui/input'

const REPOSITORY_NAME = 'Aslam97/example'
const SNIPPET = `const REPOSITORY_NAME = 'Aslam97/example'

interface DeleteConfirmContentProps {
  onValueChange: (disabled: boolean) => void
}

const DeleteConfirmContent: React.FC<DeleteConfirmContentProps> = ({
  onValueChange
}) => {
  const [value, setValue] = React.useState('')

  React.useEffect(() => {
    onValueChange(value !== REPOSITORY_NAME)
  }, [value, onValueChange])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">
        To confirm, type &quot;{REPOSITORY_NAME}&quot; in the box below
      </p>
      <Input
        value={value}
        onChange={handleInputChange}
        placeholder="Enter repository name"
        autoComplete="off"
      />
    </div>
  )
}

const getConfirmationConfig = (onValueChange: (disabled: boolean) => void) => ({
  icon: <Trash2 className="size-4 text-destructive" />,
  title: 'Delete Repository',
  alertDialogTitle: {
    className: 'flex items-center gap-2'
  },
  description: (
    <span>
      This action cannot be undone. This will permanently delete{' '}
      <strong>{REPOSITORY_NAME}</strong> repository and all of its contents. Do
      you want to proceed?
    </span>
  ),
  contentSlot: <DeleteConfirmContent onValueChange={onValueChange} />,
  confirmText: 'Delete this repository',
  cancelText: 'Cancel',
  confirmButton: {
    variant: 'destructive' as const,
    className: 'w-full sm:w-auto'
  },
  cancelButton: {
    variant: 'outline' as const,
    className: 'w-full sm:w-auto'
  },
  alertDialogContent: {
    className: 'max-w-xl'
  }
})

export const DeleteRepository: React.FC = () => {
  const confirm = useConfirm()

  const handleDelete = async () => {
    const confirmConfig = getConfirmationConfig((disabled) => {
      confirm.updateConfig((prev) => ({
        ...prev,
        confirmButton: { ...prev.confirmButton, disabled }
      }))
    })

    const isConfirmed = await confirm(confirmConfig)

    if (isConfirmed) {
      console.log('Repository deleted successfully')
    } else {
      console.log('Deletion canceled')
    }
  }

  const handleButtonClick = () => {
    handleDelete()
  }

  return (
    <Button
      variant="outline"
      onClick={handleButtonClick}
    >
      Delete Repository
    </Button>
  )
}`

interface ActiveType {
  name: string
  snippet: string
  action: (confirm: (options: ConfirmOptions) => Promise<boolean>) => void
}

interface DeleteRepositoryProps {
  activeType: ActiveType
  setActiveType: React.Dispatch<React.SetStateAction<ActiveType>>
}

interface DeleteConfirmContentProps {
  onValueChange: (disabled: boolean) => void
}

const DeleteConfirmContent: React.FC<DeleteConfirmContentProps> = ({
  onValueChange
}) => {
  const [value, setValue] = React.useState('')

  React.useEffect(() => {
    onValueChange(value !== REPOSITORY_NAME)
  }, [value, onValueChange])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">
        To confirm, type &quot;{REPOSITORY_NAME}&quot; in the box below
      </p>
      <Input
        value={value}
        onChange={handleInputChange}
        placeholder="Enter repository name"
        autoComplete="off"
      />
    </div>
  )
}

const getConfirmationConfig = (onValueChange: (disabled: boolean) => void) => ({
  icon: <Trash2 className="size-4 text-destructive" />,
  title: 'Delete Repository',
  alertDialogTitle: {
    className: 'flex items-center gap-2'
  },
  description: (
    <span>
      This action cannot be undone. This will permanently delete{' '}
      <strong>{REPOSITORY_NAME}</strong> repository and all of its contents. Do
      you want to proceed?
    </span>
  ),
  contentSlot: <DeleteConfirmContent onValueChange={onValueChange} />,
  confirmText: 'Delete this repository',
  cancelText: 'Cancel',
  confirmButton: {
    variant: 'destructive' as const,
    className: 'w-full sm:w-auto'
  },
  cancelButton: {
    variant: 'outline' as const,
    className: 'w-full sm:w-auto'
  },
  alertDialogContent: {
    className: 'max-w-xl'
  }
})

export const DeleteRepository: React.FC<DeleteRepositoryProps> = ({
  activeType,
  setActiveType
}) => {
  const confirm = useConfirm()

  const handleDelete = async () => {
    const confirmConfig = getConfirmationConfig((disabled) => {
      confirm.updateConfig((prev) => ({
        ...prev,
        confirmButton: { ...prev.confirmButton, disabled }
      }))
    })

    const isConfirmed = await confirm(confirmConfig)

    if (isConfirmed) {
      console.log('Repository deleted successfully')
    } else {
      console.log('Deletion canceled')
    }
  }

  const handleButtonClick = () => {
    handleDelete()
    setActiveType({
      name: 'Delete Repository',
      snippet: SNIPPET,
      action: handleDelete
    })
  }

  return (
    <Button
      variant="outline"
      data-active={activeType.name === 'Delete Repository'}
      onClick={handleButtonClick}
    >
      Delete Repository
    </Button>
  )
}
