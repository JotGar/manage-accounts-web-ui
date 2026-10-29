// useTransactions Hook
// Hook personalizado para gestionar transacciones con estado de React

import { useState, useEffect, useCallback } from "react"
import {
  getTransactions,
  createTransaction,
  deleteTransaction as deleteTransactionApi,
  getTransactionsByAccount,
  getTransactionsByType,
} from "@/src/services/api-transactions"
import type { Transaction, CreateTransactionInput } from "@/src/types/transaction"

interface UseTransactionsReturn {
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
  addTransaction: (transaction: CreateTransactionInput) => void
  deleteTransaction: (id: string) => void
  refreshTransactions: () => void
  getByAccount: (accountName: string) => Promise<Transaction[]>
  getByType: (type: "income" | "expense" | "transfer") => Promise<Transaction[]>
}

export const useTransactions = (): UseTransactionsReturn => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar transacciones inicialmente
  const refreshTransactions = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getTransactions()
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
  const addTransaction = useCallback(async (input: CreateTransactionInput) => {
    try {
      setError(null)
      const newTransaction = await createTransaction(input)
      setTransactions((prev) => [...prev, newTransaction])
    } catch (err) {
      setError("Error al crear transacción")
      console.error(err)
    }
  }, [])

  // Eliminar transacción
  const deleteTransaction = useCallback(async (id: string) => {
    try {
      setError(null)
      const success = await deleteTransactionApi(id)
      if (success) {
        setTransactions((prev) => prev.filter((t) => t.id !== id))
      }
    } catch (err) {
      setError("Error al eliminar transacción")
      console.error(err)
    }
  }, [])

  // Obtener transacciones por cuenta
  const getByAccount = useCallback(async (accountName: string) => {
    return await getTransactionsByAccount(accountName)
  }, [])

  // Obtener transacciones por tipo
  const getByType = useCallback(async (type: "income" | "expense" | "transfer") => {
    return await getTransactionsByType(type)
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