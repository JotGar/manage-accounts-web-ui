// types/transaction.ts
/**
 * Tipos para transacciones (ingresos, gastos, transferencias)
 */

import { Currency } from "./producto"

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
  id: number
  type: TransactionType
  amount: number
  category: TransactionCategory
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
  amount: number
  category: TransactionCategory
  description: string
  date: string
  currency: Currency
  account?: string
  fromAccount?: string
  toAccount?: string
}