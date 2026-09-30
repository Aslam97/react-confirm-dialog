# Changelog

## 2.1.0

### Fixed

- `confirm()` called while a dialog is open resolves the previous promise with `false` instead of leaving it pending forever.
- The promise resolver is no longer invoked inside a `setState` updater (which React may run more than once).
- `confirm` and the context value are referentially stable, so components using `useConfirm` no longer re-render on every dialog open, update or close.
- A consumer `onClick` on `confirmButton` or `cancelButton` no longer replaces the dialog's own handler (which made "confirm" resolve `false`). Handlers are composed; `event.preventDefault()` keeps the dialog open.
- Consumer `className`s on the action buttons are merged through `tailwind-merge`, so overrides such as `bg-green-500` win over the variant's `bg-primary`.
- Focus always lands inside the dialog, also with `cancelButton: null`, a disabled cancel button or custom actions.
- `ref` in the option props (`alertDialogContent`, `confirmButton`, ...) works on React 18: the primitives use `forwardRef`.
- Both `customActions` signatures are detected without relying on `Function.length`.
- Radix `@radix-ui/react-alert-dialog` 1.1.23: no more production console warnings when `title` or `description` is omitted; ARIA references are only set when the elements exist.

### Packaging

- The `'use client'` directive is preserved in the ESM and CommonJS bundles.
- `index.d.mts` is shipped for the ESM entry and `exports` declares types per condition (verified with publint and arethetypeswrong).
- `sideEffects: false`; README and LICENSE are included in the tarball.
- `tailwind-merge` 3 (Tailwind CSS v4 class set).

### Deprecated

- The exported `ConfirmDialogState` type is no longer used internally and is kept only for compatibility.
