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

## Non Shadcn UI Usage

Update your `tailwind.config.js` to include the following:

```js
module.exports = {
  content : [
    './node_modules/@omit/react-confirm-dialog/**/*.{js,ts,jsx,tsx}',
  ]
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        }
      }
    }
  },
}
```

And update your tailwindcss file to include the following. or get your color from [Shadcn UI](https://ui.shadcn.com/themes).

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
  }
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
