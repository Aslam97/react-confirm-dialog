// The directive has to live in the bundle entry: esbuild only preserves
// directives found in entry points, so this is what marks the published
// bundle as a Client Component boundary for React Server Components.
'use client'

export * from './confirm-dialog'
