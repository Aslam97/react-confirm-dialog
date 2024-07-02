# React Confirm Dialog

The goal is to make [AlertDialog](https://ui.shadcn.com/docs/components/alert-dialog) component from Shadcn UI available globally, so it can be used anywhere in your app.

## Usage

If you are using [Shadcn UI](https://ui.shadcn.com) you can create folder name `confirm-dialog` and copy the following file to that folder:

```bash
- packages/
  - confirm-dialog/
    - src/
      - index.ts
      - confirm-context.ts
      - confirm-dialog.tsx
      - types.ts
      - use-confirm.ts
```

If you not using Shadcn UI or prefer to install via npm, you can install it via npm:

```bash
npm install @omit/react-confirm-dialog
```

Add `<ConfirmDialogProvider />` to your app, After that you can use `useConfirm()` from anywhere in your app.

```tsx
import { ConfirmDialogProvider } from '@omit/react-confirm-dialog'

function App() {
  return (
    <ConfirmDialogProvider>
      <YourComponent />
    </ConfirmDialogProvider>
  )
}

function YourComponent() {
  const confirm = useConfirm()

  const handleClick = async () => {
    const result = await confirm({
      title: 'Are you sure?'
    })

    if (result) {
      console.log('Confirmed')
    } else {
      console.log('Canceled')
    }
  }

  return <button onClick={handleClick}>Click me</button>
}
```

## Props

```ts
type ConfirmOptions = {
  title: React.ReactNode | string

  description?: React.ReactNode | string

  confirmButton?: {
    // any normal react button props and Shadcn UI Button props
    size?: 'sm' | 'lg' | 'icon'
    variant?: 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  }

  cancelButton?: {
    // any normal react button props and Shadcn UI Button props
    size?: 'sm' | 'lg' | 'icon'
    variant?: 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  }

  confirmText?: string // default: 'Confirm'

  cancelText?: string // default: 'Cancel'

  icon?: React.ReactNode

  customActions?: (
    onConfirm: () => void,
    onCancel: () => void
  ) => React.ReactNode

  alertDialog?: // any Radix UI AlertDialog props
  alertDialogContent?: // any Radix UI AlertDialogContent props
  alertDialogHeader?: // any HTMLDivElement
  alertDialogTitle?: // any Radix UI AlertDialogTitle props
  alertDialogDescription?: // any Radix UI AlertDialogDescription props
  alertDialogFooter?: // any HTMLDivElement
}
```

## Tailwind CSS Intellisense

If you using Tailwind CSS Intellisense, add the following to your editor settings. This will make the class name completion work for `className` prop.

```diff
{
  "tailwindCSS.experimental.classRegex": [
    "class:\\s*?[\"'`]([^\"'`]*).*?,",
+    "className:\\s*[\"']([^\"']*)[\"']"
  ],
}
```
