"use client"

import { useState } from "react"
import { Card, CardContent } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet"
import { Home, CreditCard, BarChart3, TrendingUp, Settings, DollarSign, ArrowUpDown, Menu, X } from "lucide-react"

// Feature Components
import { BudgetSection } from "@/src/components/features/budgets/budget-section"
import { InvestmentsSection } from "@/src/components/features/investments/investments-section"
import { ConfigurationSection } from "@/src/components/features/settings/configuration-section"
import { TransactionsSection } from "@/src/components/features/transactions/transactions-section"
import { ProductsSection } from "@/src/components/features/products/products-section"
import { TransactionForm } from "@/src/components/features/transactions/transaction-form"

// Types
import type {
  Producto,
  Transaction,
  IngresoFijo,
  GastoFijo,
  Investment,
  CreateTransactionInput,
  CreateProductInput,
  UpdateProductInput,
  CreateBudgetItemInput,
  CreateInvestmentInput,
  AdjustInvestmentInput,
} from "../src/types"

// Mock Data
import {
  mockProductos,
  mockTransacciones,
  mockIngresosFijos,
  mockGastosFijos,
  mockInversiones,
} from "../src/data"

// Utils
import { cn, formatCurrency } from "@/src/lib/utils"

const sidebarItems = [
  { id: "inicio", label: "Inicio", icon: Home, active: false },
  { id: "transacciones", label: "Transacciones", icon: ArrowUpDown, active: false },
  { id: "productos", label: "Productos", icon: CreditCard, active: false },
  { id: "presupuesto", label: "Presupuesto", icon: BarChart3, active: false },
  { id: "inversiones", label: "Inversiones", icon: TrendingUp, active: true },
  { id: "configuracion", label: "Configuración", icon: Settings, active: false },
]

