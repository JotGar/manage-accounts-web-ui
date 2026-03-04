// data/mock-products.ts
import { Product } from "../types/products"

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Cuenta de Ahorros",
    type: "Pesos colombianos",
    code: "3914 COP • 1 USD",
    balance: 2000000,
    status: "Saldo",
    currency: "COP",
    productType: "Savings Account",
    includeInTotal: true,
  },
  {
    id: 2,
    name: "Nequi",
    type: "Pesos colombianos",
    code: "3914 COP • 1 USD",
    balance: 200000,
    status: "Saldo",
    currency: "COP",
    productType: "Digital Wallet",
    includeInTotal: true,
  },
  {
    id: 3,
    name: "Mi Billetera virtual",
    type: "Euro",
    code: "1 EUR = 13 USD",
    balance: 35.97,
    status: "Saldo",
    currency: "EUR",
    productType: "Digital Wallet",
    includeInTotal: false,
  },
  {
    id: 4,
    name: "Cuenta de Inversión",
    type: "Pesos colombianos",
    code: "3914 COP • 1 USD",
    balance: 5000000,
    status: "Saldo",
    currency: "COP",
    productType: "Investment Account",
    includeInTotal: false,
  },
]
