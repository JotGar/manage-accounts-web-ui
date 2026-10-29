// API Service for Investments
// Consumes the Java backend API per ACC-17 conventions

import { mockInvestments } from "@/src/data/mock-investments"
import type { Investment, CreateInvestmentInput, InvestmentAdjustment } from "@/src/types/investment"

// API base URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_JAVA_API_URL || "http://localhost:8081"
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

  let data: any
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error("Invalid JSON response from API")
  }

  if (data && data.data !== undefined) {
    return { data: data.data, meta: data.meta }
  }

  return { data }
}

// List investments with optional pagination
export const getInvestments = async (params: {
  page?: number
  pageSize?: number
  sort?: string
} = {}): Promise<{ data: Investment[]; meta?: { page: number; pageSize: number; total: number } }> => {
  try {
    if (!isBrowser) {
      return {
        data: mockInvestments,
        meta: { page: 1, pageSize: mockInvestments.length, total: mockInvestments.length },
      }
    }

    const queryParams = new URLSearchParams({
      page: (params.page || 1).toString(),
      pageSize: (params.pageSize || 20).toString(),
      ...(params.sort && { sort: params.sort }),
    })

    const response = await apiFetch(`${API_V1}/investments?${queryParams.toString()}`)
    const { data, meta } = await parseResponse<Investment[]>(response)
    return { data, meta }
  } catch (err) {
    console.error("Error fetching investments from API:", err)
    throw err
  }
}

// Get investment by ID
export const getInvestmentById = async (id: number): Promise<Investment | undefined> => {
  try {
    if (!isBrowser) {
      const investments = mockInvestments
      return investments.find((i) => i.id === id)
    }

    const response = await apiFetch(`${API_V1}/investments/${id}`)
    const { data } = await parseResponse<Investment>(response)
    return data
  } catch (err) {
    console.error(`Error fetching investment ${id} from API:`, err)
    throw err
  }
}

// Create investment
export const createInvestment = async (input: CreateInvestmentInput): Promise<Investment> => {
  try {
    if (!isBrowser) {
      const lastId = Math.max(0, ...mockInvestments.map((i) => i.id))
      return {
        ...input,
        id: lastId + 1,
        currentAmount: input.currentAmount ?? input.initialAmount,
        status: input.status ?? "Activa",
        adjustments: [],
      }
    }

    const response = await apiFetch(`${API_V1}/investments`, {
      method: "POST",
      body: JSON.stringify(input),
    })
    const { data } = await parseResponse<Investment>(response)
    return data
  } catch (err) {
    console.error("Error creating investment via API:", err)
    throw err
  }
}

// Update investment (adjustment)
export const adjustInvestment = async (id: number, newAmount: number, reason: string): Promise<Investment | undefined> => {
  try {
    if (!isBrowser) {
      const investments = mockInvestments
      const investment = investments.find((i) => i.id === id)
      if (!investment) return undefined

      const adjustmentType: "increase" | "decrease" = newAmount > investment.currentAmount ? "increase" : "decrease"

      const newAdjustment: InvestmentAdjustment = {
        id: Math.max(0, ...investment.adjustments.map((a) => a.id)) + 1,
        date: new Date().toISOString().split("T")[0],
        previousAmount: investment.currentAmount,
        newAmount: newAmount,
        reason: reason,
        type: adjustmentType,
      }

      return {
        ...investment,
        currentAmount: newAmount,
        adjustments: [...investment.adjustments, newAdjustment],
      }
    }

    const response = await apiFetch(`${API_V1}/investments/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ newAmount, reason }),
    })
    const { data } = await parseResponse<Investment>(response)
    return data
  } catch (err) {
    console.error(`Error adjusting investment ${id} via API:`, err)
    throw err
  }
}

// Delete investment
export const deleteInvestment = async (id: number): Promise<boolean> => {
  try {
    if (!isBrowser) {
      return true
    }

    const response = await apiFetch(`${API_V1}/investments/${id}`, {
      method: "DELETE",
    })
    return response.ok
  } catch (err) {
    console.error(`Error deleting investment ${id} from API:`, err)
    throw err
  }
}
