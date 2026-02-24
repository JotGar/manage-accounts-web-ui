// types/investment.ts
/**
 * Tipos para inversiones y ajustes
 */

import { Currency } from "./producto"

export type InvestmentType =
  | "Acciones"
  | "Bonos"
  | "ETF"
  | "Fondos Mutuos"
  | "CDT"
  | "Bienes Raíces"
  | "Criptomonedas"
  | "Commodities"
  | "Otros"

export type InvestmentStatus = "Activa" | "Cerrada" | "En Espera"

export type AdjustmentType = "increase" | "decrease"

export interface InvestmentAdjustment {
  id: number
  date: string // ISO date string (YYYY-MM-DD)
  previousAmount: number
  newAmount: number
  reason: string
  type: AdjustmentType
}

export interface Investment {
  id: number
  name: string
  type: InvestmentType
  initialAmount: number
  currentAmount: number
  currency: Currency
  expectedReturn: number // Porcentaje (ej: 8.5 para 8.5%)
  startDate: string // ISO date string (YYYY-MM-DD)
  status: InvestmentStatus
  adjustments: InvestmentAdjustment[]
}

export interface CreateInvestmentInput {
  name: string
  type: InvestmentType
  initialAmount: number
  currentAmount?: number // Opcional, por defecto igual a initialAmount
  currency: Currency
  expectedReturn: number
  startDate: string
  status?: InvestmentStatus
}

export interface AdjustInvestmentInput {
  investmentId: number
  newAmount: number
  reason: string
  date?: string // Opcional, por defecto la fecha actual
}