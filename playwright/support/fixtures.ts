import { test as base } from '@playwright/test'
import type { Kysely } from 'kysely'

import { createCheckoutActions } from './actions/checkoutActions'
import { createConfiguratorActions } from './actions/configuratorActions'
import { createOrderLookupActions } from './actions/orderLookupActions'
import { createDatabase } from './database/database'
import { createOrderRepository } from './database/orderRepository'
import type { Database } from './database/schema'
import { buildOrder } from './factories/order'
import type { Order, OrderOverrides } from './types/order'

type App = {
  checkout: ReturnType<typeof createCheckoutActions>
  configurator: ReturnType<typeof createConfiguratorActions>
  orderLookup: ReturnType<typeof createOrderLookupActions>
}

type Orders = {
  create(overrides?: OrderOverrides): Promise<Order>
  track(orderNumber: string): void
  findByNumber: ReturnType<typeof createOrderRepository>['findByNumber']
}

type TestFixtures = {
  app: App
  orders: Orders
}

type WorkerFixtures = {
  db: Kysely<Database>
}

export const test = base.extend<TestFixtures, WorkerFixtures>({
  db: [
    async ({}, use) => {
      const db = createDatabase()
      await use(db)
      await db.destroy()
    },
    { scope: 'worker' },
  ],

  app: async ({ page }, use) => {
    await use({
      checkout: createCheckoutActions(page),
      configurator: createConfiguratorActions(page),
      orderLookup: createOrderLookupActions(page),
    })
  },

  orders: async ({ db }, use) => {
    const repository = createOrderRepository(db)
    const createdOrders: string[] = []

    await use({
      async create(overrides = {}) {
        const order = buildOrder(overrides)
        await repository.insert(order)
        createdOrders.push(order.number)
        return order
      },
      track(orderNumber) {
        createdOrders.push(orderNumber)
      },
      findByNumber: repository.findByNumber,
    })

    for (const orderNumber of createdOrders) {
      await repository.deleteByNumber(orderNumber)
    }
  },
})

export { expect } from '@playwright/test'
