import { generateCpf, generateOrderCode, generatePhone, uniqueEmail } from '../helpers'
import type { Customer, Order, OrderOverrides } from '../types/order'

export function buildCustomer(overrides: Partial<Customer> = {}): Customer {
  return {
    name: 'Cliente Teste',
    email: uniqueEmail(),
    phone: generatePhone(),
    document: generateCpf(),
    ...overrides,
  }
}

export function buildOrder(overrides: OrderOverrides = {}): Order {
  const { customer, ...orderOverrides } = overrides

  return {
    number: generateOrderCode(),
    status: 'APROVADO',
    color: 'glacier-blue',
    wheels: 'aero',
    optionals: [],
    payment: 'avista',
    totalPrice: 40000,
    ...orderOverrides,
    customer: buildCustomer(customer),
  }
}
