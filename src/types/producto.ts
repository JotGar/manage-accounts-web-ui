// types/producto.ts
/**
 * Tipos para productos financieros (cuentas, tarjetas, billeteras)
 */

export type Currency = "COP" | "USD" | "EUR" | "GBP" | "JPY"

export type ProductType = 
  | "Cuenta de Ahorros"
  | "Cuenta Corriente"
  | "Billetera Digital"
  | "Tarjeta de Crédito"
  | "Cuenta de Inversión"
  | "Efectivo"

export interface Producto {
  id: number
  name: string
  type: string // Descripción del tipo (ej: "Pesos colombianos", "Euro")
  code: string // Código o referencia (ej: "3914 COP • 1 USD")
  balance: number
  status: string // Estado del producto (ej: "Saldo", "Deuda")
  currency: Currency
  productType: ProductType
  includeInTotal: boolean // Si se incluye en el cálculo del total general
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