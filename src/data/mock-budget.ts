// data/mock-budget.ts
import { FixedIncome, FixedExpense } from "../types/budget"

export const mockFixedIncomes: FixedIncome[] = [
  {
    id: 1,
    name: "Salario Principal",
    amount: 3500000,
    currency: "COP",
    category: "Salary",
    frequency: "Monthly",
  },
  {
    id: 2,
    name: "Freelance",
    amount: 800000,
    currency: "COP",
    category: "Freelance",
    frequency: "Monthly",
  },
]

export const mockFixedExpenses: FixedExpense[] = [
  {
    id: 1,
    name: "Arriendo",
    amount: 1200000,
    currency: "COP",
    category: "Housing",
    frequency: "Monthly",
  },
  {
    id: 2,
    name: "Servicios Públicos",
    amount: 300000,
    currency: "COP",
    category: "Utilities",
    frequency: "Monthly",
  },
  {
    id: 3,
    name: "Alimentación",
    amount: 600000,
    currency: "COP",
    category: "Food",
    frequency: "Monthly",
  },
]
