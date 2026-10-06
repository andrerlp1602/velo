import type { Kysely } from 'kysely'
import type { Order } from '../types/order'
import type { Database } from './schema'
import { toOrderRow } from './orderMapper'

export type OrderRepository = ReturnType<typeof createOrderRepository>

export function createOrderRepository(db: Kysely<Database>) {
  return {
    async insert(order: Order): Promise<void> {
      await db.insertInto('orders').values(toOrderRow(order)).execute()
    },

    async deleteByNumber(orderNumber: string): Promise<void> {
      await db.deleteFrom('orders').where('order_number', '=', orderNumber).execute()
    },

    async findByNumber(orderNumber: string) {
      return db
        .selectFrom('orders')
        .selectAll()
        .where('order_number', '=', orderNumber)
        .executeTakeFirst()
    },
  }
}
