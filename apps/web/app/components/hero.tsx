'use client'

import React from 'react'
import { Github } from 'lucide-react'
import { useConfirm } from '@omit/react-confirm-dialog'
import { Button } from './ui/button'
import Link from 'next/link'

export function Hero() {
  const confirm = useConfirm()

  const handleConfirmClick = async () => {
    const result = await confirm({
      title: 'Are you sure?',
      description: 'This action cannot be undone.',
      confirmText: 'Yes, proceed',
      cancelText: 'Cancel'
    })

    alert(result ? 'Confirmed' : 'Canceled')
  }

  return (
    <div className="text-center">
      <h1 className="text-5xl font-extrabold tracking-tight mb-4">
        Confirm Dialog
      </h1>
      <p className="text-xl mb-6">
        A flexible and accessible confirm dialog for React app.
      </p>
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 gap-x-2">
        <Button onClick={handleConfirmClick}>Try Click Me</Button>
        <Link
          href="https://github.com/Aslam97/react-confirm-dialog"
          passHref
          target="_blank"
        >
          <Button variant="outline">
            <Github className="mr-2 size-5" />
            GitHub
          </Button>
        </Link>
      </div>
    </div>
  )
}
