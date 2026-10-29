// useInvestments Hook
// Hook personalizado para gestionar inversiones con estado de React

import { useState, useEffect, useCallback } from "react"
import {
  getInvestments,
  getInvestmentById,
  createInvestment,
  adjustInvestment as adjustInvestmentApi,
  deleteInvestment as deleteInvestmentApi,
} from "@/src/services/api-investments"
import type { Investment, CreateInvestmentInput } from "@/src/types/investment"

interface UseInvestmentsReturn {
  investments: Investment[]
  isLoading: boolean
  error: string | null
  addInvestment: (investment: CreateInvestmentInput) => void
  adjustInvestment: (id: number, newAmount: number, reason: string) => void
  deleteInvestment: (id: number) => void
  refreshInvestments: () => void
  getById: (id: number) => Promise<Investment | undefined>
}

export const useInvestments = (): UseInvestmentsReturn => {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar inversiones inicialmente
  const refreshInvestments = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const { data } = await getInvestments({})
      setInvestments(data)
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
  const addInvestment = useCallback(async (input: CreateInvestmentInput) => {
    try {
      setError(null)
      const newInvestment = await createInvestment(input)
      setInvestments((prev) => [...prev, newInvestment])
    } catch (err) {
      setError("Error al crear inversión")
      console.error(err)
    }
  }, [])

  // Ajustar inversión
  const adjustInvestment = useCallback(async (id: number, newAmount: number, reason: string) => {
    try {
      setError(null)
      const updatedInvestment = await adjustInvestmentApi(id, newAmount, reason)
      if (updatedInvestment) {
        setInvestments((prev) =>
          prev.map((i) => (i.id === id ? updatedInvestment : i))
        )
      }
    } catch (err) {
      setError("Error al ajustar inversión")
      console.error(err)
    }
  }, [])

  // Eliminar inversión
  const deleteInvestment = useCallback(async (id: number) => {
    try {
      setError(null)
      const success = await deleteInvestmentApi(id)
      if (success) {
        setInvestments((prev) => prev.filter((i) => i.id !== id))
      }
    } catch (err) {
      setError("Error al eliminar inversión")
      console.error(err)
    }
  }, [])

  // Obtener inversión por ID
  const getById = useCallback(async (id: number) => {
    return await getInvestmentById(id)
  }, [])

  return {
    investments,
    isLoading,
    error,
    addInvestment,
    adjustInvestment,
    deleteInvestment,
    refreshInvestments,
    getById,
  }
}