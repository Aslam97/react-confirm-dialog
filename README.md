![React Confirm Dialog](https://i.postimg.cc/yNGM1Pnk/Screenshot-2024-08-25-at-21-05-43.png)

# React Confirm Dialog

A flexible and customizable confirm dialog component for React applications, built with accessibility in mind. This component makes the [AlertDialog](https://ui.shadcn.com/docs/components/alert-dialog) from Shadcn UI available globally, so it can be used anywhere in your app.

## Features

- Easy to use with the `useConfirm` hook
- Fully customizable appearance and behavior
- Accessible, built on top of the `AlertDialog` from `@radix-ui/react-alert-dialog`
- Supports custom actions
- Seamless integration with Shadcn UI

## Installation

### For Shadcn UI Users

If you are using [Shadcn UI](https://ui.shadcn.com), you can copy the following files:

```
- packages/
  - confirm-dialog/
    - src/
      - confirm-dialog.tsx
```

### For Non-Shadcn UI Users

If you're not using Shadcn UI or prefer to install via npm, you can install it using:

```bash
npm install @omit/react-confirm-dialog
```

## Basic Usage

1. Wrap your app with the `ConfirmDialogProvider`:

```jsx
import { ConfirmDialogProvider } from '@omit/react-confirm-dialog'

function App() {
  return (
    <ConfirmDialogProvider>{/* Your app components */}</ConfirmDialogProvider>
  )
}
```

2. Use the `useConfirm` hook in your components:

```jsx
import { useConfirm } from '@omit/react-confirm-dialog'

function YourComponent() {
  const confirm = useConfirm()

  const handleClick = async () => {
    const isConfirmed = await confirm({
      title: 'Delete Item',
      description: 'Are you sure you want to delete this item?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    })

    if (isConfirmed) {
      // Perform delete action
    }
  }

  return <button onClick={handleClick}>Delete</button>
}
```

## Customization

You can customize the appearance and behavior of the confirm dialog by passing options to the `confirm` function:

```jsx
confirm({
  title: 'Custom Dialog',
  description: 'This is a custom confirm dialog.',
  confirmText: 'OK',
  cancelText: 'No, thanks',
  icon: <CustomIcon />,
  confirmButton: {
    variant: 'destructive',
    size: 'sm'
  },
  cancelButton: {
    variant: 'outline',
    size: 'sm'
  },
  alertDialogContent: {
    className: 'custom-dialog-content'
  }
  // ... other customization options
})
```

### Setting Default Options

You can set default options for all confirm dialogs in your app by passing `defaultOptions` to the `ConfirmDialogProvider`:

```jsx
<ConfirmDialogProvider
  defaultOptions={{
    confirmText: 'Yes',
    cancelText: 'No',
    alertDialogContent: { className: 'my-default-dialog-class' }
  }}
>
  {/* Your app components */}
</ConfirmDialogProvider>
```

## API

### ConfirmOptions

The `confirm` function accepts an options object with the following properties:

```typescript
type ConfirmOptions = {
  title: React.ReactNode
  description?: React.ReactNode
  confirmButton?: {
    // any normal react button props and Shadcn UI Button props
    size?: 'sm' | 'lg' | 'icon'
    variant?: 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  }
  cancelButton?: {
    // any normal react button props and Shadcn UI Button props
    size?: 'sm' | 'lg' | 'icon'
    variant?: 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  } | null // set to null to hide the cancel button
  confirmText?: string // default: 'Confirm'
  cancelText?: string // default: 'Cancel'
  icon?: React.ReactNode
  customActions?: (
    onConfirm: () => void,
    onCancel: () => void
  ) => React.ReactNode
  alertDialog?: React.ComponentPropsWithoutRef<typeof AlertDialog>
  alertDialogContent?: React.ComponentPropsWithoutRef<typeof AlertDialogContent>
  alertDialogHeader?: React.HTMLAttributes<HTMLDivElement>
  alertDialogTitle?: React.ComponentPropsWithoutRef<typeof AlertDialogTitle>
  alertDialogDescription?: React.ComponentPropsWithoutRef<
    typeof AlertDialogDescription
  >
  alertDialogFooter?: React.HTMLAttributes<HTMLDivElement>
}
```

## Non-Shadcn UI Usage

If you're not using Shadcn UI, you'll need to set up your Tailwind CSS configuration to work with this component.

1. Update your `tailwind.config.js`:

```js
module.exports = {
  content: [
    './node_modules/@omit/react-confirm-dialog/**/*.{js,ts,jsx,tsx}'
    // ... your other content paths
  ],
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
  }
}
```

2. Add the following CSS variables to your main CSS file (or get your colors from [Shadcn UI](https://ui.shadcn.com/themes)):

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

If you're using Tailwind CSS Intellisense, add the following to your editor settings to make the class name completion work for the `className` prop:

```diff
{
  "tailwindCSS.experimental.classRegex": [
    "class:\\s*?[\"'`]([^\"'`]*).*?,",
+    "className:\\s*[\"']([^\"']*)[\"']"
  ]
}
```

## Accessibility

This component is built with accessibility in mind, utilizing the `AlertDialog` from `@radix-ui/react-alert-dialog`. It ensures proper focus management and keyboard navigation.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
