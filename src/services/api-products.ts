// API Service for Products
// Consumes the Java backend API per ACC-17 conventions

import { mockProducts } from "@/src/data/mock-products"
import type {
  Currency,
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductType,
} from "@/src/types/products"

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

// Map from local product type to Java API type enum
const localTypeToApi: Record<string, string> = {
    "Savings Account": "SAVINGS_ACCOUNT",
    "Checking Account": "CHECKING_ACCOUNT",
    "Digital Wallet": "WALLET",
}

// Map from Java API type enum to local product type
const apiTypeToLocal: Record<string, ProductType> = {
    SAVINGS_ACCOUNT: "Savings Account",
    CHECKING_ACCOUNT: "Checking Account",
    WALLET: "Digital Wallet",
}

// Map from local currency to Java API currency (MVP only supports COP)
const localCurrencyToApi: Record<string, string> = {
    COP: "COP",
    USD: "COP",
    EUR: "COP",
}

// Map from Java API currency to local currency
const apiCurrencyToLocal: Record<string, string> = {
    COP: "COP",
}

interface APIProductCreateRequest {
  name: string
  type: string
  currency: string
  opening_balance: string
  institution: string | null
}

interface APIProductGetResponse {
  id: string
  user_id: string
  name: string
  type: string
  institution: string | null
  currency: string
  opening_balance: string
  balance: string
  is_active: boolean
  createdAt: string
  updatedAt: string
}

// Map from Java API response to local Product type
function mapApiProductToLocal(api: APIProductGetResponse): Product {
  const productType = apiTypeToLocal[api.type as keyof typeof apiTypeToLocal] || "Savings Account"
  const balance = Number(api.balance.replace(/[^0-9.-]+/g, "")) || 0

  // Generate code based on type and currency
  const codeMap: Record<string, string> = {
    COP: "3914 COP • 1 USD",
    USD: "1 USD",
    EUR: "1 EUR",
  }
  const code = codeMap[api.currency as keyof typeof codeMap] || "3914 COP • 1 USD"

  return {
    id: api.id,
    name: api.name,
    type: api.type,
    code: code,
    balance: balance,
    status: api.is_active ? "Saldo" : "Inactivo",
    currency: api.currency as Currency,
    productType: productType,
    includeInTotal: api.include_in_total ?? true,
  }
}

// List products with optional pagination and filters
export const getProducts = async (params: {
  page?: number
  pageSize?: number
  sort?: string
  search?: string
} = {}): Promise<{ data: Product[]; meta?: { page: number; pageSize: number; total: number } }> => {
  try {
    if (!isBrowser) {
      return {
        data: mockProducts,
        meta: { page: 1, pageSize: mockProducts.length, total: mockProducts.length },
      }
    }

    const queryParams = new URLSearchParams({
      page: (params.page || 1).toString(),
      pageSize: (params.pageSize || 20).toString(),
      ...(params.sort && { sort: params.sort }),
      ...(params.search && { search: params.search }),
    })

    const response = await apiFetch(`${API_V1}/products?${queryParams.toString()}`)
    const { data, meta } = await parseResponse<APIProductGetResponse[]>(response)
    return { data: data.map(mapApiProductToLocal), meta }
  } catch (err) {
    console.error("Error fetching products from API:", err)
    throw err
  }
}

// Get product by ID
export const getProductById = async (id: string): Promise<Product | undefined> => {
  try {
    if (!isBrowser) {
      const products = mockProducts
      return products.find((p) => p.id === id)
    }

    const response = await apiFetch(`${API_V1}/products/${id}`)
    const { data } = await parseResponse<APIProductGetResponse>(response)
    return data ? mapApiProductToLocal(data) : undefined
  } catch (err) {
    console.error(`Error fetching product ${id} from API:`, err)
    throw err
  }
}

// Create product
export const createProduct = async (input: CreateProductInput): Promise<Product> => {
  try {
    if (!isBrowser) {
      const numericIds = mockProducts.map((p) => Number(p.id)).filter((n) => !isNaN(n))
      const lastId = numericIds.length > 0 ? Math.max(0, ...numericIds) : 0
      return {
        ...input,
        id: String(lastId + 1),
        status: "Saldo",
        includeInTotal: input.includeInTotal ?? true,
      }
    }

    const apiInput = {
      name: input.name,
      type: localTypeToApi[input.type] || "SAVINGS_ACCOUNT",
      currency: localCurrencyToApi[input.currency] || "COP",
      opening_balance: input.balance.toString(),
    }

    const response = await apiFetch(`${API_V1}/products`, {
      method: "POST",
      body: JSON.stringify(apiInput),
    })
    const { data } = await parseResponse<APIProductGetResponse>(response)
    if (data) {
      return mapApiProductToLocal(data)
    }

    throw new Error("Respuesta API sin datos al crear producto")
  } catch (err) {
    console.error("Error creating product via API:", err)
    throw err
  }
}

// Update product
export const updateProduct = async (id: string, input: UpdateProductInput): Promise<Product | undefined> => {
  try {
    if (!isBrowser) {
      const product = mockProducts.find((p) => p.id === id)
      if (product) {
        return { ...product, ...input, id }
      }
      return undefined
    }

    const apiInput: Record<string, any> = {}
    if (input.name !== undefined) apiInput.name = input.name
    if (input.type !== undefined) apiInput.type = localTypeToApi[input.type] || "SAVINGS_ACCOUNT"
    if (input.institution !== undefined) apiInput.institution = input.institution
    if (input.includeInTotal !== undefined) apiInput.include_in_total = input.includeInTotal

    const response = await apiFetch(`${API_V1}/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(apiInput),
    })
    const { data } = await parseResponse<APIProductGetResponse>(response)
    return data ? mapApiProductToLocal(data) : undefined
  } catch (err) {
    console.error(`Error updating product ${id} via API:`, err)
    throw err
  }
}

// Delete product
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    if (!isBrowser) {
      return true
    }

    const response = await apiFetch(`${API_V1}/products/${id}`, {
      method: "DELETE",
    })
    return response.ok
  } catch (err) {
    console.error(`Error deleting product ${id} from API:`, err)
    throw err
  }
}
