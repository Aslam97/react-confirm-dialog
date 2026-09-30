# Demo site

The documentation and demo site for [`@omit/react-confirm-dialog`](../../packages/confirm-dialog), built with Next.js and Tailwind CSS v4.

```bash
pnpm install
pnpm --filter web dev      # http://localhost:3000
pnpm --filter web build    # production build (builds the library first)
pnpm --filter web test:e2e # Playwright end-to-end tests against the production build
```

The site consumes the library through the workspace (`@omit/react-confirm-dialog`), so changes in `packages/confirm-dialog` are reflected after `pnpm --filter @omit/react-confirm-dialog build`.
