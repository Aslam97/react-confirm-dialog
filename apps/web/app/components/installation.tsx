'use client'

import React from 'react'
import copy from 'copy-to-clipboard'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { CheckIcon, CopyIcon } from 'lucide-react'

const variants = {
  visible: { opacity: 1, scale: 1 },
  hidden: { opacity: 0, scale: 0.5 }
}

export const Installation = () => {
  const [copying, setCopying] = React.useState(0)

  const onCopy = React.useCallback(() => {
    copy('npm install @omit/react-confirm-dialog')
    setCopying((c) => c + 1)
    setTimeout(() => {
      setCopying((c) => c - 1)
    }, 2000)
  }, [])

  return (
    <div className="space-y-3">
      <h2 className="text-base font-medium">Installation</h2>
      <code
        className="p-0 pr-16 pl-3 bg-muted rounded-md font-mono text-sm relative cursor-copy h-10 border flex items-center"
        onClick={onCopy}
      >
        npm install @omit/react-confirm-dialog{' '}
        <button
          aria-label="Copy code"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 cursor-pointer rounded-md size-6 flex justify-center items-center"
        >
          <MotionConfig transition={{ duration: 0.15 }}>
            <AnimatePresence initial={false} mode="wait">
              {copying ? (
                <motion.div
                  animate="visible"
                  exit="hidden"
                  initial="hidden"
                  key="check"
                  variants={variants}
                >
                  <CheckIcon size={16} />
                </motion.div>
              ) : (
                <motion.div
                  animate="visible"
                  exit="hidden"
                  initial="hidden"
                  key="copy"
                  variants={variants}
                >
                  <CopyIcon size={16} />
                </motion.div>
              )}
            </AnimatePresence>
          </MotionConfig>
        </button>
      </code>
    </div>
  )
}
