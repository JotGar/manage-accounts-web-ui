// useBudget Hook
// Custom hook for managing budget with React state

import { useState, useEffect, useCallback } from "react"
import { budgetService } from "@/src/services/budget"
import type { FixedIncome, FixedExpense, CreateBudgetItemInput } from "@/src/types/budget"

interface UseBudgetReturn {
  fixedIncomes: FixedIncome[]
  fixedExpenses: FixedExpense[]
  isLoading: boolean
  error: string | null
  addIncome: (input: CreateBudgetItemInput) => void
  deleteIncome: (id: number) => void
  addExpense: (input: CreateBudgetItemInput) => void
  deleteExpense: (id: number) => void
  refreshBudget: () => void
}

export const useBudget = (): UseBudgetReturn => {
  const [fixedIncomes, setFixedIncomes] = useState<FixedIncome[]>([])
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load data initially
  const refreshBudget = useCallback(() => {
    try {
      setIsLoading(true)
      setError(null)
      const incomes = budgetService.getIncomes()
      const expenses = budgetService.getExpenses()
      setFixedIncomes(incomes)
      setFixedExpenses(expenses)
    } catch (err) {
      setError("Error loading budget")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshBudget()
  }, [refreshBudget])

  // Add income
  const addIncome = useCallback((input: CreateBudgetItemInput) => {
    try {
      setError(null)
      const newIncome = budgetService.createIncome(input)
      setFixedIncomes((prev) => [...prev, newIncome])
    } catch (err) {
      setError("Error creating income")
      console.error(err)
    }
  }, [])

  // Delete income
  const deleteIncome = useCallback((id: number) => {
    try {
      setError(null)
      const success = budgetService.deleteIncome(id)
      if (success) {
        setFixedIncomes((prev) => prev.filter((i) => i.id !== id))
      }
    } catch (err) {
      setError("Error deleting income")
      console.error(err)
    }
  }, [])

  // Add expense
  const addExpense = useCallback((input: CreateBudgetItemInput) => {
    try {
      setError(null)
      const newExpense = budgetService.createExpense(input)
      setFixedExpenses((prev) => [...prev, newExpense])
    } catch (err) {
      setError("Error creating expense")
      console.error(err)
    }
  }, [])

  // Delete expense
  const deleteExpense = useCallback((id: number) => {
    try {
      setError(null)
      const success = budgetService.deleteExpense(id)
      if (success) {
        setFixedExpenses((prev) => prev.filter((g) => g.id !== id))
      }
    } catch (err) {
      setError("Error deleting expense")
      console.error(err)
    }
  }, [])

  return {
    fixedIncomes,
    fixedExpenses,
    isLoading,
    error,
    addIncome,
    deleteIncome,
    addExpense,
    deleteExpense,
    refreshBudget,
  }
}
