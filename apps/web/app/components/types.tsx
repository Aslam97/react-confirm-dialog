'use client'

import React from 'react'
import { CodeBlock } from './code-block'
import { Button } from './ui/button'
import {
  ConfirmOptions,
  CustomActionsProps,
  useConfirm
} from '@omit/react-confirm-dialog'
import { AlertTriangle } from 'lucide-react'
import { DeleteRepository } from './delete-repo-example'
import { CircleFadingPlusIcon } from 'lucide-react'
import { BluetoothIcon } from 'lucide-react'
import { Trash2Icon } from 'lucide-react'

export const Types = () => {
  const confirm = useConfirm()
  const [activeType, setActiveType] = React.useState(allTypes[0])

  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h2 className="text-base font-medium">Confirm Dialog Types</h2>
        <p className="text-sm">
          Explore various customization options for the confirm dialog. Click on
          each type to see it in action and view the corresponding code.
        </p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {allTypes.map((type) => (
          <Button
            variant="outline"
            data-active={activeType.name === type.name}
            onClick={async () => {
              if (type?.action) {
                const res = await type.action(confirm)
                console.log(res)
              }
              setActiveType(type)
            }}
            key={type.name}
          >
            {type.name}
          </Button>
        ))}

        <DeleteRepository
          activeType={activeType}
          setActiveType={setActiveType}
        />
      </div>
      <CodeBlock>{activeType.snippet}</CodeBlock>
    </div>
  )
}

