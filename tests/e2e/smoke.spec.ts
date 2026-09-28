import { AxeBuilder } from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const cell = (page: Page, board: number, c: number) =>
  page.getByRole('button', {
    name: new RegExp(`^Board ${board}, cell ${c}\\b`),
  })

// Console errors include CSP violations.
let errors: string[] = []
test.beforeEach(({ page }) => {
  errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
})
test.afterEach(() => expect(errors).toEqual([]))

async function a11y(page: Page) {
  const { violations } = await new AxeBuilder({ page }).analyze()
  expect(
    violations.map(
      (v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' | ')}`,
    ),
  ).toEqual([])
}

test('2 players: place, pause menus, undo, rules', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('Super Tic-Tac-Toe')
  await page.getByRole('menuitem', { name: '2 players' }).click()
  await expect(page).toHaveURL('/game')
  await expect(page).toHaveTitle('2 players · Super Tic-Tac-Toe')

  await cell(page, 5, 5).click()
  await expect(cell(page, 5, 5)).toHaveAccessibleName('Board 5, cell 5, X')
  await expect(page.getByRole('status').last()).toContainText('to move')

  await page.getByRole('button', { name: 'START: PAUSE' }).click()
  const pause = page.getByRole('dialog', { name: 'PAUSED' })
  await pause.getByRole('menuitem', { name: 'settings' }).click()
  await page
    .getByRole('dialog', { name: 'SETTINGS' })
    .getByRole('menuitem', { name: 'about' })
    .click()
  await expect(page.getByRole('dialog', { name: 'About' })).toContainText(
    'AKDEVV',
  )
  await page.getByRole('button', { name: 'B: BACK' }).click()
  await page.getByRole('button', { name: 'B: BACK' }).click()
  await pause.getByRole('menuitem', { name: 'undo' }).click()
  await expect(pause).toBeHidden()
  await expect(cell(page, 5, 5)).toHaveAccessibleName('Board 5, cell 5')

  await page.getByRole('button', { name: 'SELECT: HELP' }).click()
  await expect(page.getByRole('dialog', { name: 'How to play' })).toContainText(
    'THE BIG BOARD',
  )
})

test('vs CPU: the bot answers a move', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('menuitem', { name: 'vs CPU' }).click()
  await page.getByRole('menuitem', { name: 'start' }).click()
  await expect(page).toHaveURL(/\/game\?bot=medium&me=X/)
  await cell(page, 5, 5).click()
  await expect(page.getByRole('button', { name: /, O$/ })).toHaveCount(1)
  await expect(page.getByRole('status').last()).toContainText('your move')
  await expect(page.getByText(/^O played board 5, cell \d$/)).toBeAttached()
})

test('unknown route shows the 404 screen', async ({ page }) => {
  await page.goto('/nope')
  await expect(page.getByText('404')).toBeVisible()
  await expect(page).toHaveTitle('Not found · Super Tic-Tac-Toe')
})

test('accessibility: title, game, pause, rules', async ({ page }) => {
  await page.goto('/')
  await a11y(page)
  await page.getByRole('menuitem', { name: '2 players' }).click()
  await cell(page, 5, 5).click()
  await a11y(page)
  await page.getByRole('button', { name: 'START: PAUSE' }).click()
  await a11y(page)
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'SELECT: HELP' }).click()
  await a11y(page)
})

test('works offline once loaded', async ({ page, context }) => {
  await page.goto('/')
  await page.evaluate(() => navigator.serviceWorker.ready)
  await context.setOffline(true)
  await page.reload()
  await page.getByRole('menuitem', { name: 'vs CPU' }).click()
  await page.getByRole('menuitem', { name: 'start' }).click()
  await cell(page, 5, 5).click()
  await expect(page.getByRole('button', { name: /, O$/ })).toHaveCount(1)
  expect(
    await page.evaluate(() => document.fonts.check('16px "Press Start 2P"')),
  ).toBe(true)
})
