import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useContext,
  createContext,
  memo
} from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import type {
  AlertDialogCancelProps,
  AlertDialogActionProps
} from '@/components/ui/alert-dialog'

export interface ConfirmOptions {
  title?: React.ReactNode
  description?: React.ReactNode
  confirmButton?: AlertDialogActionProps
  cancelButton?: AlertDialogCancelProps | null
  confirmText?: string
  cancelText?: string
  icon?: React.ReactNode
  customActions?: (
    onConfirm: () => void,
    onCancel: () => void
  ) => React.ReactNode
  alertDialogOverlay?: React.ComponentPropsWithoutRef<typeof AlertDialogOverlay>
  alertDialogContent?: React.ComponentPropsWithoutRef<typeof AlertDialogContent>
  alertDialogHeader?: React.ComponentPropsWithoutRef<typeof AlertDialogHeader>
  alertDialogTitle?: React.ComponentPropsWithoutRef<typeof AlertDialogTitle>
  alertDialogDescription?: React.ComponentPropsWithoutRef<
    typeof AlertDialogDescription
  >
  alertDialogFooter?: React.ComponentPropsWithoutRef<typeof AlertDialogFooter>
}

export interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>
}

export const ConfirmContext = createContext<ConfirmContextType | undefined>(
  undefined
)

const baseDefaultOptions: ConfirmOptions = {
  title: '',
  description: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  confirmButton: {},
  cancelButton: {},
  alertDialogContent: {},
  alertDialogHeader: {},
  alertDialogTitle: {},
  alertDialogDescription: {},
  alertDialogFooter: {}
}

const ConfirmDialogContent: React.FC<{
  config: ConfirmOptions
  onConfirm: () => void
  onCancel: () => void
}> = memo(({ config, onConfirm, onCancel }) => {
  const {
    title,
    description,
    cancelButton,
    confirmButton,
    confirmText,
    cancelText,
    icon,
    customActions,
    alertDialogOverlay,
    alertDialogContent,
    alertDialogHeader,
    alertDialogTitle,
    alertDialogDescription,
    alertDialogFooter
  } = config

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay {...alertDialogOverlay} />
      <AlertDialogContent {...alertDialogContent}>
        <AlertDialogHeader {...alertDialogHeader}>
          {(title || icon) && (
            <AlertDialogTitle {...alertDialogTitle}>
              {icon}
              {title}
            </AlertDialogTitle>
          )}
          {description && (
            <AlertDialogDescription {...alertDialogDescription}>
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter {...alertDialogFooter}>
          {customActions ? (
            customActions(onConfirm, onCancel)
          ) : (
            <>
              {cancelButton !== null && (
                <AlertDialogCancel onClick={onCancel} {...cancelButton}>
                  {cancelText}
                </AlertDialogCancel>
              )}
              <AlertDialogAction onClick={onConfirm} {...confirmButton}>
                {confirmText}
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogPortal>
  )
})

ConfirmDialogContent.displayName = 'ConfirmDialogContent'

const ConfirmDialog: React.FC<{
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  config: ConfirmOptions
  onConfirm: () => void
  onCancel: () => void
}> = memo(({ isOpen, onOpenChange, config, onConfirm, onCancel }) => (
  <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
    <ConfirmDialogContent
      config={config}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  </AlertDialog>
))

ConfirmDialog.displayName = 'ConfirmDialog'

export const ConfirmDialogProvider: React.FC<{
  defaultOptions?: ConfirmOptions
  children: React.ReactNode
}> = ({ defaultOptions = {}, children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions>(baseDefaultOptions)
  const resolverRef = useRef<((value: boolean) => void) | null>(null)

  const mergedDefaultOptions = useMemo(
    () => ({
      ...baseDefaultOptions,
      ...defaultOptions
    }),
    [defaultOptions]
  )

  const confirm = useCallback(
    (newOptions: ConfirmOptions) => {
      setOptions({ ...mergedDefaultOptions, ...newOptions })
      setIsOpen(true)
      return new Promise<boolean>((resolve) => {
        resolverRef.current = resolve
      })
    },
    [mergedDefaultOptions]
  )

  const handleConfirm = useCallback(() => {
    setIsOpen(false)
    if (resolverRef.current) resolverRef.current(true)
  }, [])

  const handleCancel = useCallback(() => {
    setIsOpen(false)
    if (resolverRef.current) resolverRef.current(false)
  }, [])

  const contextValue = useMemo(() => ({ confirm }), [confirm])

  return (
    <ConfirmContext.Provider value={contextValue}>
      {children}
      <ConfirmDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        config={options}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  )
}

export const useConfirm = (): ((
  options: ConfirmOptions
) => Promise<boolean>) => {
  const context = useContext(ConfirmContext)
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmDialogProvider')
  }
  return context.confirm
}
