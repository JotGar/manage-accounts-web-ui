// types/budget.ts
/**
 * Tipos para presupuesto (ingresos fijos y gastos fijos)
 */

import { Currency } from "./producto"

export type BudgetFrequency = 
  | "Diario"
  | "Semanal"
  | "Quincenal"
  | "Mensual"
  | "Bimestral"
  | "Trimestral"
  | "Semestral"
  | "Anual"

export type BudgetCategory =
  // Categorías de Ingresos
  | "Salario"
  | "Trabajo Independiente"
  | "Bonificaciones"
  | "Inversiones"
  | "Alquileres"
  | "Otros Ingresos"
  // Categorías de Gastos
  | "Vivienda"
  | "Servicios"
  | "Alimentación"
  | "Transporte"
  | "Salud"
  | "Educación"
  | "Seguros"
  | "Deudas"
  | "Entretenimiento"
  | "Ahorro"
  | "Otros Gastos"

export interface BudgetItem {
  id: number
  name: string
  amount: number
  currency: Currency
  category: BudgetCategory
  frequency: BudgetFrequency
}

export interface CreateBudgetItemInput {
  name: string
  amount: number
  currency: Currency
  category: BudgetCategory
  frequency: BudgetFrequency
}

// Tipos específicos para mayor claridad
export type IngresoFijo = BudgetItem
export type GastoFijo = BudgetItem