// types/transaction.ts
/**
 * Tipos para transacciones (ingresos, gastos, transferencias)
 */

import { Currency } from "./products"

export type TransactionType = "income" | "expense" | "transfer"

export type TransactionCategory =
  // Ingresos
  | "Salario"
  | "Trabajo Independiente"
  | "Inversiones"
  | "Ventas"
  | "Otros Ingresos"
  // Gastos
  | "Vivienda"
  | "Servicios"
  | "Alimentación"
  | "Transporte"
  | "Salud"
  | "Educación"
  | "Entretenimiento"
  | "Otros Gastos"
  // Transferencias
  | "Transferencia"

export interface Transaction {
  id: string
  type: TransactionType
  amount: string
  // Categoría por nombre. La API de transacciones solo expone category_id (UUID),
  // no el nombre de la categoría, por lo que puede no estar disponible al leer desde API.
  category?: TransactionCategory
  description: string
  date: string // ISO date string (YYYY-MM-DD)
  currency: Currency
  // Para income y expense
  account?: string
  // Para transfers
  fromAccount?: string
  toAccount?: string
}

export interface CreateTransactionInput {
  type: TransactionType
  amount: string
  category: TransactionCategory
  description: string
  date: string
  currency: Currency
  account?: string
  fromAccount?: string
  toAccount?: string
  // IDs opacos requeridos por la API de Node (product_id/category_id). El formulario
  // aún no los captura, por lo que la creación contra API real los envía vacíos y
  // cae a mock; ver nota de integración.
  productId?: string
  categoryId?: string | null
}