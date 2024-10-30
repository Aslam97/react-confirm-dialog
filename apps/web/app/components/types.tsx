'use client'

import React from 'react'
import { CodeBlock } from './code-block'
import { Button } from './ui/button'
import { ConfirmOptions, useConfirm } from '@omit/react-confirm-dialog'
import { Info, CheckCircle, AlertTriangle, Trash } from 'lucide-react'

export const Types = () => {
  const confirm = useConfirm()
  const [activeType, setActiveType] = React.useState(allTypes[0])

  return (
    <div className="space-y-3">
      <span>
        <h2 className="text-base font-medium">Confirm Dialog Types</h2>
        <p className="text-sm">
          Explore various customization options for the confirm dialog. Click on
          each type to see it in action and view the corresponding code.
        </p>
      </span>
      <div className="flex items-center gap-2 flex-wrap">
        {allTypes.map((type) => (
          <Button
            variant="outline"
            data-active={activeType.name === type.name}
            onClick={() => {
              if (type?.action) {
                type.action(confirm)
              }
              setActiveType(type)
            }}
            key={type.name}
          >
            {type.name}
          </Button>
        ))}
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
  description: 'Are you sure you want to proceed?',
})

console.log(result ? 'Confirmed' : 'Canceled')`,
    action: async (confirm: (options: ConfirmOptions) => Promise<boolean>) => {
      const result = await confirm({
        title: 'Confirm Action',
        description: 'Are you sure you want to proceed?'
      })
      console.log(result ? 'Confirmed' : 'Canceled')
    }
  },
  {
    name: 'Custom Buttons',
    snippet: `await confirm({
  title: 'Custom Buttons',
  description: 'This dialog has custom button text and styles.',
  confirmText: 'Proceed',
  cancelText: 'Go Back',
  confirmButton: {
    className: 'bg-green-500 hover:bg-green-600 text-white'
  },
  cancelButton: {
    className: 'border-red-500 text-destructive hover:bg-red-50'
  }
})`,
    action: (confirm: (options: ConfirmOptions) => Promise<boolean>) => {
      confirm({
        title: 'Custom Buttons',
        description: 'This dialog has custom button text and styles.',
        confirmText: 'Proceed',
        cancelText: 'Go Back',
        confirmButton: {
          className: 'bg-green-500 hover:bg-green-600 text-white'
        },
        cancelButton: {
          className: 'border-red-500 text-destructive hover:bg-red-50'
        }
      })
    }
  },
  {
    name: 'With Icon',
    snippet: `await confirm({
  title: 'Information',
  description: 'This is an important message.',
  icon: <Info className="size-4 text-blue-500" />,
  alertDialogTitle: {
    className: 'flex items-center gap-2'
  }
})`,
    action: (confirm: (options: ConfirmOptions) => Promise<boolean>) => {
      confirm({
        title: 'Information',
        description: 'This is an important message.',
        icon: <Info className="size-4 text-blue-500" />,
        alertDialogTitle: {
          className: 'flex items-center gap-2'
        }
      })
    }
  },
  {
    name: 'Success',
    snippet: `await confirm({
  title: 'Success!',
  description: 'Your action was completed successfully.',
  icon: <CheckCircle className="size-4 text-green-500" />,
  confirmText: 'Great',
  cancelButton: null, // Hide cancel button
  alertDialogTitle: {
    className: 'flex items-center gap-2'
  }
})`,
    action: (confirm: (options: ConfirmOptions) => Promise<boolean>) => {
      confirm({
        title: 'Success!',
        description: 'Your action was completed successfully.',
        icon: <CheckCircle className="size-4 text-green-500" />,
        confirmText: 'Great',
        cancelButton: null, // Hide cancel button
        alertDialogTitle: {
          className: 'flex items-center gap-2'
        }
      })
    }
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
    action: (confirm: (options: ConfirmOptions) => Promise<boolean>) => {
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
    }
  },
  {
    name: 'Delete',
    snippet: `await confirm({
  title: 'Delete Item',
  description: 'Are you sure? This action cannot be undone.',
  icon: <Trash className="size-4 text-destructive" />,
  confirmText: 'Delete',
  cancelText: 'Cancel',
  cancelButton: {
    size: 'default',
    variant: 'outline'
  },
  confirmButton: {
    className: 'bg-red-500 hover:bg-red-600 text-white'
  },
  alertDialogTitle: {
    className: 'flex items-center gap-2'
  }
})`,
    action: (confirm: (options: ConfirmOptions) => Promise<boolean>) => {
      confirm({
        title: 'Delete Item',
        description: 'Are you sure? This action cannot be undone.',
        icon: <Trash className="size-4 text-destructive" />,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        cancelButton: {
          size: 'default',
          variant: 'outline'
        },
        confirmButton: {
          className: 'bg-red-500 hover:bg-red-600 text-white'
        },
        alertDialogTitle: {
          className: 'flex items-center gap-2'
        }
      })
    }
  },
  {
    name: 'Text Confirmation',
    snippet: `await confirm({
  title: 'Confirm Deletion',
  description: 'This action is irreversible. Please type "delete" to confirm.',
  enableConfirmationText: 'delete',
  enableConfirmationTextPlaceholder:
    'Type "delete" to enable the confirm button',
  confirmText: 'Delete Permanently',
  confirmButton: {
    className: 'bg-red-500 hover:bg-red-600 text-white'
  }
})`,
    action: (confirm: (options: ConfirmOptions) => Promise<boolean>) => {
      confirm({
        title: 'Confirm Deletion',
        description: 'This action is irreversible. Please type "delete" to confirm.',
        enableConfirmationText: 'delete',
        enableConfirmationTextPlaceholder:
          'Type "delete" to enable the confirm button',
        confirmText: 'Delete Permanently',
        confirmButton: {
          className: 'bg-red-500 hover:bg-red-600 text-white'
        }
      })
    }
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
    action: (confirm: (options: ConfirmOptions) => Promise<boolean>) => {
      confirm({
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
      })
    }
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
  }
]
