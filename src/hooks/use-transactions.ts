// useTransactions Hook
// Hook personalizado para gestionar transacciones con estado de React

import { useState, useEffect, useCallback } from "react"
import { transactionsService } from "@/src/services/transactions"
import type { Transaction, CreateTransactionInput } from "@/src/types/transaction"

interface UseTransactionsReturn {
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
  addTransaction: (transaction: CreateTransactionInput) => void
  deleteTransaction: (id: number) => void
  refreshTransactions: () => void
  getByAccount: (accountName: string) => Transaction[]
  getByType: (type: "income" | "expense" | "transfer") => Transaction[]
}

export const useTransactions = (): UseTransactionsReturn => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar transacciones inicialmente
  const refreshTransactions = useCallback(() => {
    try {
      setIsLoading(true)
      setError(null)
      const data = transactionsService.getAll()
      setTransactions(data)
    } catch (err) {
      setError("Error al cargar transacciones")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshTransactions()
  }, [refreshTransactions])

  // Agregar transacción
  const addTransaction = useCallback((input: CreateTransactionInput) => {
    try {
      setError(null)
      const newTransaction = transactionsService.create(input)
      setTransactions((prev) => [...prev, newTransaction])
    } catch (err) {
      setError("Error al crear transacción")
      console.error(err)
    }
  }, [])

  // Eliminar transacción
  const deleteTransaction = useCallback((id: number) => {
    try {
      setError(null)
      const success = transactionsService.delete(id)
      if (success) {
        setTransactions((prev) => prev.filter((t) => t.id !== id))
      }
    } catch (err) {
      setError("Error al eliminar transacción")
      console.error(err)
    }
  }, [])

  // Obtener transacciones por cuenta
  const getByAccount = useCallback((accountName: string) => {
    return transactionsService.getByAccount(accountName)
  }, [])

  // Obtener transacciones por tipo
  const getByType = useCallback((type: "income" | "expense" | "transfer") => {
    return transactionsService.getByType(type)
  }, [])

  return {
    transactions,
    isLoading,
    error,
    addTransaction,
    deleteTransaction,
    refreshTransactions,
    getByAccount,
    getByType,
  }
}
