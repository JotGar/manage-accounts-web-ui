// data/mock-transacciones.ts

import { Transaction } from "../types";


export const mockTransacciones: Transaction[] = [
  {
    id: 1,
    type: "income",
    amount: 3500000,
    category: "Salario",
    description: "Salario mensual",
    date: "2024-01-15",
    account: "Cuenta de Ahorros",
    currency: "COP",
  },
  {
    id: 2,
    type: "expense",
    amount: 1200000,
    category: "Vivienda",
    description: "Pago arriendo",
    date: "2024-01-01",
    account: "Cuenta de Ahorros",
    currency: "COP",
  },
  {
    id: 3,
    type: "transfer",
    amount: 500000,
    category: "Transferencia",
    description: "Transferencia a Nequi",
    date: "2024-01-10",
    fromAccount: "Cuenta de Ahorros",
    toAccount: "Nequi",
    currency: "COP",
  },
]