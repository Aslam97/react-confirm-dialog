import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const dist = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../confirm-dialog/dist'
)

describe('published bundle', () => {
  it.each(['index.mjs', 'index.js'])(
    '%s starts with the "use client" directive',
    (file) => {
      const head = readFileSync(path.join(dist, file), 'utf8').slice(0, 64)
      expect(head).toMatch(/^("use strict";)?"use client";/)
    }
  )

  it('ships type declarations for both module formats', () => {
    expect(existsSync(path.join(dist, 'index.d.ts'))).toBe(true)
    expect(existsSync(path.join(dist, 'index.d.mts'))).toBe(true)
  })
})
