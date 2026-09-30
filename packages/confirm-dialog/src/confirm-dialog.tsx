import * as React from 'react'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import { useComposedRefs } from '@radix-ui/react-compose-refs'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'

export interface CustomActionsProps {
  confirm: () => void
  cancel: () => void
  config: ConfirmOptions
  setConfig: ConfigUpdater
}

export type ConfigUpdater = (
  config: ConfirmOptions | ((prev: ConfirmOptions) => ConfirmOptions)
) => void

export type LegacyCustomActions = (
  onConfirm: () => void,
  onCancel: () => void
) => ReactNode

export type EnhancedCustomActions = (props: CustomActionsProps) => ReactNode

export interface ConfirmOptions {
  title?: ReactNode
  description?: ReactNode
  contentSlot?: ReactNode
  confirmText?: string
  cancelText?: string
  icon?: ReactNode
  media?: ReactNode
  customActions?: LegacyCustomActions | EnhancedCustomActions
  confirmButton?: ComponentPropsWithRef<typeof AlertDialogAction>
  cancelButton?: ComponentPropsWithRef<typeof AlertDialogCancel> | null
  alertDialogOverlay?: ComponentPropsWithRef<typeof AlertDialogOverlay>
  alertDialogContent?: ComponentPropsWithRef<typeof AlertDialogContent>
  alertDialogHeader?: ComponentPropsWithRef<typeof AlertDialogHeader>
  alertDialogTitle?: ComponentPropsWithRef<typeof AlertDialogTitle>
  alertDialogMedia?: ComponentPropsWithRef<typeof AlertDialogMedia>
  alertDialogDescription?: ComponentPropsWithRef<typeof AlertDialogDescription>
  alertDialogFooter?: ComponentPropsWithRef<typeof AlertDialogFooter>
}

/**
 * @deprecated The provider no longer keeps the promise resolver in React
 * state. This type is only kept so existing imports keep compiling.
 */
export interface ConfirmDialogState {
  isOpen: boolean
  config: ConfirmOptions
  resolver: ((value: boolean) => void) | null
}

export interface ConfirmFunction {
  (options: ConfirmOptions): Promise<boolean>
  updateConfig?: ConfigUpdater
}

export interface ConfirmContextValue {
  confirm: ConfirmFunction
  updateConfig: ConfigUpdater
}

export interface ConfirmDialogProviderProps {
  defaultOptions?: ConfirmOptions
  children: ReactNode
}

export const ConfirmContext = React.createContext<
  ConfirmContextValue | undefined
>(undefined)
ConfirmContext.displayName = 'ConfirmContext'

const EMPTY_OPTIONS: ConfirmOptions = {}

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
  alertDialogMedia: {},
  alertDialogDescription: {},
  alertDialogFooter: {}
}

const TABBABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',')

type ButtonClickHandler = React.MouseEventHandler<HTMLButtonElement>

/**
 * Runs the consumer's handler first and only then the dialog's own handler,
 * unless the consumer called `event.preventDefault()`. This mirrors how Radix
 * composes its own close handler, so a consumer can keep the dialog open.
 */
function composeClickHandlers(
  theirs: ButtonClickHandler | undefined,
  ours: () => void
): ButtonClickHandler {
  return (event) => {
    theirs?.(event)
    if (!event.defaultPrevented) {
      ours()
    }
  }
}

/**
 * Supports both documented `customActions` signatures without relying on
 * `Function.length`: the first argument is the `confirm` callback carrying the
 * enhanced props as properties (so it can be destructured), the second one is
 * `cancel`.
 */
function renderCustomActions(
  customActions: LegacyCustomActions | EnhancedCustomActions,
  props: CustomActionsProps
): ReactNode {
  const confirmWithProps = Object.assign(() => props.confirm(), props)
  return customActions(confirmWithProps, props.cancel)
}

interface ConfirmDialogContentProps {
  config: ConfirmOptions
  onConfirm: () => void
  onCancel: () => void
  setConfig: ConfigUpdater
}

