import { version as reactVersion } from 'react'
import { version as reactDomVersion } from 'react-dom'
import { describe, expect, it } from 'vitest'

describe('React 18 test environment', () => {
  it('runs the shared test-suite against React 18', () => {
    expect(reactVersion).toMatch(/^18\./)
    expect(reactDomVersion).toMatch(/^18\./)
  })
})
