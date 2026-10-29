// API Service for Transactions
// Consumes the Node.js backend API per ACC-17 conventions

import { mockTransactions } from "@/src/data/mock-transactions"
import type {
  Transaction,
  CreateTransactionInput,
  TransactionType,
} from "@/src/types/transaction"
import type { Currency } from "@/src/types/products"

// API base URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_NODE_API_URL || "http://localhost:3457"
const API_V1 = `${API_BASE_URL}/api/v1`

// Check if we're running in a browser environment
const isBrowser = typeof window !== "undefined"

// Helper: make fetch with error handling per ACC-17
async function apiFetch(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
  const response = await fetch(input, {
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
    ...init,
  })
  return response
}

// Helper: parse ACC-17 response wrapper
async function parseResponse<T>(response: Response): Promise<{ data: T; meta?: any }> {
  const text = await response.text()

  if (!response.ok) {
    try {
      const errorData = JSON.parse(text)
      const errorCode = errorData.error?.code || "INTERNAL_ERROR"
      throw new Error(`API Error [${errorCode}]: ${errorData.error?.message || "Unknown error"}`)
    } catch {
      throw new Error(`API request failed with status ${response.status}`)
    }
  }

  // Successful response - could be wrapped or raw
  let data: any
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error("Invalid JSON response from API")
  }

  // Check if response follows ACC-17 wrapper format
  if (data && data.data !== undefined) {
    return { data: data.data, meta: data.meta }
  }

  return { data }
}

// Node.js API contract types
interface APITransactionCreateRequest {
  type: string
  amount: string
  currency: string
  occurredOn: string
  productId: string
  categoryId: string | null
  destinationProductId: string | null
  description: string | null
}

interface APITransactionGetResponse {
  id: string
  type: string
  amount: string
  currency: string
  occurredOn: string
  productId: string
  destinationProductId: string | null
  categoryId: string | null
  description: string | null
  createdAt: string
  updatedAt: string
}

// Map from Node.js API response to local Transaction type
function mapApiTransactionToLocal(api: APITransactionGetResponse): Transaction {
  return {
    id: api.id,
    type: api.type.toLowerCase() as TransactionType,
    amount: api.amount,
    currency: api.currency as Currency,
    description: api.description || "",
    date: api.occurredOn,
    account: undefined,
    fromAccount: undefined,
    toAccount: undefined,
  }
}

// List transactions
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    if (!isBrowser) {
      return mockTransactions
    }

    const response = await apiFetch(`${API_V1}/transactions`)
    const { data } = await parseResponse<APITransactionGetResponse[]>(response)
    return data ? data.map(mapApiTransactionToLocal) : []
  } catch (err) {
    console.error("Error fetching transactions from API:", err)
    throw err
  }
}

// Get transaction by ID
export const getTransactionById = async (id: string): Promise<Transaction | undefined> => {
  try {
    if (!isBrowser) {
      const transactions = mockTransactions
      return transactions.find((t) => t.id === id)
    }

    const response = await apiFetch(`${API_V1}/transactions/${id}`)
    const { data } = await parseResponse<APITransactionGetResponse>(response)
    return data ? mapApiTransactionToLocal(data) : undefined
  } catch (err) {
    console.error(`Error fetching transaction ${id} from API:`, err)
    throw err
  }
}

// Create transaction
export const createTransaction = async (input: CreateTransactionInput): Promise<Transaction> => {
  try {
    if (!isBrowser) {
      const lastId = Math.max(0, ...mockTransactions.map((t) => t.id))
      return {
        id: lastId + 1,
        type: input.type,
        amount: input.amount,
        category: input.category,
        description: input.description,
        date: input.date,
        currency: input.currency,
        account: input.account,
        fromAccount: input.fromAccount,
        toAccount: input.toAccount,
      }
    }

    const apiInput: APITransactionCreateRequest = {
      type: input.type.toUpperCase(),
      amount: parseFloat(input.amount).toFixed(2),
      currency: input.currency,
      occurredOn: input.date,
      productId: input.productId || "",
      categoryId: input.categoryId ?? null,
      destinationProductId: null,
      description: input.description || null,
    }

    const response = await apiFetch(`${API_V1}/transactions`, {
      method: "POST",
      body: JSON.stringify(apiInput),
    })
    const { data } = await parseResponse<APITransactionGetResponse>(response)
    if (data) {
      return mapApiTransactionToLocal(data)
    }

    throw new Error("Respuesta API sin datos al crear transacción")
  } catch (err) {
    console.error("Error creating transaction via API:", err)
    throw err
  }
}

// Delete transaction
export const deleteTransaction = async (id: string): Promise<boolean> => {
  try {
    if (!isBrowser) {
      return true
    }

    const response = await apiFetch(`${API_V1}/transactions/${id}`, {
      method: "DELETE",
    })
    return response.ok
  } catch (err) {
    console.error(`Error deleting transaction ${id} from API:`, err)
    throw err
  }
}

// Get transactions by account
export const getTransactionsByAccount = async (accountName: string): Promise<Transaction[]> => {
  const all = await getTransactions()
  return all.filter((t) => t.account === accountName)
}

// Get transactions by type
export const getTransactionsByType = async (
  type: "income" | "expense" | "transfer",
): Promise<Transaction[]> => {
  const all = await getTransactions()
  return all.filter((t) => t.type === type)
}
