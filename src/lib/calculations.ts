// lib/calculations.ts
/**
 * Calculation functions for financial products, budget and investments
 */

import type { Product } from "@/src/types/products"
import type { FixedIncome, FixedExpense } from "@/src/types/budget"
import type { Investment } from "@/src/types/investment"

// ============================================================================
// PRODUCT CALCULATIONS
// ============================================================================

/**
 * Calculate total balance of financial products (only those marked as includeInTotal and in COP)
 */
export function calculateTotalBalance(products: Product[]): number {
  return products
    .filter((product) => product.includeInTotal && product.currency === "COP")
    .reduce((total, product) => total + product.balance, 0)
}

// ============================================================================
// BUDGET CALCULATIONS
// ============================================================================

/**
 * Calculate total of fixed incomes
 */
export function calculateTotalIncomes(fixedIncomes: FixedIncome[]): number {
  return fixedIncomes.reduce((sum, income) => sum + income.amount, 0)
}

/**
 * Calculate total of fixed expenses
 */
export function calculateTotalExpenses(fixedExpenses: FixedExpense[]): number {
  return fixedExpenses.reduce((sum, expense) => sum + expense.amount, 0)
}

/**
 * Calculate estimated money available at end of month
 * (Incomes - Expenses)
 */
export function calculateEstimatedEndOfMonth(totalIncomes: number, totalExpenses: number): number {
  return totalIncomes - totalExpenses
}

// ============================================================================
// INVESTMENT CALCULATIONS
// ============================================================================

/**
 * Calculate total invested (sum of initialAmount of all investments)
 */
export function calculateTotalInvested(investments: Investment[]): number {
  return investments.reduce((sum, inv) => sum + inv.initialAmount, 0)
}

/**
 * Calculate current total value of investments
 */
export function calculateTotalCurrent(investments: Investment[]): number {
  return investments.reduce((sum, inv) => sum + inv.currentAmount, 0)
}

/**
 * Calculate total profit/loss of investments
 * (Current Value - Total Invested)
 */
export function calculateTotalProfit(totalCurrent: number, totalInvested: number): number {
  return totalCurrent - totalInvested
}

/**
 * Calculate percentage return of investments
 */
export function calculateReturnPercentage(totalProfit: number, totalInvested: number): number {
  if (totalInvested === 0) return 0
  return (totalProfit / totalInvested) * 100
}
