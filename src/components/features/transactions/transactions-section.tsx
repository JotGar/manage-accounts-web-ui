"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Badge } from "@/src/components/ui/badge"
import {
  ArrowUpDown,
  Plus,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  Trash2,
  Calendar,
  DollarSign,
  X,
} from "lucide-react"

import { TransferForm } from "@/src/components/features/transactions/transfer-form"
import { TransactionCharts } from "./transaction-charts"
import { TransactionForm } from "./transaction-form"


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

interface Product {
  id: number
  name: string
  balance: number
  currency: string
}

interface TransactionsSectionProps {
  transacciones: Transaction[]
  productos: Product[]
  onAddTransaction: (transaction: any) => void
  onDeleteTransaction: (id: number) => void
  formatCurrency: (amount: number, currency?: string) => string
  darkMode?: boolean
}

export function TransactionsSection({
  transacciones,
  productos,
  onAddTransaction,
  onDeleteTransaction,
  formatCurrency,
  darkMode = false,
}: TransactionsSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [showTransferForm, setShowTransferForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")

  // Filtrar transacciones
  const filteredTransactions = transacciones.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || transaction.type === filterType
    const matchesCategory = filterCategory === "all" || transaction.category === filterCategory

    return matchesSearch && matchesType && matchesCategory
  })

  // Calcular estadísticas
  const totalIncome = transacciones.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transacciones.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const totalTransfers = transacciones.filter((t) => t.type === "transfer").reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  // Obtener categorías únicas
  const categories = [...new Set(transacciones.map((t) => t.category))]

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "income":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "expense":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case "transfer":
        return <ArrowRightLeft className="h-4 w-4 text-blue-600" />
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "income":
        return "text-green-600"
      case "expense":
        return "text-red-600"
      case "transfer":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const getTransactionBadgeColor = (type: string) => {
    switch (type) {
      case "income":
        return "bg-green-100 text-green-800"
      case "expense":
        return "bg-red-100 text-red-800"
      case "transfer":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <ArrowUpDown className="h-6 w-6 text-gray-700" />
          <h1 className={`text-xl sm:text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            Transacciones
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button
            onClick={() => setShowTransferForm(true)}
            variant="outline"
            className="flex items-center space-x-2 w-full sm:w-auto"
          >
            <ArrowRightLeft className="h-4 w-4" />
            <span>Transferir</span>
          </Button>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Nueva Transacción</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : ""} bg-green-50 border-green-200`}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">Ingresos</span>
            </div>
            <h2 className="text-2xl font-bold text-green-800">{formatCurrency(totalIncome)}</h2>
            <p className="text-green-600 text-sm">
              {transacciones.filter((t) => t.type === "income").length} transacciones
            </p>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : ""} bg-red-50 border-red-200`}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-red-700">Gastos</span>
            </div>
            <h2 className="text-2xl font-bold text-red-800">{formatCurrency(totalExpenses)}</h2>
            <p className="text-red-600 text-sm">
              {transacciones.filter((t) => t.type === "expense").length} transacciones
            </p>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : ""} bg-blue-50 border-blue-200`}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <ArrowRightLeft className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Transferencias</span>
            </div>
            <h2 className="text-2xl font-bold text-blue-800">{formatCurrency(totalTransfers)}</h2>
            <p className="text-blue-600 text-sm">
              {transacciones.filter((t) => t.type === "transfer").length} movimientos
            </p>
          </CardContent>
        </Card>

        <Card
          className={`${darkMode ? "bg-gray-800 border-gray-700" : ""} ${balance >= 0 ? "bg-purple-50 border-purple-200" : "bg-orange-50 border-orange-200"}`}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className={`h-5 w-5 ${balance >= 0 ? "text-purple-600" : "text-orange-600"}`} />
              <span className={`text-sm font-medium ${balance >= 0 ? "text-purple-700" : "text-orange-700"}`}>
                Balance
              </span>
            </div>
            <h2 className={`text-2xl font-bold ${balance >= 0 ? "text-purple-800" : "text-orange-800"}`}>
              {formatCurrency(balance)}
            </h2>
            <p className={`text-sm ${balance >= 0 ? "text-purple-600" : "text-orange-600"}`}>
              {balance >= 0 ? "Superávit" : "Déficit"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Charts */}
      <TransactionCharts transacciones={transacciones} formatCurrency={formatCurrency} darkMode={darkMode} />

      {/* Filters and Search */}
      <Card className={darkMode ? "bg-gray-800 border-gray-700" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros y Búsqueda</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar transacciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="income">Ingresos</SelectItem>
                <SelectItem value="expense">Gastos</SelectItem>
                <SelectItem value="transfer">Transferencias</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setFilterType("all")
                setFilterCategory("all")
              }}
              className="w-full sm:w-auto"
            >
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card className={darkMode ? "bg-gray-800 border-gray-700" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Historial de Transacciones</span>
              <Badge variant="secondary" className="ml-2">
                {filteredTransactions.length} transacciones
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <Card
                key={transaction.id}
                className={`${darkMode ? "bg-gray-700 border-gray-600" : "bg-white"} border-0 shadow-sm hover:shadow-md transition-shadow`}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="p-2 rounded-full bg-gray-100">{getTransactionIcon(transaction.type)}</div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className={`font-medium text-sm sm:text-base ${darkMode ? "text-white" : "text-gray-900"} truncate`}
                          >
                            {transaction.description}
                          </h3>
                          <Badge className={getTransactionBadgeColor(transaction.type)}>{transaction.category}</Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                          <div>
                            <span className="font-medium">Fecha: </span>
                            {new Date(transaction.date).toLocaleDateString()}
                          </div>
                          {transaction.type === "transfer" ? (
                            <div className="sm:col-span-2">
                              <span className="font-medium">De: </span>
                              <span className="truncate">
                                {transaction.fromAccount} → {transaction.toAccount}
                              </span>
                            </div>
                          ) : (
                            <div className="sm:col-span-2">
                              <span className="font-medium">Cuenta: </span>
                              <span className="truncate">{transaction.account}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-3">
                      <div className="text-left sm:text-right">
                        <p className={`text-base sm:text-lg font-semibold ${getTransactionColor(transaction.type)}`}>
                          {transaction.type === "income" ? "+" : transaction.type === "expense" ? "-" : ""}
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteTransaction(transaction.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Transaction Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg sm:text-xl font-semibold ${darkMode ? "text-white" : ""}`}>Nueva Transacción</h2>
              <Button variant="ghost" onClick={() => setShowAddForm(false)} className="text-gray-500">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <TransactionForm
              productos={productos}
              onSubmit={(transaction) => {
                onAddTransaction(transaction)
                setShowAddForm(false)
              }}
              darkMode={darkMode}
            />
          </div>
        </div>
      )}

      {/* Transfer Form Modal */}
      {showTransferForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-6 w-full max-w-md mx-4`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : ""}`}>Transferir Entre Cuentas</h2>
              <Button variant="ghost" onClick={() => setShowTransferForm(false)} className="text-gray-500">
                ✕
              </Button>
            </div>
            <TransferForm
              productos={productos}
              onSubmit={(transfer) => {
                onAddTransaction(transfer)
                setShowTransferForm(false)
              }}
              darkMode={darkMode}
            />
          </div>
        </div>
      )}
    </div>
  )
}
