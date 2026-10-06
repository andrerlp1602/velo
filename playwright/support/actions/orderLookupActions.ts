import { Page, expect } from '@playwright/test'
import type { ExteriorColor, Order, OrderStatus, PaymentMethod } from '../types/order'

const colorLabels: Record<ExteriorColor, string> = {
  'glacier-blue': 'Glacier Blue',
  'lunar-white': 'Lunar White',
  'midnight-black': 'Midnight Black',
}

const paymentLabels: Record<PaymentMethod, string> = {
  avista: 'À Vista',
  financiamento: 'Financiamento 12x',
}

const statusTones: Record<OrderStatus, string> = {
  APROVADO: 'success',
  REPROVADO: 'danger',
  EM_ANALISE: 'warning',
}

export function createOrderLookupActions(page: Page) {
  const elements = {
    heroTitle: page.getByTestId('hero-section').getByRole('heading'),
    lookupLink: page.getByRole('link', { name: 'Consultar Pedido' }),
    pageHeading: page.getByRole('heading', { name: 'Consultar Pedido' }),
    orderInput: page.getByRole('textbox', { name: 'Número do Pedido' }),
    searchButton: page.getByRole('button', { name: 'Buscar Pedido' }),
    statusBadge: page.getByRole('status'),
    orderResult: (orderNumber: string) => page.getByTestId(`order-result-${orderNumber}`),
  }

  return {
    elements,

    async open(): Promise<void> {
      await page.goto('/')
      await expect(elements.heroTitle).toContainText('Velô Sprint')

      await elements.lookupLink.click()
      await expect(elements.pageHeading).toBeVisible()
    },

    async fillOrderCode(code: string): Promise<void> {
      await elements.orderInput.fill(code)
    },

    async searchOrder(code: string): Promise<void> {
      await elements.orderInput.fill(code)
      await elements.searchButton.click()
    },

    async expectOrderDetails(order: Order): Promise<void> {
      await expect(elements.orderResult(order.number)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - status:
        - img
        - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${colorLabels[order.color]}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: ${order.wheels} Wheels
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${paymentLabels[order.payment]}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `)
    },

    async expectStatusBadge(status: OrderStatus): Promise<void> {
      await expect(elements.statusBadge).toHaveText(status)
      await expect(elements.statusBadge).toHaveAttribute('data-tone', statusTones[status])
    },

    async expectOrderNotFound(): Promise<void> {
      await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
      `)
    },

    async expectSearchDisabled(): Promise<void> {
      await expect(elements.searchButton).toBeDisabled()
    },
  }
}
