// useBudget Hook
// Hook personalizado para gestionar presupuesto con estado de React

import { useState, useEffect, useCallback } from "react"
import { budgetService } from "@/src/services/budget"
import type { IngresoFijo, GastoFijo, CreateBudgetItemInput } from "@/src/types/budget"

interface UseBudgetReturn {
  ingresosFijos: IngresoFijo[]
  gastosFijos: GastoFijo[]
  isLoading: boolean
  error: string | null
  addIngreso: (input: CreateBudgetItemInput) => void
  deleteIngreso: (id: number) => void
  addGasto: (input: CreateBudgetItemInput) => void
  deleteGasto: (id: number) => void
  refreshBudget: () => void
}

export const useBudget = (): UseBudgetReturn => {
  const [ingresosFijos, setIngresosFijos] = useState<IngresoFijo[]>([])
  const [gastosFijos, setGastosFijos] = useState<GastoFijo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar datos inicialmente
  const refreshBudget = useCallback(() => {
    try {
      setIsLoading(true)
      setError(null)
      const ingresos = budgetService.getIngresos()
      const gastos = budgetService.getGastos()
      setIngresosFijos(ingresos)
      setGastosFijos(gastos)
    } catch (err) {
      setError("Error al cargar presupuesto")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshBudget()
  }, [refreshBudget])

  // Agregar ingreso
  const addIngreso = useCallback((input: CreateBudgetItemInput) => {
    try {
      setError(null)
      const newIngreso = budgetService.createIngreso(input)
      setIngresosFijos((prev) => [...prev, newIngreso])
    } catch (err) {
      setError("Error al crear ingreso")
      console.error(err)
    }
  }, [])

  // Eliminar ingreso
  const deleteIngreso = useCallback((id: number) => {
    try {
      setError(null)
      const success = budgetService.deleteIngreso(id)
      if (success) {
        setIngresosFijos((prev) => prev.filter((i) => i.id !== id))
      }
    } catch (err) {
      setError("Error al eliminar ingreso")
      console.error(err)
    }
  }, [])

  // Agregar gasto
  const addGasto = useCallback((input: CreateBudgetItemInput) => {
    try {
      setError(null)
      const newGasto = budgetService.createGasto(input)
      setGastosFijos((prev) => [...prev, newGasto])
    } catch (err) {
      setError("Error al crear gasto")
      console.error(err)
    }
  }, [])

  // Eliminar gasto
  const deleteGasto = useCallback((id: number) => {
    try {
      setError(null)
      const success = budgetService.deleteGasto(id)
      if (success) {
        setGastosFijos((prev) => prev.filter((g) => g.id !== id))
      }
    } catch (err) {
      setError("Error al eliminar gasto")
      console.error(err)
    }
  }, [])

  return {
    ingresosFijos,
    gastosFijos,
    isLoading,
    error,
    addIngreso,
    deleteIngreso,
    addGasto,
    deleteGasto,
    refreshBudget,
  }
}
