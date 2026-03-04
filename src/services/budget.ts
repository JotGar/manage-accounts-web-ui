// Budget Service
// Business logic for budget (fixed incomes and expenses) - uses localStorage

import { STORAGE_KEYS } from "@/src/constants/storage-keys"
import { getLocalStorage, setLocalStorage } from "@/src/lib/storage"
import type { FixedIncome, FixedExpense, CreateBudgetItemInput } from "@/src/types/budget"

// ============================================================================
// FIXED INCOMES
// ============================================================================

const getStoredIncomes = (): FixedIncome[] => {
  return getLocalStorage<FixedIncome[]>(STORAGE_KEYS.FIXED_INCOMES, [])
}

const saveIncomes = (incomes: FixedIncome[]): void => {
  setLocalStorage(STORAGE_KEYS.FIXED_INCOMES, incomes)
}

// ============================================================================
// FIXED EXPENSES
// ============================================================================

const getStoredExpenses = (): FixedExpense[] => {
  return getLocalStorage<FixedExpense[]>(STORAGE_KEYS.FIXED_EXPENSES, [])
}

const saveExpenses = (expenses: FixedExpense[]): void => {
  setLocalStorage(STORAGE_KEYS.FIXED_EXPENSES, expenses)
}

// ============================================================================
// EXPORT
// ============================================================================

export const budgetService = {
  // -------------------- INCOMES --------------------

  /**
   * Get all fixed incomes
   */
  getIncomes: (): FixedIncome[] => {
    return getStoredIncomes()
  },

  /**
   * Create a new fixed income
   */
  createIncome: (input: CreateBudgetItemInput): FixedIncome => {
    const incomes = getStoredIncomes()
    
    const newIncome: FixedIncome = {
      ...input,
      id: Math.max(0, ...incomes.map((i) => i.id)) + 1,
    }

    const updatedIncomes = [...incomes, newIncome]
    saveIncomes(updatedIncomes)
    
    return newIncome
  },

  /**
   * Delete a fixed income
   */
  deleteIncome: (id: number): boolean => {
    const incomes = getStoredIncomes()
    const index = incomes.findIndex((i) => i.id === id)
    
    if (index === -1) return false

    const updatedIncomes = incomes.filter((i) => i.id !== id)
    saveIncomes(updatedIncomes)
    
    return true
  },

  // -------------------- EXPENSES --------------------

  /**
   * Get all fixed expenses
   */
  getExpenses: (): FixedExpense[] => {
    return getStoredExpenses()
  },

  /**
   * Create a new fixed expense
   */
  createExpense: (input: CreateBudgetItemInput): FixedExpense => {
    const expenses = getStoredExpenses()
    
    const newExpense: FixedExpense = {
      ...input,
      id: Math.max(0, ...expenses.map((g) => g.id)) + 1,
    }

    const updatedExpenses = [...expenses, newExpense]
    saveExpenses(updatedExpenses)
    
    return newExpense
  },

  /**
   * Delete a fixed expense
   */
  deleteExpense: (id: number): boolean => {
    const expenses = getStoredExpenses()
    const index = expenses.findIndex((g) => g.id === id)
    
    if (index === -1) return false

    const updatedExpenses = expenses.filter((g) => g.id !== id)
    saveExpenses(updatedExpenses)
    
    return true
  },
}
