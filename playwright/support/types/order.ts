export type OrderStatus = 'APROVADO' | 'REPROVADO' | 'EM_ANALISE'

export type ExteriorColor = 'glacier-blue' | 'lunar-white' | 'midnight-black'

export type WheelType = 'aero' | 'sport'

export type PaymentMethod = 'avista' | 'financiamento'

export type Customer = {
  name: string
  email: string
  phone: string
  document: string
}

export type Order = {
  number: string
  status: OrderStatus
  color: ExteriorColor
  wheels: WheelType
  optionals: string[]
  customer: Customer
  payment: PaymentMethod
  totalPrice: number
}

export type OrderOverrides = Partial<Omit<Order, 'customer'>> & {
  customer?: Partial<Customer>
}
