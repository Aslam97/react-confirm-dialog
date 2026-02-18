# React Confirm Dialog

<p style={{ textAlign: 'center' }}>
<a href="https://github.com/Aslam97/react-confirm-dialog/blob/main/LICENSE" target="_blank"><img src="https://img.shields.io/npm/l/%40omit%2Freact-confirm-dialog" /></a>
<a href="https://www.npmjs.com/package/@omit/react-confirm-dialog" target="_blank"><img src="https://img.shields.io/npm/v/%40omit%2Freact-confirm-dialog" /></a>
<a href="https://www.npmjs.com/package/@omit/react-confirm-dialog" target="_blank"><img src="https://img.shields.io/npm/dw/%40omit%2Freact-confirm-dialog" /></a>
<a href="https://github.com/Aslam97/react-confirm-dialog/commits" target="_blank"><img src="https://img.shields.io/npm/unpacked-size/%40omit%2Freact-confirm-dialog" /></a>
</p>

A flexible and customizable confirm dialog component for React applications. Built on top of [Radix UI](https://www.radix-ui.com/) Alert Dialog and styled with [Tailwind CSS v4](https://tailwindcss.com/).

## Features

- Promise-based API with the `useConfirm` hook
- Fully customizable appearance through Tailwind classes
- Custom actions with access to dialog state
- Icon support and content slots
- Accessible by default (built on Radix UI)
- Tailwind CSS v4 with native keyframe animations
- React 18 and 19 support

## Installation

```bash
npm install @omit/react-confirm-dialog
```

## Setup

### 1. Wrap your app with the ConfirmDialogProvider

```jsx
import { ConfirmDialogProvider } from '@omit/react-confirm-dialog'

function App() {
  return (
    <ConfirmDialogProvider>
      {/* Your app components */}
    </ConfirmDialogProvider>
  )
}
```

### 2. Configure Tailwind CSS v4

Add the library's class source and the required animation keyframes to your CSS file:

```css
@import 'tailwindcss';
@source '../node_modules/@omit/react-confirm-dialog/dist/index.js';

@theme inline {
  --animate-fade-in: fade-in 150ms ease;
  --animate-fade-out: fade-out 150ms ease;
  --animate-scale-in: scale-in 150ms ease;
  --animate-scale-out: scale-out 150ms ease;

  @keyframes fade-in {
    from { opacity: 0; }
  }
  @keyframes fade-out {
    to { opacity: 0; }
  }
  @keyframes scale-in {
    from { opacity: 0; scale: 0.95; }
  }
  @keyframes scale-out {
    to { opacity: 0; scale: 0.95; }
  }
}
```

### 3. Add CSS color variables

The dialog uses Tailwind semantic color tokens. Define them in your CSS (or use colors from [shadcn/ui themes](https://ui.shadcn.com/themes)):

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
}

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
}
```

## Usage

### Basic

```jsx
import { useConfirm } from '@omit/react-confirm-dialog'

function YourComponent() {
  const confirm = useConfirm()

  const handleClick = async () => {
    const isConfirmed = await confirm({
      title: 'Confirm Action',
      description: 'Are you sure you want to proceed?'
    })

    if (isConfirmed) {
      // User confirmed
    }
  }

  return <button onClick={handleClick}>Do something</button>
}
```

### With Icon

```jsx
import { Trash } from 'lucide-react'

const isConfirmed = await confirm({
  title: 'Delete Item',
  description: 'Are you sure? This action cannot be undone.',
  icon: <Trash className="size-4 text-destructive" />,
  confirmText: 'Delete',
  cancelText: 'Cancel',
  confirmButton: {
    className: 'bg-red-500 hover:bg-red-600 text-white'
  },
  alertDialogTitle: {
    className: 'flex items-center gap-2'
  }
})
```

### Custom Button Text and Styles

```jsx
const isConfirmed = await confirm({
  title: 'Custom Buttons',
  description: 'This dialog has custom button text and styles.',
  confirmText: 'Proceed',
  cancelText: 'Go Back',
  confirmButton: {
    className: 'bg-green-500 hover:bg-green-600 text-white'
  },
  cancelButton: {
    className: 'border-red-500 text-destructive hover:bg-red-50'
  }
})
```

### Hide Cancel Button

```jsx
const isConfirmed = await confirm({
  title: 'Success!',
  description: 'Your action was completed successfully.',
  confirmText: 'Great',
  cancelButton: null
})
```

### Custom Content Slot

Add custom content between the description and actions:

```jsx
const isConfirmed = await confirm({
  title: 'Custom Content',
  description: 'This dialog includes custom content.',
  contentSlot: <MyCustomComponent />
})
```

### Custom Actions

Full control over the action buttons with access to dialog state:

```jsx
const isConfirmed = await confirm({
  title: 'Custom Actions',
  description: 'This dialog has custom action buttons.',
  customActions: ({ confirm, cancel, config, setConfig }) => (
    <>
      <button onClick={cancel}>No, thanks</button>
      <button onClick={confirm}>Yes, please</button>
      <button
        onClick={() => {
          console.log('Custom action')
          cancel()
        }}
      >
        Maybe later
      </button>
    </>
  )
})
```

### Custom Styling

Override the styling of any dialog part:

```jsx
const isConfirmed = await confirm({
  title: 'Custom Styling',
  description: 'This dialog has custom styles applied.',
  alertDialogContent: { className: 'border-2 border-indigo-500 bg-indigo-50' },
  alertDialogHeader: { className: 'bg-indigo-100' },
  alertDialogFooter: { className: 'bg-indigo-100' },
  alertDialogTitle: { className: 'text-indigo-700' },
  alertDialogDescription: { className: 'text-indigo-600' }
})
```

### Dynamic Configuration Updates

Update the dialog configuration after it's opened:

```jsx
const confirm = useConfirm()

// Inside a custom action or content slot
confirm.updateConfig((prev) => ({
  ...prev,
  description: 'Updated description',
  confirmButton: { ...prev.confirmButton, disabled: true }
}))
```

### Default Options

Set default options for all confirm dialogs in your app:

```jsx
<ConfirmDialogProvider
  defaultOptions={{
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
    alertDialogContent: {
      className: 'sm:max-w-[425px]'
    }
  }}
>
  {/* Your app components */}
</ConfirmDialogProvider>
```

## API Reference

### ConfirmOptions

The `confirm` function accepts an options object with the following properties:

```typescript
interface ConfirmOptions {
  // Content
  title?: ReactNode
  description?: ReactNode
  contentSlot?: ReactNode
  icon?: ReactNode

  // Button Text
  confirmText?: string
  cancelText?: string

  // Custom Actions
  customActions?: LegacyCustomActions | EnhancedCustomActions

  // Button Props (pass null to cancelButton to hide it)
  confirmButton?: ComponentPropsWithRef<typeof AlertDialogAction>
  cancelButton?: ComponentPropsWithRef<typeof AlertDialogCancel> | null

  // Component Props (className and other HTML props)
  alertDialogOverlay?: ComponentPropsWithRef<typeof AlertDialogOverlay>
  alertDialogContent?: ComponentPropsWithRef<typeof AlertDialogContent>
  alertDialogHeader?: ComponentPropsWithRef<typeof AlertDialogHeader>
  alertDialogTitle?: ComponentPropsWithRef<typeof AlertDialogTitle>
  alertDialogDescription?: ComponentPropsWithRef<typeof AlertDialogDescription>
  alertDialogFooter?: ComponentPropsWithRef<typeof AlertDialogFooter>
}
```

### CustomActionsProps

When using the enhanced custom actions API:

```typescript
interface CustomActionsProps {
  confirm: () => void
  cancel: () => void
  config: ConfirmOptions
  setConfig: (config: ConfirmOptions | ((prev: ConfirmOptions) => ConfirmOptions)) => void
}
```

### useConfirm

```typescript
const confirm = useConfirm()

// Open a dialog (returns a promise)
const result: boolean = await confirm(options)

// Update config of an open dialog
confirm.updateConfig((prev) => ({ ...prev, title: 'New Title' }))
```

## Migrating from v1

### Tailwind CSS v4

v2 uses Tailwind CSS v4. Replace your `tailwind.config.js` content configuration with the `@source` directive in your CSS file:

```diff
- // tailwind.config.js
- module.exports = {
-   content: ['./node_modules/@omit/react-confirm-dialog/dist/index.js'],
-   plugins: [require('tailwindcss-animate')]
- }

+ /* globals.css */
+ @import 'tailwindcss';
+ @source '../node_modules/@omit/react-confirm-dialog/dist/index.js';
```

### Animation keyframes

v2 uses native Tailwind CSS v4 `@theme` keyframes instead of `tailwindcss-animate` or `tw-animate-css`. Add the keyframe definitions shown in the [Setup](#2-configure-tailwind-css-v4) section to your CSS file.

### CSS color variables

v2 uses `oklch` color space instead of `hsl`. Update your CSS variables accordingly, or use colors from [shadcn/ui themes](https://ui.shadcn.com/themes).

## Tailwind CSS Intellisense

To enable class name completion for the `className` prop, add this to your editor settings:

```json
{
  "tailwindCSS.experimental.classRegex": [
    "class:\\s*?[\"'`]([^\"'`]*).*?,",
    "className:\\s*[\"']([^\"']*)[\"']"
  ]
}
```

## Related Projects

- [Minimal Tiptap Editor](https://github.com/Aslam97/shadcn-minimal-tiptap)
- [React Fancy Switch](https://github.com/Aslam97/react-fancy-switch)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
