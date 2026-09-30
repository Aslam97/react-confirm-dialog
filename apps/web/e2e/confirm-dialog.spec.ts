import { expect, test, type Page } from '@playwright/test'

const dialog = (page: Page) => page.getByRole('alertdialog')

/**
 * Computed value of `property` for a throw-away element carrying `className`,
 * so assertions compare against what the stylesheet really produces (theme
 * tokens, color spaces) instead of hard-coded values.
 */
async function computedStyleOfClass(
  page: Page,
  className: string,
  property: string
) {
  return page.evaluate(
    ([cls, prop]) => {
      const probe = document.createElement('div')
      probe.className = cls
      document.body.appendChild(probe)
      const value = getComputedStyle(probe).getPropertyValue(prop)
      probe.remove()
      return value
    },
    [className, property] as const
  )
}

/**
 * Collects browser console errors and uncaught page errors so a test can
 * assert that none happened. The Vercel Web Analytics script only exists on
 * Vercel deployments, so its 404 outside of Vercel is not a defect of the app.
 */
function failOnConsoleErrors(page: Page) {
  const problems: string[] = []
  page.on('console', (message) => {
    if (message.type() !== 'error') return
    if (message.location().url.includes('/_vercel/insights/')) return
    problems.push(
      `console.error: ${message.text()} (${message.location().url})`
    )
  })
  page.on('pageerror', (error) => {
    problems.push(`pageerror: ${error.message}`)
  })
  return problems
}

test.describe('demo page', () => {
  test('renders without console errors and no horizontal overflow', async ({
    page
  }) => {
    const problems = failOnConsoleErrors(page)

    await page.goto('/')
    await expect(page).toHaveTitle('React Confirm Dialog')
    await expect(
      page.getByRole('heading', { level: 1, name: 'Confirm Dialog' })
    ).toBeVisible()

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
    )
    expect(overflow).toBe(false)
    expect(problems).toEqual([])
  })

  test('external GitHub link opens safely in a new tab', async ({ page }) => {
    await page.goto('/')
    const link = page.getByRole('link', { name: 'GitHub' })
    await expect(link).toHaveAttribute(
      'href',
      'https://github.com/Aslam97/react-confirm-dialog'
    )
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', /noreferrer/)
    // A button must not be nested inside the link.
    await expect(link.locator('button')).toHaveCount(0)
  })

  test('copy buttons give feedback', async ({ page }) => {
    await page.goto('/')
    const installButton = page.getByRole('button', {
      name: /npm install @omit\/react-confirm-dialog/
    })
    await installButton.click()
    await expect(installButton).toContainText('Copied to clipboard')

    const codeCopy = page.getByRole('button', { name: 'Copy code' }).first()
    await codeCopy.focus()
    await expect(codeCopy).toBeVisible()
    await codeCopy.press('Enter')
    await expect(
      page.getByRole('button', { name: 'Copied' }).first()
    ).toBeVisible()
  })
})

test.describe('hero dialog', () => {
  test('confirm resolves true, cancel and Escape resolve false', async ({
    page
  }) => {
    const problems = failOnConsoleErrors(page)
    const messages: string[] = []
    page.on('dialog', (nativeDialog) => {
      messages.push(nativeDialog.message())
      void nativeDialog.dismiss()
    })
    await page.goto('/')
    const trigger = page.getByRole('button', { name: 'Try Click Me' })

    await trigger.click()
    await expect(dialog(page)).toBeVisible()
    await expect(dialog(page)).toHaveAccessibleName('Are you sure?')
    await expect(dialog(page)).toHaveAccessibleDescription(
      'This action cannot be undone.'
    )
    // The least destructive action receives focus first.
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeFocused()
    await page.getByRole('button', { name: 'Yes, proceed' }).click()
    await expect(dialog(page)).toBeHidden()
    expect(messages).toEqual(['Confirmed'])

    await trigger.click()
    await page.getByRole('button', { name: 'Cancel' }).click()
    await expect(dialog(page)).toBeHidden()
    expect(messages).toEqual(['Confirmed', 'Canceled'])

    await trigger.click()
    await expect(dialog(page)).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog(page)).toBeHidden()
    expect(messages).toEqual(['Confirmed', 'Canceled', 'Canceled'])
    expect(problems).toEqual([])
  })

  test('keyboard: Tab is trapped inside the dialog and Enter confirms', async ({
    page
  }) => {
    const messages: string[] = []
    page.on('dialog', (nativeDialog) => {
      messages.push(nativeDialog.message())
      void nativeDialog.dismiss()
    })
    await page.goto('/')
    await page.getByRole('button', { name: 'Try Click Me' }).click()

    const cancel = page.getByRole('button', { name: 'Cancel' })
    const confirm = page.getByRole('button', { name: 'Yes, proceed' })
    await expect(cancel).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(confirm).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(cancel).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(confirm).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(dialog(page)).toBeHidden()
    expect(messages).toEqual(['Confirmed'])
  })

  test('clicking the overlay does not dismiss an alert dialog', async ({
    page
  }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Try Click Me' }).click()
    await expect(dialog(page)).toBeVisible()
    await page.mouse.click(5, 5)
    await expect(dialog(page)).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog(page)).toBeHidden()
  })

  test('library styles are applied (Tailwind picks up the package classes)', async ({
    page
  }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Try Click Me' }).click()
    const content = dialog(page)
    await expect(content).toBeVisible()

    const styles = await content.evaluate((element) => {
      const computed = getComputedStyle(element)
      return {
        position: computed.position,
        borderRadius: computed.borderRadius,
        display: computed.display
      }
    })
    expect(styles.position).toBe('fixed')
    expect(styles.display).toBe('grid')
    // `rounded-xl` resolves through the app theme (`--radius-xl`).
    expect(styles.borderRadius).toBe(
      await computedStyleOfClass(page, 'rounded-xl', 'border-radius')
    )
    expect(styles.borderRadius).not.toBe('0px')

    const overlayBackground = await page
      .locator('[data-slot="alert-dialog-overlay"]')
      .evaluate((element) => getComputedStyle(element).backgroundColor)
    expect(overlayBackground).toBe(
      await computedStyleOfClass(page, 'bg-black/10', 'background-color')
    )
    expect(overlayBackground).not.toBe('rgba(0, 0, 0, 0)')
  })
})

