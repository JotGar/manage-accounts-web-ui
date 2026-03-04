// Transactions Service
// Lógica de negocio para transacciones - usa localStorage para persistencia

import { STORAGE_KEYS } from "@/src/constants/storage-keys"
import { getLocalStorage, setLocalStorage } from "@/src/lib/storage"
import type { Transaction, CreateTransactionInput } from "@/src/types/transaction"

/**
 * Obtiene todas las transacciones desde localStorage o usa datos mock como fallback
 */
const getStoredTransactions = (): Transaction[] => {
  return getLocalStorage<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, [])
}

/**
 * Guarda transacciones en localStorage
 */
const saveTransactions = (transactions: Transaction[]): void => {
  setLocalStorage(STORAGE_KEYS.TRANSACTIONS, transactions)
}

export const transactionsService = {
  /**
   * Obtener todas las transacciones
   */
  getAll: (): Transaction[] => {
    return getStoredTransactions()
  },

  /**
   * Obtener una transacción por ID
   */
  getById: (id: number): Transaction | undefined => {
    const transactions = getStoredTransactions()
    return transactions.find((t) => t.id === id)
  },

  /**
   * Obtener transacciones por cuenta
   */
  getByAccount: (accountName: string): Transaction[] => {
    const transactions = getStoredTransactions()
    return transactions.filter((t) => t.account === accountName)
  },

  /**
   * Obtener transacciones por tipo
   */
  getByType: (type: "income" | "expense" | "transfer"): Transaction[] => {
    const transactions = getStoredTransactions()
    return transactions.filter((t) => t.type === type)
  },

  /**
   * Crear una nueva transacción
   */
  create: (input: CreateTransactionInput): Transaction => {
    const transactions = getStoredTransactions()

    const newTransaction: Transaction = {
      ...input,
      id: Math.max(0, ...transactions.map((t) => t.id)) + 1,
    }

    const updatedTransactions = [...transactions, newTransaction]
    saveTransactions(updatedTransactions)

    return newTransaction
  },

  /**
   * Eliminar una transacción
   */
  delete: (id: number): boolean => {
    const transactions = getStoredTransactions()
    const index = transactions.findIndex((t) => t.id === id)

    if (index === -1) return false

    const updatedTransactions = transactions.filter((t) => t.id !== id)
    saveTransactions(updatedTransactions)

    return true
  },
}
