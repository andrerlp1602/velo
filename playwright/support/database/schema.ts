import type { ColumnType } from 'kysely'

export interface OrderTable {
  id: string
  order_number: string
  color: string
  wheel_type: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_cpf: string
  payment_method: string
  total_price: ColumnType<string, number, number>
  status: string
  created_at: ColumnType<Date, string, string>
  updated_at: ColumnType<Date, string, string>
  optionals: string[] | null
}

export interface Database {
  orders: OrderTable
}
