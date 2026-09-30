'use client'

import { Github } from 'lucide-react'
import Link from 'next/link'
import { useConfirm } from '@omit/react-confirm-dialog'
import { Button } from '@/components/ui/button'

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
      <h1 className="mb-4 text-5xl font-extrabold tracking-tight">
        Confirm Dialog
      </h1>
      <p className="mb-6 text-xl">
        A flexible and accessible confirm dialog for React app.
      </p>
      <div className="flex flex-col justify-center space-y-4 gap-x-2 sm:flex-row sm:space-y-0">
        <Button onClick={handleConfirmClick}>Try Click Me</Button>
        <Button variant="outline" asChild>
          <Link
            href="https://github.com/Aslam97/react-confirm-dialog"
            target="_blank"
            rel="noreferrer"
          >
            <Github className="mr-2 size-5" aria-hidden="true" />
            GitHub
          </Link>
        </Button>
      </div>
    </div>
  )
}
