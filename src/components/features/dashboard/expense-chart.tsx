"use client"

interface Transaction {
  id: number
  type: "income" | "expense"
  amount: number
  category: string
  description: string
  date: string
}

interface ExpenseChartProps {
  transactions: Transaction[]
  showDetails?: boolean
}

export function ExpenseChart({ transactions, showDetails = false }: ExpenseChartProps) {
  const expenses = transactions.filter((t) => t.type === "expense")

  // Agrupar gastos por categoría
  const categoryTotals = expenses.reduce(
    (acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0)

  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-orange-500",
  ]

  if (totalExpenses === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay gastos registrados</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Gráfico de barras simple */}
      <div className="space-y-3">
        {Object.entries(categoryTotals)
          .sort(([, a], [, b]) => b - a)
          .map(([category, amount], index) => {
            const percentage = (amount / totalExpenses) * 100
            return (
              <div key={category} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{category}</span>
                  <span className="text-gray-600">
                    ${amount.toFixed(2)} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${colors[index % colors.length]}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
      </div>

      {showDetails && (
        <div className="mt-6 space-y-2">
          <h4 className="font-medium text-sm">Resumen Detallado</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total de Gastos:</span>
              <p className="font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-gray-600">Categorías:</span>
              <p className="font-bold">{Object.keys(categoryTotals).length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