const ConfirmDialogContent = React.memo(function ConfirmDialogContent({
  config,
  onConfirm,
  onCancel,
  setConfig
}: ConfirmDialogContentProps) {
  const {
    title,
    description,
    cancelButton,
    confirmButton,
    confirmText,
    cancelText,
    icon,
    media,
    contentSlot,
    customActions,
    alertDialogOverlay,
    alertDialogContent,
    alertDialogHeader,
    alertDialogTitle,
    alertDialogMedia,
    alertDialogDescription,
    alertDialogFooter
  } = config

  const contentRef = React.useRef<HTMLDivElement>(null)
  const composedContentRef = useComposedRefs(
    contentRef,
    alertDialogContent?.ref
  )

  // Radix auto-focuses its own Cancel button when the dialog opens. When that
  // button is not rendered (hidden, disabled or replaced by custom actions)
  // focus would otherwise stay outside of the dialog, defeating the focus trap.
  const radixFocusesCancel =
    !customActions && cancelButton !== null && !cancelButton?.disabled

  const handleOpenAutoFocus = (event: Event) => {
    alertDialogContent?.onOpenAutoFocus?.(event)
    if (event.defaultPrevented || radixFocusesCancel) {
      return
    }
    event.preventDefault()
    const content = contentRef.current
    const target = content?.querySelector<HTMLElement>(TABBABLE_SELECTOR)
    ;(target ?? content)?.focus({ preventScroll: true })
  }

  const actions = customActions ? (
    renderCustomActions(customActions, {
      confirm: onConfirm,
      cancel: onCancel,
      config,
      setConfig
    })
  ) : (
    <>
      {cancelButton !== null ? (
        <AlertDialogCancel
          {...cancelButton}
          onClick={composeClickHandlers(cancelButton?.onClick, onCancel)}
        >
          {cancelText}
        </AlertDialogCancel>
      ) : null}
      <AlertDialogAction
        {...confirmButton}
        onClick={composeClickHandlers(confirmButton?.onClick, onConfirm)}
      >
        {confirmText}
      </AlertDialogAction>
    </>
  )

  const hasTitle = Boolean(title) || Boolean(icon)

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay {...alertDialogOverlay} />
      <AlertDialogContent
        {...alertDialogContent}
        ref={composedContentRef}
        onOpenAutoFocus={handleOpenAutoFocus}
      >
        <AlertDialogHeader {...alertDialogHeader}>
          {media ? (
            <AlertDialogMedia {...alertDialogMedia}>{media}</AlertDialogMedia>
          ) : null}
          {hasTitle ? (
            <AlertDialogTitle {...alertDialogTitle}>
              {icon}
              {title}
            </AlertDialogTitle>
          ) : null}
          {description ? (
            <AlertDialogDescription {...alertDialogDescription}>
              {description}
            </AlertDialogDescription>
          ) : null}
          {contentSlot}
        </AlertDialogHeader>
        <AlertDialogFooter {...alertDialogFooter}>{actions}</AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogPortal>
  )
})

interface ConfirmDialogProps extends ConfirmDialogContentProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

const ConfirmDialog = React.memo(function ConfirmDialog({
  isOpen,
  onOpenChange,
  config,
  onConfirm,
  onCancel,
  setConfig
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <ConfirmDialogContent
        config={config}
        onConfirm={onConfirm}
        onCancel={onCancel}
        setConfig={setConfig}
      />
    </AlertDialog>
  )
})

interface DialogState {
  isOpen: boolean
  config: ConfirmOptions
}

export function ConfirmDialogProvider({
  defaultOptions = EMPTY_OPTIONS,
  children
}: ConfirmDialogProviderProps) {
  const [dialogState, setDialogState] = React.useState<DialogState>({
    isOpen: false,
    config: baseDefaultOptions
  })

  // The pending promise's resolver is not React state: resolving it is a side
  // effect and must not run inside a state updater (which React may invoke
  // more than once). Keeping it in a ref also lets `confirm` stay referentially
  // stable, so consumers of the context never re-render on dialog activity.
  const resolverRef = React.useRef<((value: boolean) => void) | null>(null)

  const defaultOptionsRef = React.useRef(defaultOptions)
  React.useEffect(() => {
    defaultOptionsRef.current = defaultOptions
  }, [defaultOptions])

  const settle = React.useCallback((value: boolean) => {
    const resolve = resolverRef.current
    resolverRef.current = null
    resolve?.(value)
  }, [])

  const confirm = React.useCallback(
    (options: ConfirmOptions) => {
      // A dialog that gets replaced before the user answered is dismissed:
      // its promise resolves to `false` instead of staying pending forever.
      settle(false)
      setDialogState({
        isOpen: true,
        config: {
          ...baseDefaultOptions,
          ...defaultOptionsRef.current,
          ...options
        }
      })
      return new Promise<boolean>((resolve) => {
        resolverRef.current = resolve
      })
    },
    [settle]
  )

  const close = React.useCallback(
    (value: boolean) => {
      settle(value)
      setDialogState((prev) =>
        prev.isOpen ? { ...prev, isOpen: false } : prev
      )
    },
    [settle]
  )

  const handleConfirm = React.useCallback(() => close(true), [close])
  const handleCancel = React.useCallback(() => close(false), [close])

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) {
        handleCancel()
      }
    },
    [handleCancel]
  )

  const updateConfig = React.useCallback<ConfigUpdater>((newConfig) => {
    setDialogState((prev) => ({
      ...prev,
      config:
        typeof newConfig === 'function'
          ? newConfig(prev.config)
          : { ...prev.config, ...newConfig }
    }))
  }, [])

  const contextValue = React.useMemo<ConfirmContextValue>(
    () => ({ confirm, updateConfig }),
    [confirm, updateConfig]
  )

  return (
    <ConfirmContext.Provider value={contextValue}>
      {children}
      <ConfirmDialog
        isOpen={dialogState.isOpen}
        onOpenChange={handleOpenChange}
        config={dialogState.config}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        setConfig={updateConfig}
      />
    </ConfirmContext.Provider>
  )
}

export const useConfirm = (): ConfirmFunction & {
  updateConfig: ConfigUpdater
} => {
  const context = React.useContext(ConfirmContext)
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmDialogProvider')
  }

  const { confirm, updateConfig } = context

  // A per-consumer wrapper (instead of mutating the shared context function
  // during render) keeps this hook pure and works with any provider value.
  return React.useMemo(
    () =>
      Object.assign((options: ConfirmOptions) => confirm(options), {
        updateConfig
      }),
    [confirm, updateConfig]
  )
}
