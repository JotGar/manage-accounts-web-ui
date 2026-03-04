// Investments Service
// Lógica de negocio para inversiones - usa localStorage para persistencia

import { STORAGE_KEYS } from "@/src/constants/storage-keys"
import { getLocalStorage, setLocalStorage } from "@/src/lib/storage"
import type { Investment, CreateInvestmentInput, InvestmentAdjustment } from "@/src/types/investment"

/**
 * Obtiene las inversiones desde localStorage
 */
const getStoredInvestments = (): Investment[] => {
  return getLocalStorage<Investment[]>(STORAGE_KEYS.INVESTMENTS, [])
}

/**
 * Guarda las inversiones en localStorage
 */
const saveInvestments = (investments: Investment[]): void => {
  setLocalStorage(STORAGE_KEYS.INVESTMENTS, investments)
}

export const investmentsService = {
  /**
   * Obtener todas las inversiones
   */
  getAll: (): Investment[] => {
    return getStoredInvestments()
  },

  /**
   * Obtener una inversión por ID
   */
  getById: (id: number): Investment | undefined => {
    const investments = getStoredInvestments()
    return investments.find((i) => i.id === id)
  },

  /**
   * Crear una nueva inversión
   */
  create: (input: CreateInvestmentInput): Investment => {
    const investments = getStoredInvestments()
    
    const newInvestment: Investment = {
      ...input,
      id: Math.max(0, ...investments.map((i) => i.id)) + 1,
      currentAmount: input.currentAmount ?? input.initialAmount,
      status: input.status ?? "Activa",
      adjustments: [],
    }

    const updatedInvestments = [...investments, newInvestment]
    saveInvestments(updatedInvestments)
    
    return newInvestment
  },

  /**
   * Eliminar una inversión
   */
  delete: (id: number): boolean => {
    const investments = getStoredInvestments()
    const index = investments.findIndex((i) => i.id === id)
    
    if (index === -1) return false

    const updatedInvestments = investments.filter((i) => i.id !== id)
    saveInvestments(updatedInvestments)
    
    return true
  },

  /**
   * Ajustar el valor de una inversión (agregar ajuste)
   */
  adjust: (id: number, newAmount: number, reason: string): Investment | undefined => {
    const investments = getStoredInvestments()
    const index = investments.findIndex((i) => i.id === id)
    
    if (index === -1) return undefined

    const investment = investments[index]
    const adjustmentType: "increase" | "decrease" = newAmount > investment.currentAmount ? "increase" : "decrease"

    const newAdjustment: InvestmentAdjustment = {
      id: Math.max(0, ...investment.adjustments.map((a) => a.id)) + 1,
      date: new Date().toISOString().split("T")[0],
      previousAmount: investment.currentAmount,
      newAmount: newAmount,
      reason: reason,
      type: adjustmentType,
    }

    const updatedInvestment: Investment = {
      ...investment,
      currentAmount: newAmount,
      adjustments: [...investment.adjustments, newAdjustment],
    }

    const updatedInvestments = [...investments]
    updatedInvestments[index] = updatedInvestment
    saveInvestments(updatedInvestments)
    
    return updatedInvestment
  },
}
