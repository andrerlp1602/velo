import { db } from "./database";
import { OrderTable } from "./schema";
import { OrderDetails } from "../actions/orderLookupActions";
import crypto from "crypto";

function formatarTexto(texto: string) {
  if (!texto) return "";

  return texto
    .normalize("NFD") // Separa os acentos das letras
    .replace(/[\u0300-\u036f]/g, "") // Remove todos os acentos
    .replace(/\s+/g, "") // Remove os espaços
    .toLowerCase(); // Converte para minúsculas
}

export async function insertOrder(order: OrderDetails) {
  const data: OrderTable = {
    id: crypto.randomUUID(),
    order_number: order.number,
    color: order.color.replace(" ", "-").toLowerCase(),
    wheel_type: order.wheels.replace("Wheels", "").toLowerCase(),
    customer_name: order.customer.name,
    customer_email: order.customer.email,
    customer_phone: order.customer.phone,
    customer_cpf: order.customer.document,
    payment_method: formatarTexto(order.payment),
    total_price: order.total_price,
    status: order.status,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    optionals: [],
  };
  await db.insertInto("orders").values(data).execute();
}

export async function deleteOrderByNumber(orderNumber: string) {
  await db
    .deleteFrom("orders")
    .where("order_number", "=", orderNumber)
    .execute();
}
