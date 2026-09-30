'use client'

import { Highlight, themes } from 'prism-react-renderer'
import useMeasure from 'react-use-measure'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { CopyFeedbackIcon, useCopyFeedback } from './copy-feedback'

export const CodeBlock = ({
  children,
  initialHeight = 0
}: {
  children: string
  initialHeight?: number
}) => {
  const [ref, bounds] = useMeasure()
  const { copied, copy } = useCopyFeedback(children)

  return (
    <div className="group relative">
      <button
        type="button"
        className="absolute top-3 right-3 z-10 flex size-6 cursor-pointer items-center justify-center rounded-md opacity-0 transition-[background,box-shadow,opacity] duration-200 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden"
        onClick={copy}
        aria-label={copied ? 'Copied' : 'Copy code'}
      >
        <CopyFeedbackIcon copied={copied} />
      </button>

      <Highlight theme={themes.github} code={children} language="tsx">
        {({ className, tokens, getLineProps, getTokenProps }) => (
          <motion.pre
            className="relative m-0 mt-4 overflow-hidden rounded-md border bg-muted text-sm"
            animate={{ height: bounds.height || initialHeight }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }}
          >
            <div
              className={cn('relative m-0 p-4 whitespace-pre-wrap', className)}
              ref={ref}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </div>
          </motion.pre>
        )}
      </Highlight>
    </div>
  )
}
