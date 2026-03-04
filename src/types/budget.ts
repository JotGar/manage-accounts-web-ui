// types/budget.ts
/**
 * Types for budget (fixed incomes and expenses)
 */

import { Currency } from "./products"

export type BudgetFrequency = 
  | "Daily"
  | "Weekly"
  | "Biweekly"
  | "Monthly"
  | "Bimonthly"
  | "Quarterly"
  | "Semi-annually"
  | "Annually"

export type BudgetCategory =
  // Income Categories
  | "Salary"
  | "Freelance"
  | "Bonuses"
  | "Investments"
  | "Rentals"
  | "Other Income"
  // Expense Categories
  | "Housing"
  | "Utilities"
  | "Food"
  | "Transportation"
  | "Health"
  | "Education"
  | "Insurance"
  | "Debt"
  | "Entertainment"
  | "Savings"
  | "Other Expenses"

export interface BudgetItem {
  id: number
  name: string
  amount: number
  currency: Currency
  category: BudgetCategory
  frequency: BudgetFrequency
}

export interface CreateBudgetItemInput {
  name: string
  amount: number
  currency: Currency
  category: BudgetCategory
  frequency: BudgetFrequency
}

// Type aliases for clarity
export type FixedIncome = BudgetItem
export type FixedExpense = BudgetItem
