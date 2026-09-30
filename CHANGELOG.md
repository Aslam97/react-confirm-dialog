# Changelog

## 2.1.0

Currently available as a prerelease: `npm install @omit/react-confirm-dialog@next`.

### Behavior changes to review before upgrading

No API was removed or renamed, but four bugs were fixed in ways an application may have accidentally depended on:

- **`confirm()` while another dialog is open** resolves the previous dialog's promise with `false`. Before, that promise never resolved, so code after its `await` never ran.
- **A custom `onClick` on `confirmButton` or `cancelButton`** no longer replaces the dialog's own handler. Before, clicking a confirm button with a custom `onClick` resolved the promise with `false`; now the handler runs and the promise resolves with `true`. Call `event.preventDefault()` in the handler to keep the dialog open.
- **`className` on the action buttons wins over the variant classes** (merged with `tailwind-merge`). Before, an override such as `bg-green-500` could lose against `bg-primary` depending on the stylesheet order.
- **Focus lands inside the dialog** also when there is no cancel button, the cancel button is disabled, or `customActions` is used. Before, focus stayed on the element that opened the dialog.

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
