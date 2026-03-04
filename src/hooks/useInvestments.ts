// useInvestments Hook
// Custom hook for managing investments with React state

import { useState, useEffect, useCallback } from "react"
import { investmentsService } from "@/src/services/investments"
import type { Investment, CreateInvestmentInput } from "@/src/types/investment"

interface UseInvestmentsReturn {
  investments: Investment[]
  isLoading: boolean
  error: string | null
  addInvestment: (input: CreateInvestmentInput) => void
  deleteInvestment: (id: number) => void
  adjustInvestment: (id: number, newAmount: number, reason: string) => void
  refreshInvestments: () => void
}

export const useInvestments = (): UseInvestmentsReturn => {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load investments initially
  const refreshInvestments = useCallback(() => {
    try {
      setIsLoading(true)
      setError(null)
      const data = investmentsService.getAll()
      setInvestments(data)
    } catch (err) {
      setError("Error loading investments")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshInvestments()
  }, [refreshInvestments])

  // Add investment
  const addInvestment = useCallback((input: CreateInvestmentInput) => {
    try {
      setError(null)
      const newInvestment = investmentsService.create(input)
      setInvestments((prev) => [...prev, newInvestment])
    } catch (err) {
      setError("Error creating investment")
      console.error(err)
    }
  }, [])

  // Delete investment
  const deleteInvestment = useCallback((id: number) => {
    try {
      setError(null)
      const success = investmentsService.delete(id)
      if (success) {
        setInvestments((prev) => prev.filter((i) => i.id !== id))
      }
    } catch (err) {
      setError("Error deleting investment")
      console.error(err)
    }
  }, [])

  // Adjust investment
  const adjustInvestment = useCallback((id: number, newAmount: number, reason: string) => {
    try {
      setError(null)
      const updatedInvestment = investmentsService.adjust(id, newAmount, reason)
      if (updatedInvestment) {
        setInvestments((prev) =>
          prev.map((i) => (i.id === id ? updatedInvestment : i))
        )
      }
    } catch (err) {
      setError("Error adjusting investment")
      console.error(err)
    }
  }, [])

  return {
    investments,
    isLoading,
    error,
    addInvestment,
    deleteInvestment,
    adjustInvestment,
    refreshInvestments,
  }
}
