// data/mock-products.ts
import { Producto } from "../types/producto"

export const mockProducts: Producto[] = [
  {
    id: 1,
    name: "Cuenta de Ahorros",
    type: "Pesos colombianos",
    code: "3914 COP • 1 USD",
    balance: 2000000,
    status: "Saldo",
    currency: "COP",
    productType: "Cuenta de Ahorros",
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
    productType: "Billetera Digital",
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
    productType: "Billetera Digital",
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
    productType: "Cuenta de Inversión",
    includeInTotal: false,
  },
]
