// data/mock-budget.ts
import { IngresoFijo, GastoFijo } from "../types/budget"

export const mockFixedIncomes: IngresoFijo[] = [
  {
    id: 1,
    name: "Salario Principal",
    amount: 3500000,
    currency: "COP",
    category: "Salario",
    frequency: "Mensual",
  },
  {
    id: 2,
    name: "Freelance",
    amount: 800000,
    currency: "COP",
    category: "Trabajo Independiente",
    frequency: "Mensual",
  },
]

export const mockFixedExpenses: GastoFijo[] = [
  {
    id: 1,
    name: "Arriendo",
    amount: 1200000,
    currency: "COP",
    category: "Vivienda",
    frequency: "Mensual",
  },
  {
    id: 2,
    name: "Servicios Públicos",
    amount: 300000,
    currency: "COP",
    category: "Servicios",
    frequency: "Mensual",
  },
  {
    id: 3,
    name: "Alimentación",
    amount: 600000,
    currency: "COP",
    category: "Alimentación",
    frequency: "Mensual",
  },
]
