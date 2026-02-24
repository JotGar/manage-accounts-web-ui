// types/index.ts
/**
 * Exportación centralizada de todos los tipos
 */

// Productos
export type {
  Currency,
  ProductType,
  Producto,
  CreateProductInput,
  UpdateProductInput,
} from "./producto"

// Transacciones
export type {
  TransactionType,
  TransactionCategory,
  Transaction,
  CreateTransactionInput,
} from "./transaction"

// Presupuesto
export type {
  BudgetFrequency,
  BudgetCategory,
  BudgetItem,
  CreateBudgetItemInput,
  IngresoFijo,
  GastoFijo,
} from "./budget"

// Inversiones
export type {
  InvestmentType,
  InvestmentStatus,
  AdjustmentType,
  InvestmentAdjustment,
  Investment,
  CreateInvestmentInput,
  AdjustInvestmentInput,
} from "./investment"