test.describe('dialog types', () => {
  const types = [
    'Default',
    'Small',
    'Media',
    'Small with Media',
    'Warning',
    'Destructive',
    'Custom Actions',
    'Custom Styling',
    'No Cancel Button',
    'No Cancel Button + Small'
  ]

  for (const name of types) {
    test(`"${name}" opens, is dismissible and updates the code sample`, async ({
      page
    }) => {
      const problems = failOnConsoleErrors(page)
      await page.goto('/')
      const button = page.getByRole('button', { name, exact: true })
      await button.click()
      await expect(dialog(page)).toBeVisible()

      // Focus is always inside the dialog, even without a cancel button.
      const focusInside = await page.evaluate(() => {
        const active = document.activeElement
        return Boolean(
          active && active.closest('[role="alertdialog"]') !== null
        )
      })
      expect(focusInside).toBe(true)

      // The dialog fits the viewport on every device.
      const viewport = page.viewportSize()
      const box = await dialog(page).boundingBox()
      expect(box).not.toBeNull()
      if (box && viewport) {
        expect(box.x).toBeGreaterThanOrEqual(0)
        expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1)
        expect(box.height).toBeLessThanOrEqual(viewport.height)
      }

      await page.keyboard.press('Escape')
      await expect(dialog(page)).toBeHidden()
      await expect(button).toHaveAttribute('data-active', 'true')
      expect(problems).toEqual([])
    })
  }

  test('"No Cancel Button" renders a single action', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('button', { name: 'No Cancel Button', exact: true })
      .click()
    await expect(dialog(page).getByRole('button')).toHaveCount(1)
    await expect(
      dialog(page).getByRole('button', { name: 'Yes, do it' })
    ).toBeFocused()
    await page.keyboard.press('Escape')
  })

  test('"Warning" applies the consumer className on the confirm button', async ({
    page
  }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Warning', exact: true }).click()
    const confirm = dialog(page).getByRole('button', { name: 'Confirm' })
    const background = await confirm.evaluate(
      (element) => getComputedStyle(element).backgroundColor
    )
    // The consumer's bg-yellow-500 has to win over the variant's bg-primary.
    expect(background).toBe(
      await computedStyleOfClass(page, 'bg-yellow-500', 'background-color')
    )
    expect(background).not.toBe(
      await computedStyleOfClass(page, 'bg-primary', 'background-color')
    )
    await page.keyboard.press('Escape')
  })

  test('"Custom Actions" buttons resolve the dialog', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('button', { name: 'Custom Actions', exact: true })
      .click()
    await expect(
      dialog(page).getByRole('button', { name: 'No, thanks' })
    ).toBeFocused()
    await dialog(page).getByRole('button', { name: 'Maybe later' }).click()
    await expect(dialog(page)).toBeHidden()

    await page
      .getByRole('button', { name: 'Custom Actions', exact: true })
      .click()
    await dialog(page).getByRole('button', { name: 'Yes, please' }).click()
    await expect(dialog(page)).toBeHidden()
  })
})

test.describe('delete repository example', () => {
  test('confirm stays disabled until the repository name matches', async ({
    page
  }) => {
    const problems = failOnConsoleErrors(page)
    await page.goto('/')
    await page.getByRole('button', { name: 'Delete Repository' }).click()

    const confirm = dialog(page).getByRole('button', {
      name: 'Delete this repository'
    })
    const input = dialog(page).getByRole('textbox')
    await expect(confirm).toBeDisabled()

    await input.fill('wrong/name')
    await expect(confirm).toBeDisabled()

    await input.fill('Aslam97/example')
    await expect(confirm).toBeEnabled()

    await input.fill('Aslam97/exampl')
    await expect(confirm).toBeDisabled()

    await input.fill('Aslam97/example')
    await confirm.click()
    await expect(dialog(page)).toBeHidden()
    expect(problems).toEqual([])
  })
})
