import { randomUUID } from 'node:crypto'
import type { Insertable } from 'kysely'
import type { Order } from '../types/order'
import type { OrderTable } from './schema'

export function toOrderRow(order: Order): Insertable<OrderTable> {
  const now = new Date().toISOString()

  return {
    id: randomUUID(),
    order_number: order.number,
    color: order.color,
    wheel_type: order.wheels,
    optionals: order.optionals,
    customer_name: order.customer.name,
    customer_email: order.customer.email,
    customer_phone: order.customer.phone,
    customer_cpf: order.customer.document,
    payment_method: order.payment,
    total_price: order.totalPrice,
    status: order.status,
    created_at: now,
    updated_at: now,
  }
}
