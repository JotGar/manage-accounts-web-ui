// useInvestments Hook
// Hook personalizado para gestionar inversiones con estado de React

import { useState, useEffect, useCallback } from "react"
import { investmentsService } from "@/src/services/investments"
import type { Investment, CreateInvestmentInput } from "@/src/types/investment"

interface UseInvestmentsReturn {
  inversiones: Investment[]
  isLoading: boolean
  error: string | null
  addInversion: (input: CreateInvestmentInput) => void
  deleteInversion: (id: number) => void
  adjustInversion: (id: number, newAmount: number, reason: string) => void
  refreshInvestments: () => void
}

export const useInvestments = (): UseInvestmentsReturn => {
  const [inversiones, setInversiones] = useState<Investment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar inversiones inicialmente
  const refreshInvestments = useCallback(() => {
    try {
      setIsLoading(true)
      setError(null)
      const data = investmentsService.getAll()
      setInversiones(data)
    } catch (err) {
      setError("Error al cargar inversiones")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshInvestments()
  }, [refreshInvestments])

  // Agregar inversión
  const addInversion = useCallback((input: CreateInvestmentInput) => {
    try {
      setError(null)
      const newInversion = investmentsService.create(input)
      setInversiones((prev) => [...prev, newInversion])
    } catch (err) {
      setError("Error al crear inversión")
      console.error(err)
    }
  }, [])

  // Eliminar inversión
  const deleteInversion = useCallback((id: number) => {
    try {
      setError(null)
      const success = investmentsService.delete(id)
      if (success) {
        setInversiones((prev) => prev.filter((i) => i.id !== id))
      }
    } catch (err) {
      setError("Error al eliminar inversión")
      console.error(err)
    }
  }, [])

  // Ajustar inversión
  const adjustInversion = useCallback((id: number, newAmount: number, reason: string) => {
    try {
      setError(null)
      const updatedInversion = investmentsService.adjust(id, newAmount, reason)
      if (updatedInversion) {
        setInversiones((prev) =>
          prev.map((i) => (i.id === id ? updatedInversion : i))
        )
      }
    } catch (err) {
      setError("Error al ajustar inversión")
      console.error(err)
    }
  }, [])

  return {
    inversiones,
    isLoading,
    error,
    addInversion,
    deleteInversion,
    adjustInversion,
    refreshInvestments,
  }
}