const allTypes = [
  {
    name: 'Default',
    snippet: `const confirm = useConfirm()

const result = await confirm({
  title: 'Confirm Action',
  description: 'This action cannot be undone. This will permanently delete your account from our servers.',
})

console.log(result ? 'Confirmed' : 'Canceled')`,
    action: async (confirm: (options: ConfirmOptions) => Promise<boolean>) =>
      confirm({
        title: 'Confirm Action',
        description:
          'This action cannot be undone. This will permanently delete your account from our servers.'
      })
  },
  {
    name: 'Small',
    snippet: `await confirm({
  title: 'Allow accessory to connect?',
  description: 'Do you want to allow the USB accessory to connect to this device?',
  confirmText: 'Allow',
  cancelText: 'Don\'t Allow',
  alertDialogContent: { size: 'sm' }
})`,
    action: (confirm: (options: ConfirmOptions) => Promise<boolean>) =>
      confirm({
        title: 'Allow accessory to connect?',
        description:
          'Do you want to allow the USB accessory to connect to this device?',
        confirmText: 'Allow',
        cancelText: "Don't Allow",
        alertDialogContent: { size: 'sm' }
      })
  },
  {
    name: 'Media',
    snippet: `await confirm({
    title: 'Share this project?',
    description:
      'Anyone with the link will be able to view and edit this project.',
    media: <CircleFadingPlusIcon />,
    confirmText: 'Share',
    cancelText: 'Cancel'
})`,
    action: (confirm: (options: ConfirmOptions) => Promise<boolean>) =>
      confirm({
        title: 'Share this project?',
        description:
          'Anyone with the link will be able to view and edit this project.',
        media: <CircleFadingPlusIcon />,
        confirmText: 'Share',
        cancelText: 'Cancel'
      })
  },
  {
    name: 'Small with Media',
    snippet: `await confirm({
  title: 'Allow accessory to connect?',
  description:
    'Do you want to allow the USB accessory to connect to this device?',
  media: <BluetoothIcon />,
  confirmText: 'Allow',
  cancelText: "Don't Allow",
  alertDialogContent: { size: 'sm' }
})`,
    action: (confirm: (options: ConfirmOptions) => Promise<boolean>) =>
      confirm({
        title: 'Allow accessory to connect?',
        description:
          'Do you want to allow the USB accessory to connect to this device?',
        media: <BluetoothIcon />,
        confirmText: 'Allow',
        cancelText: "Don't Allow",
        alertDialogContent: { size: 'sm' }
      })
  },
  {
    name: 'Warning',
    snippet: `await confirm({
  title: 'Warning',
  description: 'This action may have consequences.',
  icon: <AlertTriangle className="size-4 text-yellow-500" />,
  confirmButton: {
    className: 'bg-yellow-500 hover:bg-yellow-600 text-white'
  },
  alertDialogTitle: {
    className: 'flex items-center gap-2'
  }
})`,
    action: (confirm: (options: ConfirmOptions) => Promise<boolean>) =>
      confirm({
        title: 'Warning',
        description: 'This action may have consequences.',
        icon: <AlertTriangle className="size-4 text-yellow-500" />,
        confirmButton: {
          className: 'bg-yellow-500 hover:bg-yellow-600 text-white'
        },
        alertDialogTitle: {
          className: 'flex items-center gap-2'
        }
      })
  },
  {
    name: 'Destructive',
    snippet: `await confirm({
  title: 'Delete Chat',
  description: (
    <span>
      This will permanently delete this chat conversation. View{' '}
      <a href="#">Settings</a> to delete any memories saved during this
      chat.
    </span>
  ),
  media: <Trash2Icon />,
  confirmText: 'Delete',
  cancelText: 'Cancel',
  cancelButton: {
    variant: 'outline'
  },
  confirmButton: {
    variant: 'destructive'
  },
  alertDialogContent: { size: 'sm' },
  alertDialogMedia: {
    className:
      'bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive'
  }
})`,
    action: (confirm: (options: ConfirmOptions) => Promise<boolean>) =>
      confirm({
        title: 'Delete Chat',
        description: (
          <span>
            This will permanently delete this chat conversation. View{' '}
            <a href="#">Settings</a> to delete any memories saved during this
            chat.
          </span>
        ),
        media: <Trash2Icon />,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        cancelButton: {
          variant: 'outline'
        },
        confirmButton: {
          variant: 'destructive'
        },
        alertDialogContent: { size: 'sm' },
        alertDialogMedia: {
          className:
            'bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive'
        }
      })
  },
  {
    name: 'Custom Actions',
    snippet: `await confirm({
  title: 'Custom Actions',
  description: 'This dialog has custom action buttons.',
  customActions: (onConfirm, onCancel) => (
    <>
      <Button onClick={onCancel} variant="outline">
        No, thanks
      </Button>
      <Button onClick={onConfirm} variant="default">
        Yes, please
      </Button>
      <Button
        onClick={() => {
          console.log('Custom action')
          onCancel()
        }}
        variant="secondary"
      >
        Maybe later
      </Button>
    </>
  )
})`,
    action: (confirm: (options: ConfirmOptions) => Promise<boolean>) =>
      confirm({
        title: 'Custom Actions',
        description: 'This dialog has custom action buttons.',
        customActions: ({ confirm, cancel }: CustomActionsProps) => (
          <>
            <Button onClick={cancel} variant="outline">
              No, thanks
            </Button>
            <Button onClick={confirm} variant="default">
              Yes, please
            </Button>
            <Button
              onClick={() => {
                console.log('Custom action')
                confirm()
              }}
              variant="secondary"
            >
              Maybe later
            </Button>
          </>
        )
      })
  },
  {
    name: 'Custom Styling',
    snippet: `await confirm({
  title: 'Custom Styling',
  description: 'This dialog has custom styles applied.',
  alertDialogContent: { className: 'border-2 border-indigo-500 bg-indigo-50' },
  alertDialogHeader: { className: 'bg-indigo-100' },
  alertDialogFooter: { className: 'bg-indigo-100' },
  alertDialogTitle: { className: 'text-indigo-700' },
  alertDialogDescription: { className: 'text-indigo-600' },
})`,
    action: (confirm: (options: ConfirmOptions) => Promise<boolean>) => {
      confirm({
        title: 'Custom Styling',
        description: 'This dialog has custom styles applied.',
        alertDialogContent: {
          className: 'border-2 border-indigo-500 bg-indigo-50'
        },
        alertDialogHeader: { className: 'bg-indigo-100' },
        alertDialogFooter: { className: 'bg-indigo-100' },
        alertDialogTitle: { className: 'text-indigo-700' },
        alertDialogDescription: { className: 'text-indigo-600' }
      })
    }
  },
  // Without cancel button
  {
    name: 'No Cancel Button',
    snippet: `await confirm({
  title: 'Are you sure?',
  description: 'This action cannot be undone.',
  cancelButton: null,
  confirmText: 'Yes, do it'
})`,
    action: (confirm: (options: ConfirmOptions) => Promise<boolean>) =>
      confirm({
        title: 'Are you sure?',
        description: 'This action cannot be undone.',
        cancelButton: null,
        confirmText: 'Yes, do it'
      })
  },
  // Without cancel button and small size
  {
    name: 'No Cancel Button + Small',
    snippet: `await confirm({
  title: 'Are you sure?',
  description: 'This action cannot be undone.',
  cancelButton: null,
  confirmText: 'Yes, do it',
  alertDialogContent: { size: 'sm' }
})`,
    action: (confirm: (options: ConfirmOptions) => Promise<boolean>) =>
      confirm({
        title: 'Are you sure?',
        description: 'This action cannot be undone.',
        cancelButton: null,
        confirmText: 'Yes, do it',
        alertDialogContent: { size: 'sm' },
        alertDialogFooter: {
          className: 'group-data-[size=sm]/alert-dialog-content:grid-cols-1'
        }
      })
  }
]
