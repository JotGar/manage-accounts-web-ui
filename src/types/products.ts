// types/products.ts
/**
 * Types for financial products (accounts, cards, wallets)
 */

export type Currency = "COP" | "USD" | "EUR" | "GBP" | "JPY"

export type ProductType = 
  | "Savings Account"
  | "Checking Account"
  | "Digital Wallet"
  | "Credit Card"
  | "Investment Account"
  | "Cash"

export interface Product {
  id: number
  name: string
  type: string // Type description (e.g., "Pesos colombianos", "Euro")
  code: string // Code or reference (e.g., "3914 COP • 1 USD")
  balance: number
  status: string // Product status (e.g., "Balance", "Debt")
  currency: Currency
  productType: ProductType
  includeInTotal: boolean // Whether to include in total calculation
}

export interface CreateProductInput {
  name: string
  type: string
  code: string
  balance: number
  currency: Currency
  productType: ProductType
  includeInTotal?: boolean
}

export interface UpdateProductInput {
  id: number
  name?: string
  type?: string
  code?: string
  balance?: number
  currency?: Currency
  productType?: ProductType
  includeInTotal?: boolean
}
