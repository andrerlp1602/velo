import { test } from '../support/fixtures'
import { generateOrderCode } from '../support/helpers'
import type { OrderOverrides } from '../support/types/order'
import data from '../support/data/pedidos.json' with { type: 'json' }

const scenarios = data as Record<string, OrderOverrides>

test.describe('Consulta de Pedido', () => {
  test.beforeEach(async ({ app }) => {
    await app.orderLookup.open()
  })

  for (const [scenario, overrides] of Object.entries(scenarios)) {
    test(`deve consultar um pedido ${scenario.replace('_', ' ')}`, async ({ app, orders }) => {
      const order = await orders.create(overrides)

      await app.orderLookup.searchOrder(order.number)
      await app.orderLookup.expectOrderDetails(order)
      await app.orderLookup.expectStatusBadge(order.status)
    })
  }

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ app }) => {
    await app.orderLookup.searchOrder(generateOrderCode())
    await app.orderLookup.expectOrderNotFound()
  })

  test('deve exibir mensagem quando o código do pedido está fora do padrão', async ({ app }) => {
    await app.orderLookup.searchOrder('XYZ-999-INVALIDO')
    await app.orderLookup.expectOrderNotFound()
  })

  test('deve manter o botão de busca desabilitado com campo vazio ou apenas espaços', async ({
    app,
  }) => {
    await app.orderLookup.expectSearchDisabled()

    await app.orderLookup.fillOrderCode('     ')
    await app.orderLookup.expectSearchDisabled()
  })
})
