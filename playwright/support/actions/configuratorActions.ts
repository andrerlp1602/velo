import { Page, expect } from '@playwright/test'

export function createConfiguratorActions(page: Page) {
  const elements = {
    totalPrice: page.getByTestId('total-price'),
    carImage: page.locator('img[alt^="Velô Sprint"]'),
    finishButton: page.getByRole('button', { name: 'Monte o Seu' }),
    optionButton: (name: string | RegExp) => page.getByRole('button', { name }),
    optionalCheckbox: (name: string | RegExp) => page.getByRole('checkbox', { name }),
  }

  return {
    elements,

    async open(): Promise<void> {
      await page.goto('/configure')
    },

    async selectColor(name: string): Promise<void> {
      await elements.optionButton(name).click()
    },

    async selectWheels(name: string | RegExp): Promise<void> {
      await elements.optionButton(name).click()
    },

    async checkOptional(name: string | RegExp): Promise<void> {
      await elements.optionalCheckbox(name).check()
    },

    async uncheckOptional(name: string | RegExp): Promise<void> {
      await elements.optionalCheckbox(name).uncheck()
    },

    async finishConfigurator(): Promise<void> {
      await elements.finishButton.click()
    },

    async expectPrice(price: string): Promise<void> {
      await expect(elements.totalPrice).toHaveText(price)
    },

    /** `imageName` sem extensão; aceita o sufixo de hash que o Vite adiciona no build. */
    async expectCarImage(imageName: string): Promise<void> {
      await expect(elements.carImage).toHaveAttribute(
        'src',
        new RegExp(`/${imageName}(-[\\w-]{8})?\\.png$`),
      )
    },
  }
}
