"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { BarChart3, PieChart, TrendingUp, Calendar } from "lucide-react"

interface Transaction {
  id: number
  type: "income" | "expense" | "transfer"
  amount: number
  category: string
  description: string
  date: string
  account?: string
  fromAccount?: string
  toAccount?: string
  currency: string
}

interface TransactionChartsProps {
  transacciones: Transaction[]
  formatCurrency: (amount: number, currency?: string) => string
  darkMode?: boolean
}

export function TransactionCharts({ transacciones, formatCurrency, darkMode = false }: TransactionChartsProps) {
  const [chartType, setChartType] = useState("category")
  const [timeRange, setTimeRange] = useState("all")

  // Filtrar transacciones por rango de tiempo
  const getFilteredTransactions = () => {
    if (timeRange === "all") return transacciones

    const now = new Date()
    const filterDate = new Date()

    switch (timeRange) {
      case "week":
        filterDate.setDate(now.getDate() - 7)
        break
      case "month":
        filterDate.setMonth(now.getMonth() - 1)
        break
      case "quarter":
        filterDate.setMonth(now.getMonth() - 3)
        break
      case "year":
        filterDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        return transacciones
    }

    return transacciones.filter((t) => new Date(t.date) >= filterDate)
  }

  const filteredTransactions = getFilteredTransactions()

  // Datos para gráfica de gastos por categoría
  const getExpensesByCategory = () => {
    const expenses = filteredTransactions.filter((t) => t.type === "expense")
    const categoryTotals = expenses.reduce(
      (acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount
        return acc
      },
      {} as Record<string, number>,
    )

    const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0)

    return Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .map(([category, amount], index) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
        color: getColorForIndex(index),
      }))
  }

  // Datos para gráfica de ingresos vs gastos por mes
  const getMonthlyData = () => {
    const monthlyData: Record<string, { income: number; expense: number }> = {}

    filteredTransactions.forEach((transaction) => {
      const date = new Date(transaction.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0 }
      }

      if (transaction.type === "income") {
        monthlyData[monthKey].income += transaction.amount
      } else if (transaction.type === "expense") {
        monthlyData[monthKey].expense += transaction.amount
      }
    })

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month: new Date(month + "-01").toLocaleDateString("es-ES", { month: "short", year: "numeric" }),
        ...data,
        balance: data.income - data.expense,
      }))
  }

  // Datos para gráfica de distribución de tipos de transacción
  const getTransactionTypeData = () => {
    const income = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const expense = filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
    const transfer = filteredTransactions.filter((t) => t.type === "transfer").reduce((sum, t) => sum + t.amount, 0)

    const total = income + expense + transfer

    return [
      {
        type: "Ingresos",
        amount: income,
        percentage: total > 0 ? (income / total) * 100 : 0,
        color: "bg-green-500",
        textColor: "text-green-600",
      },
      {
        type: "Gastos",
        amount: expense,
        percentage: total > 0 ? (expense / total) * 100 : 0,
        color: "bg-red-500",
        textColor: "text-red-600",
      },
      {
        type: "Transferencias",
        amount: transfer,
        percentage: total > 0 ? (transfer / total) * 100 : 0,
        color: "bg-blue-500",
        textColor: "text-blue-600",
      },
    ]
  }

  const getColorForIndex = (index: number) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-orange-500",
      "bg-teal-500",
      "bg-cyan-500",
    ]
    return colors[index % colors.length]
  }

  const renderCategoryChart = () => {
    const data = getExpensesByCategory()

    if (data.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <PieChart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No hay gastos para mostrar</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Gastos por Categoría</h3>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={item.category} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{item.category}</span>
                <div className="text-right">
                  <span className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {formatCurrency(item.amount)}
                  </span>
                  <span className={`text-sm ml-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className={`w-full ${darkMode ? "bg-gray-700" : "bg-gray-200"} rounded-full h-3`}>
                <div className={`h-3 rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderMonthlyChart = () => {
    const data = getMonthlyData()

    if (data.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No hay datos mensuales para mostrar</p>
        </div>
      )
    }

    const maxAmount = Math.max(...data.flatMap((d) => [d.income, d.expense]))

    return (
      <div className="space-y-4">
        <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
          Ingresos vs Gastos por Mes
        </h3>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{item.month}</span>
                <span className={`font-semibold ${item.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  Balance: {formatCurrency(item.balance)}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-green-600 w-16">Ingresos</span>
                  <div className={`flex-1 ${darkMode ? "bg-gray-700" : "bg-gray-200"} rounded-full h-2`}>
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${maxAmount > 0 ? (item.income / maxAmount) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-24 text-right">{formatCurrency(item.income)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-red-600 w-16">Gastos</span>
                  <div className={`flex-1 ${darkMode ? "bg-gray-700" : "bg-gray-200"} rounded-full h-2`}>
                    <div
                      className="h-2 rounded-full bg-red-500"
                      style={{ width: `${maxAmount > 0 ? (item.expense / maxAmount) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-24 text-right">{formatCurrency(item.expense)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderTypeChart = () => {
    const data = getTransactionTypeData()

    return (
      <div className="space-y-4">
        <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Distribución por Tipo</h3>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{item.type}</span>
                <div className="text-right">
                  <span className={`font-semibold ${item.textColor}`}>{formatCurrency(item.amount)}</span>
                  <span className={`text-sm ml-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className={`w-full ${darkMode ? "bg-gray-700" : "bg-gray-200"} rounded-full h-3`}>
                <div className={`h-3 rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card className={darkMode ? "bg-gray-800 border-gray-700" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Análisis de Transacciones</span>
          </div>
          <div className="flex space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo el tiempo</SelectItem>
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="month">Último mes</SelectItem>
                <SelectItem value="quarter">Últimos 3 meses</SelectItem>
                <SelectItem value="year">Último año</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Chart Type Selector */}
          <div className="flex space-x-2 border-b pb-4">
            <Button
              variant={chartType === "category" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("category")}
              className="flex items-center space-x-2"
            >
              <PieChart className="h-4 w-4" />
              <span>Por Categoría</span>
            </Button>
            <Button
              variant={chartType === "monthly" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("monthly")}
              className="flex items-center space-x-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Mensual</span>
            </Button>
            <Button
              variant={chartType === "type" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("type")}
              className="flex items-center space-x-2"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Por Tipo</span>
            </Button>
          </div>

          {/* Chart Content */}
          <div className="min-h-[300px]">
            {chartType === "category" && renderCategoryChart()}
            {chartType === "monthly" && renderMonthlyChart()}
            {chartType === "type" && renderTypeChart()}
          </div>

          {/* Summary Stats */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t ${darkMode ? "border-gray-700" : ""}`}>
            <div className="text-center">
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Transacciones Analizadas</p>
              <p className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                {filteredTransactions.length}
              </p>
            </div>
            <div className="text-center">
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Período</p>
              <p className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                {timeRange === "all"
                  ? "Todo"
                  : timeRange === "week"
                    ? "7 días"
                    : timeRange === "month"
                      ? "30 días"
                      : timeRange === "quarter"
                        ? "90 días"
                        : "365 días"}
              </p>
            </div>
            <div className="text-center">
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Promedio Diario</p>
              <p className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                {formatCurrency(
                  filteredTransactions.length > 0
                    ? filteredTransactions.reduce((sum, t) => sum + (t.type === "expense" ? t.amount : 0), 0) /
                        Math.max(1, filteredTransactions.length)
                    : 0,
                )}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
