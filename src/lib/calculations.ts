// lib/calculations.ts
/**
 * Funciones de cálculo para productos financieros, presupuesto e inversiones
 */

import type { Producto } from "@/src/types/producto"
import type { IngresoFijo, GastoFijo } from "@/src/types/budget"
import type { Investment } from "@/src/types/investment"

// ============================================================================
// CÁLCULOS DE PRODUCTOS
// ============================================================================

/**
 * Calcula el saldo total de productos financieros (solo los marcados como includeInTotal y en COP)
 */
export function calculateTotalBalance(productos: Producto[]): number {
  return productos
    .filter((producto) => producto.includeInTotal && producto.currency === "COP")
    .reduce((total, producto) => total + producto.balance, 0)
}

// ============================================================================
// CÁLCULOS DE PRESUPUESTO
// ============================================================================

/**
 * Calcula el total de ingresos fijos
 */
export function calculateTotalIngresos(ingresosFijos: IngresoFijo[]): number {
  return ingresosFijos.reduce((sum, ingreso) => sum + ingreso.amount, 0)
}

/**
 * Calcula el total de gastos fijos
 */
export function calculateTotalGastos(gastosFijos: GastoFijo[]): number {
  return gastosFijos.reduce((sum, gasto) => sum + gasto.amount, 0)
}

/**
 * Calcula el estimado de dinero disponible al final del mes
 * (Ingresos - Gastos)
 */
export function calculateEstimadoFinMes(totalIngresos: number, totalGastos: number): number {
  return totalIngresos - totalGastos
}

// ============================================================================
// CÁLCULOS DE INVERSIONES
// ============================================================================

/**
 * Calcula el total invertido (suma de initialAmount de todas las inversiones)
 */
export function calculateTotalInvertido(inversiones: Investment[]): number {
  return inversiones.reduce((sum, inv) => sum + inv.initialAmount, 0)
}

/**
 * Calcula el valor actual total de las inversiones
 */
export function calculateTotalActual(inversiones: Investment[]): number {
  return inversiones.reduce((sum, inv) => sum + inv.currentAmount, 0)
}

/**
 * Calcula las ganancias/pérdidas totales de las inversiones
 * (Valor Actual - Total Invertido)
 */
export function calculateTotalGanancias(totalActual: number, totalInvertido: number): number {
  return totalActual - totalInvertido
}

/**
 * Calcula el porcentaje de rentabilidad de las inversiones
 */
export function calculateRentabilidad(totalGanancias: number, totalInvertido: number): number {
  if (totalInvertido === 0) return 0
  return (totalGanancias / totalInvertido) * 100
}
