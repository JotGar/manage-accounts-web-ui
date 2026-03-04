// types/index.ts
/**
 * Centralized export of all types
 */

// Products
export type {
  Currency,
  ProductType,
  Product,
  CreateProductInput,
  UpdateProductInput,
} from "./products"

// Transactions
export type {
  TransactionType,
  TransactionCategory,
  Transaction,
  CreateTransactionInput,
} from "./transaction"

// Budget
export type {
  BudgetFrequency,
  BudgetCategory,
  BudgetItem,
  CreateBudgetItemInput,
  FixedIncome,
  FixedExpense,
} from "./budget"

// Investments
export type {
  InvestmentType,
  InvestmentStatus,
  AdjustmentType,
  InvestmentAdjustment,
  Investment,
  CreateInvestmentInput,
  AdjustInvestmentInput,
} from "./investment"
