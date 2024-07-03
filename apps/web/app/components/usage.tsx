'use client'

import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import { useConfirm } from '@omit/react-confirm-dialog'
import { Installation } from './installation'
import { themes } from 'prism-react-renderer'

export const Usage = () => {
  const scope = { useConfirm }

  const noInlineExample = `
    const starSvg = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="size-8 fill-current text-yellow-500">
        <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
        </svg>
    )

    const App = () => {
        const confirm = useConfirm()

        const handleClick = async () => {
            const result = await confirm({
                title: 'Hello',
                description: 'Are you sure?',
                confirmText: 'Yes',
                cancelText: 'No',
                confirmButton: {
                    variant: 'destructive',
                    size: 'sm'
                },
                cancelButton: {
                    variant: 'outline',
                    size: 'sm'
                },
                icon: starSvg,
                customActions: (onConfirm, onCancel) => (
                    <>
                        <button onClick={onConfirm}>Custom Confirm</button>
                        <button onClick={onCancel}>Custom Cancel</button>
                    </>
                )
            })

            if (result) {
                console.log('Confirmed!')
            } else {
                console.log('Cancelled!')
            }
        }

        return (
            <div className="flex justify-center h-full p-8">
                <button onClick={handleClick} className="bg-primary h-10 my-auto text-white px-4 py-2 rounded-md">
                    <strong>Click me</strong>
                </button>
            </div>
        )
    }

    render(<App />)
  `.trim()

  return (
    <LiveProvider
      code={noInlineExample}
      scope={scope}
      noInline
      enableTypeScript={true}
      theme={themes.github}
    >
      <div className="grid mx-auto max-w-7xl grid-cols-1 gap-4 gap-y-8 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8">
        <div className="col-span-1">
          <Installation />
          <a
            href="https://github.com/Aslam97/react-confirm-dialog"
            className="block mt-2 text-primary underline text-sm"
            target="_blank"
          >
            https://github.com/Aslam97/react-confirm-dialog
          </a>
        </div>

        <div className="col-span-full">
          <h2 className="text-lg font-semibold">Demo</h2>

          <div className="grid grid-cols-1 mt-2 gap-4 md:grid-cols-2">
            <div className="col-span-1 bg-zinc-100 [&>div]:h-full">
              <LivePreview />
            </div>
            <div className="col-span-1 md:order-1">
              <LiveEditor className="max-h-96 [&>pre]:max-h-96 [&>pre]:overflow-auto" />
              <LiveError />
            </div>
          </div>
        </div>
      </div>
    </LiveProvider>
  )
}
