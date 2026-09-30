'use client'

import * as React from 'react'
import copyToClipboard from 'copy-to-clipboard'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { CheckIcon, CopyIcon } from 'lucide-react'

const FEEDBACK_DURATION_MS = 2000

const variants = {
  visible: { opacity: 1, scale: 1 },
  hidden: { opacity: 0, scale: 0.5 }
}

/**
 * Copies `text` to the clipboard and reports `copied` for a short moment
 * afterwards. The pending timeout is cleared on unmount and on repeated
 * copies, so the feedback never fires on an unmounted component.
 */
export function useCopyFeedback(text: string) {
  const [copied, setCopied] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )

  React.useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  const copy = React.useCallback(() => {
    copyToClipboard(text)
    setCopied(true)
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setCopied(false)
    }, FEEDBACK_DURATION_MS)
  }, [text])

  return { copied, copy }
}

export function CopyFeedbackIcon({ copied }: { copied: boolean }) {
  return (
    <MotionConfig transition={{ duration: 0.15 }}>
      <AnimatePresence initial={false} mode="wait">
        {copied ? (
          <motion.span
            key="check"
            className="flex"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <CheckIcon size={16} aria-hidden="true" />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            className="flex"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <CopyIcon size={16} aria-hidden="true" />
          </motion.span>
        )}
      </AnimatePresence>
    </MotionConfig>
  )
}
