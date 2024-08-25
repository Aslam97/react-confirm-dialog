'use client'

import React from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import useMeasure from 'react-use-measure'
import copy from 'copy-to-clipboard'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const variants = {
  visible: { opacity: 1, scale: 1 },
  hidden: { opacity: 0, scale: 0.5 }
}

export const CodeBlock = ({
  children,
  initialHeight = 0
}: {
  children: string
  initialHeight?: number
}) => {
  const [ref, bounds] = useMeasure()
  const [copying, setCopying] = React.useState<number>(0)

  const onCopy = React.useCallback(() => {
    copy(children)
    setCopying((c) => c + 1)
    setTimeout(() => {
      setCopying((c) => c - 1)
    }, 2000)
  }, [children])

  return (
    <div className="relative group">
      <button
        className="absolute top-3 right-3 group-hover:opacity-100 z-10 size-6 rounded-md flex items-center justify-center cursor-pointer opacity-0 transition-[background,box-shadow,opacity] duration-200"
        onClick={onCopy}
        aria-label="Copy code"
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

      <Highlight theme={themes.github} code={children} language="tsx">
        {({ className, tokens, getLineProps, getTokenProps }) => (
          <motion.pre
            className="overflow-hidden bg-muted relative m-0 rounded-md mt-4 border text-sm"
            animate={{ height: bounds.height || initialHeight }}
            transition={{ type: 'easeOut', duration: 0.2 }}
          >
            <div
              className={cn('p-4 m-0 relative whitespace-pre-wrap', className)}
              ref={ref}
            >
              <div />
              {tokens.map((line, i) => {
                return (
                  <div key={i} {...getLineProps({ line })}>
                    {line.map((token, key) => {
                      return <span key={key} {...getTokenProps({ token })} />
                    })}
                  </div>
                )
              })}
            </div>
          </motion.pre>
        )}
      </Highlight>
    </div>
  )
}
