// Budget Service
// Lógica de negocio para presupuesto (ingresos fijos y gastos fijos) - usa localStorage

import { STORAGE_KEYS } from "@/src/constants/storage-keys"
import { getLocalStorage, setLocalStorage } from "@/src/lib/storage"
import type { IngresoFijo, GastoFijo, CreateBudgetItemInput } from "@/src/types/budget"

// ============================================================================
// INGRESOS FIJOS
// ============================================================================

const getStoredIngresos = (): IngresoFijo[] => {
  return getLocalStorage<IngresoFijo[]>(STORAGE_KEYS.INGRESOS_FIJOS, [])
}

const saveIngresos = (ingresos: IngresoFijo[]): void => {
  setLocalStorage(STORAGE_KEYS.INGRESOS_FIJOS, ingresos)
}

// ============================================================================
// GASTOS FIJOS
// ============================================================================

const getStoredGastos = (): GastoFijo[] => {
  return getLocalStorage<GastoFijo[]>(STORAGE_KEYS.GASTOS_FIJOS, [])
}

const saveGastos = (gastos: GastoFijo[]): void => {
  setLocalStorage(STORAGE_KEYS.GASTOS_FIJOS, gastos)
}

// ============================================================================
// EXPORT
// ============================================================================

export const budgetService = {
  // -------------------- INGRESOS --------------------

  /**
   * Obtener todos los ingresos fijos
   */
  getIngresos: (): IngresoFijo[] => {
    return getStoredIngresos()
  },

  /**
   * Crear un nuevo ingreso fijo
   */
  createIngreso: (input: CreateBudgetItemInput): IngresoFijo => {
    const ingresos = getStoredIngresos()
    
    const newIngreso: IngresoFijo = {
      ...input,
      id: Math.max(0, ...ingresos.map((i) => i.id)) + 1,
    }

    const updatedIngresos = [...ingresos, newIngreso]
    saveIngresos(updatedIngresos)
    
    return newIngreso
  },

  /**
   * Eliminar un ingreso fijo
   */
  deleteIngreso: (id: number): boolean => {
    const ingresos = getStoredIngresos()
    const index = ingresos.findIndex((i) => i.id === id)
    
    if (index === -1) return false

    const updatedIngresos = ingresos.filter((i) => i.id !== id)
    saveIngresos(updatedIngresos)
    
    return true
  },

  // -------------------- GASTOS --------------------

  /**
   * Obtener todos los gastos fijos
   */
  getGastos: (): GastoFijo[] => {
    return getStoredGastos()
  },

  /**
   * Crear un nuevo gasto fijo
   */
  createGasto: (input: CreateBudgetItemInput): GastoFijo => {
    const gastos = getStoredGastos()
    
    const newGasto: GastoFijo = {
      ...input,
      id: Math.max(0, ...gastos.map((g) => g.id)) + 1,
    }

    const updatedGastos = [...gastos, newGasto]
    saveGastos(updatedGastos)
    
    return newGasto
  },

  /**
   * Eliminar un gasto fijo
   */
  deleteGasto: (id: number): boolean => {
    const gastos = getStoredGastos()
    const index = gastos.findIndex((g) => g.id === id)
    
    if (index === -1) return false

    const updatedGastos = gastos.filter((g) => g.id !== id)
    saveGastos(updatedGastos)
    
    return true
  },
}