export default function FinanceApp() {
  // UI State
  const [darkMode, setDarkMode] = useState(false)
  const [activeSection, setActiveSection] = useState("inicio")
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Data State - Inicializado con mock data
  const [productos, setProductos] = useState<Producto[]>(mockProductos)
  const [ingresosFijos, setIngresosFijos] = useState<IngresoFijo[]>(mockIngresosFijos)
  const [gastosFijos, setGastosFijos] = useState<GastoFijo[]>(mockGastosFijos)
  const [inversiones, setInversiones] = useState<Investment[]>(mockInversiones)
  const [transacciones, setTransacciones] = useState<Transaction[]>(mockTransacciones)

  // ============================================================================
  // CALCULATION FUNCTIONS
  // ============================================================================

  const calculateTotalBalance = () => {
    return productos
      .filter((producto) => producto.includeInTotal && producto.currency === "COP")
      .reduce((total, producto) => total + producto.balance, 0)
  }

  const totalIngresos = ingresosFijos.reduce((sum, ingreso) => sum + ingreso.amount, 0)
  const totalGastos = gastosFijos.reduce((sum, gasto) => sum + gasto.amount, 0)
  const estimadoFinMes = totalIngresos - totalGastos

  const totalInvertido = inversiones.reduce((sum, inv) => sum + inv.initialAmount, 0)
  const totalActual = inversiones.reduce((sum, inv) => sum + inv.currentAmount, 0)
  const totalGanancias = totalActual - totalInvertido

  // ============================================================================
  // CRUD OPERATIONS - PRODUCTOS
  // ============================================================================

  const addProduct = (product: CreateProductInput) => {
    const newProduct: Producto = {
      ...product,
      id: Math.max(0, ...productos.map((p) => p.id)) + 1,
      status: "Saldo",
      includeInTotal: product.includeInTotal ?? true,
    }
    setProductos([...productos, newProduct])
  }

  const deleteProduct = (id: number) => {
    setProductos(productos.filter((p) => p.id !== id))
  }

  const updateProduct = (updatedProduct: UpdateProductInput) => {
    setProductos(
      productos.map((p) => (p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p))
    )
  }

  // ============================================================================
  // CRUD OPERATIONS - TRANSACCIONES
  // ============================================================================

  const addTransaction = (transaction: CreateTransactionInput) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.max(0, ...transacciones.map((t) => t.id)) + 1,
    }
    setTransacciones([...transacciones, newTransaction])

    // Actualizar balance de productos según el tipo de transacción
    if (transaction.type === "income" && transaction.account) {
      setProductos(
        productos.map((p) =>
          p.name === transaction.account ? { ...p, balance: p.balance + transaction.amount } : p
        )
      )
    } else if (transaction.type === "expense" && transaction.account) {
      setProductos(
        productos.map((p) =>
          p.name === transaction.account ? { ...p, balance: p.balance - transaction.amount } : p
        )
      )
    } else if (transaction.type === "transfer" && transaction.fromAccount && transaction.toAccount) {
      setProductos(
        productos.map((p) => {
          if (p.name === transaction.fromAccount) {
            return { ...p, balance: p.balance - transaction.amount }
          }
          if (p.name === transaction.toAccount) {
            return { ...p, balance: p.balance + transaction.amount }
          }
          return p
        })
      )
    }
  }

  const deleteTransaction = (id: number) => {
    setTransacciones(transacciones.filter((t) => t.id !== id))
  }

  // ============================================================================
  // CRUD OPERATIONS - PRESUPUESTO
  // ============================================================================

  const addIngreso = (ingreso: CreateBudgetItemInput) => {
    const newIngreso: IngresoFijo = {
      ...ingreso,
      id: Math.max(0, ...ingresosFijos.map((i) => i.id)) + 1,
    }
    setIngresosFijos([...ingresosFijos, newIngreso])
  }

  const deleteIngreso = (id: number) => {
    setIngresosFijos(ingresosFijos.filter((i) => i.id !== id))
  }

  const addGasto = (gasto: CreateBudgetItemInput) => {
    const newGasto: GastoFijo = {
      ...gasto,
      id: Math.max(0, ...gastosFijos.map((g) => g.id)) + 1,
    }
    setGastosFijos([...gastosFijos, newGasto])
  }

  const deleteGasto = (id: number) => {
    setGastosFijos(gastosFijos.filter((g) => g.id !== id))
  }

  // ============================================================================
  // CRUD OPERATIONS - INVERSIONES
  // ============================================================================

  const addInversion = (inversion: CreateInvestmentInput) => {
    const newInversion: Investment = {
      ...inversion,
      id: Math.max(0, ...inversiones.map((i) => i.id)) + 1,
      currentAmount: inversion.currentAmount ?? inversion.initialAmount,
      status: inversion.status ?? "Activa",
      adjustments: [],
    }
    setInversiones([...inversiones, newInversion])
  }

  const deleteInversion = (id: number) => {
    setInversiones(inversiones.filter((i) => i.id !== id))
  }

  const adjustInversion = (adjustment: AdjustInvestmentInput) => {
    setInversiones(
      inversiones.map((inv) => {
        if (inv.id === adjustment.investmentId) {
          const adjustmentType: "increase" | "decrease" =
            adjustment.newAmount > inv.currentAmount ? "increase" : "decrease"

          const newAdjustment = {
            id: Math.max(0, ...inv.adjustments.map((a) => a.id)) + 1,
            date: adjustment.date || new Date().toISOString().split("T")[0],
            previousAmount: inv.currentAmount,
            newAmount: adjustment.newAmount,
            reason: adjustment.reason,
            type: adjustmentType,
          }

          return {
            ...inv,
            currentAmount: adjustment.newAmount,
            adjustments: [...inv.adjustments, newAdjustment],
          }
        }
        return inv
      })
    )
  }

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId)
    setSidebarOpen(false)
  }

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderProductSection = (
    title: string,
    items: any[],
    Icon: React.ComponentType<{ className?: string }>
  ) => {
    return (
      <Card className={darkMode ? "bg-gray-800 text-white" : ""}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            <h2 className="text-base sm:text-lg font-semibold">{title}</h2>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-center pb-3 border-b last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm sm:text-base">{item.name}</p>
                  <p className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {item.type}
                  </p>
                  {item.code && (
                    <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{item.code}</p>
                  )}
                </div>
                <div className="text-right ml-4">
                  <p className="font-semibold text-sm sm:text-base whitespace-nowrap">
                    {formatCurrency(item.balance || item.currentAmount, item.currency)}
                  </p>
                  {item.status && (
                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{item.status}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderBudgetCards = () => {
    const budgetItems = [
      {
        id: 1,
        name: "Ingresos Fijos Mensuales",
        type: "Pesos colombianos",
        balance: totalIngresos,
        status: "Presupuestado",
        currency: "COP",
      },
      {
        id: 2,
        name: "Gastos Fijos Mensuales",
        type: "Pesos colombianos",
        balance: totalGastos,
        status: "Presupuestado",
        currency: "COP",
      },
      {
        id: 3,
        name: "Estimado Fin de Mes",
        type: "Pesos colombianos",
        balance: estimadoFinMes,
        status: estimadoFinMes >= 0 ? "Superávit" : "Déficit",
        currency: "COP",
      },
    ]

    return renderProductSection("Presupuesto", budgetItems, BarChart3)
  }

  const renderInvestmentCards = () => {
    const inversionItems = [
      {
        id: 1,
        name: "Total Invertido",
        type: "Pesos colombianos",
        code: `${inversiones.length} inversiones activas`,
        currentAmount: totalInvertido,
        status: "Capital Inicial",
        currency: "COP",
      },
      {
        id: 2,
        name: "Valor Actual",
        type: "Pesos colombianos",
        code: `${((totalGanancias / totalInvertido) * 100).toFixed(2)}% de rentabilidad`,
        currentAmount: totalActual,
        status: "Valor Presente",
        currency: "COP",
      },
      {
        id: 3,
        name: "Ganancias/Pérdidas",
        type: "Pesos colombianos",
        code: `${((totalGanancias / totalInvertido) * 100).toFixed(2)}% de rentabilidad`,
        currentAmount: totalGanancias,
        status: totalGanancias >= 0 ? "Ganancia" : "Pérdida",
        currency: "COP",
      },
    ]

    return renderProductSection("Inversiones", inversionItems, TrendingUp)
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  const renderContent = () => {
    switch (activeSection) {
      case "transacciones":
        return (
          <TransactionsSection
            transacciones={transacciones}
            productos={productos}
            onAddTransaction={addTransaction}
            onDeleteTransaction={deleteTransaction}
            formatCurrency={formatCurrency}
            darkMode={darkMode}
          />
        )
      case "productos":
        return (
          <ProductsSection
            productos={productos}
            onAddProduct={addProduct}
            onDeleteProduct={deleteProduct}
            onUpdateProduct={updateProduct}
            formatCurrency={formatCurrency}
            darkMode={darkMode}
          />
        )
      case "presupuesto":
        return (
          <BudgetSection
            ingresosFijos={ingresosFijos}
            gastosFijos={gastosFijos}
            onAddIngreso={addIngreso}
            onDeleteIngreso={deleteIngreso}
            onAddGasto={addGasto}
            onDeleteGasto={deleteGasto}
            formatCurrency={formatCurrency}
            totalIngresos={totalIngresos}
            totalGastos={totalGastos}
            estimadoFinMes={estimadoFinMes}
          />
        )
      case "inversiones":
        return (
          <InvestmentsSection
            inversiones={inversiones}
            onAddInversion={addInversion}
            onDeleteInversion={deleteInversion}
            onAdjustInversion={adjustInversion}
            formatCurrency={formatCurrency}
            totalInvertido={totalInvertido}
            totalActual={totalActual}
            totalGanancias={totalGanancias}
          />
        )
      case "inicio":
        return (
          <div className="space-y-6 sm:space-y-8">
            {/* Balance Card */}
            <Card className={`${darkMode ? "bg-gray-800 text-white" : "bg-slate-700 text-white"} border-0 shadow-lg`}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-xs sm:text-sm font-medium">Saldo Disponible</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-bold mb-1">{formatCurrency(calculateTotalBalance())}</h1>
                <p className="text-slate-300 text-xs sm:text-sm">
                  Solo cuentas incluidas en total • {productos.filter((p) => p.includeInTotal).length} de{" "}
                  {productos.length} cuentas
                </p>
              </CardContent>
            </Card>

            {/* Products Section */}
            {renderProductSection("Productos", productos, CreditCard)}

            {/* Budget Section with calculated values */}
            {renderBudgetCards()}

            {/* Investments Section with calculated values */}
            {renderInvestmentCards()}
          </div>
        )
      case "configuracion":
        return <ConfigurationSection darkMode={darkMode} setDarkMode={setDarkMode} />
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Sección en desarrollo</p>
          </div>
        )
    }
  }

  // Sidebar Content Component
  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className={`p-4 sm:p-6 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
        <div className="flex items-center space-x-2 mb-4 sm:mb-6">
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-600 rounded flex items-center justify-center">
            <Home className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
          </div>
          <span className={`font-medium text-sm sm:text-base ${darkMode ? "text-white" : "text-gray-900"}`}>Home</span>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback className="text-xs sm:text-sm">JG</AvatarFallback>
          </Avatar>
          <span className={`font-medium text-sm sm:text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
            Julian Garcia
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2">
        {sidebarItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={cn(
              "w-full justify-start space-x-2 sm:space-x-3 h-10 sm:h-12 text-left text-sm sm:text-base",
              activeSection === item.id
                ? darkMode
                  ? "bg-blue-900 text-blue-300 border border-blue-700"
                  : "bg-blue-50 text-blue-600 border border-blue-200"
                : darkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-600 hover:bg-gray-50",
            )}
            onClick={() => handleSectionChange(item.id)}
          >
            <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>{item.label}</span>
          </Button>
        ))}
      </nav>
    </>
  )

  return (
    <div className={`min-h-screen flex ${darkMode ? "dark bg-gray-900" : "bg-gray-100"}`}>
      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex w-64 border-r flex-col ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className={`w-64 p-0 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
          <div className="flex flex-col h-full">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className={`flex-1 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
        {/* Mobile Header */}
        <div
          className={`lg:hidden flex items-center justify-between p-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <div className="flex items-center space-x-3">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
            <h1 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
              {sidebarItems.find((item) => item.id === activeSection)?.label || "Inicio"}
            </h1>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback className="text-xs">JG</AvatarFallback>
          </Avatar>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {renderContent()}

          {/* Add Transaction Button - Only show on inicio */}
          {activeSection === "inicio" && (
            <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8">
              <Button
                onClick={() => setShowAddTransaction(!showAddTransaction)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-12 w-12 sm:h-14 sm:w-14 shadow-lg"
              >
                <span className="text-xl sm:text-2xl">+</span>
              </Button>
            </div>
          )}

          {/* Transaction Form Modal */}
          {showAddTransaction && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div
                className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className={`text-lg sm:text-xl font-semibold ${darkMode ? "text-white" : ""}`}>
                    Nueva Transacción
                  </h2>
                  <Button variant="ghost" onClick={() => setShowAddTransaction(false)} className="text-gray-500">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <TransactionForm
                  productos={productos}
                  onSubmit={(transaction) => {
                    addTransaction(transaction)
                    setShowAddTransaction(false)
                  }}
                  darkMode={darkMode}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}