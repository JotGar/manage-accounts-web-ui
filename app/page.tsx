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

// Shared Components
import { ItemsListCard } from "@/src/components/shared/items-list-card"

// Hooks (servicios con localStorage)
import { useProducts, useTransactions, useBudget, useInvestments } from "@/src/hooks"

// Utils
import { cn, formatCurrency } from "@/src/lib/utils"

// Calculations
import {
  calculateTotalBalance, calculateTotalIngresos, calculateTotalGastos,
  calculateEstimadoFinMes, calculateTotalInvertido, calculateTotalActual,
  calculateTotalGanancias,
} from "@/src/lib/calculations"

// Configuración de características - Controla qué secciones son visibles
const FEATURES = {
  showBudget: false, // Ocultar presupuesto
  showInvestments: false, // Ocultar inversiones
  showSettings: true, // Ocultar configuración
}

// Menú visible basado en configuración
const sidebarItems = [
  { id: "inicio", label: "Inicio", icon: Home, active: true },
  { id: "productos", label: "Productos", icon: CreditCard, active: false },
  { id: "transacciones", label: "Transacciones", icon: ArrowUpDown, active: false },
  ...(FEATURES.showBudget ? [{ id: "presupuesto", label: "Presupuesto", icon: BarChart3, active: false }] : []),
  ...(FEATURES.showInvestments ? [{ id: "inversiones", label: "Inversiones", icon: TrendingUp, active: false }] : []),
  ...(FEATURES.showSettings ? [{ id: "configuracion", label: "Configuración", icon: Settings, active: false }] : []),
]

export default function FinanceApp() {
  // UI State
  const [darkMode, setDarkMode] = useState(false)
  const [activeSection, setActiveSection] = useState("inicio")
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Data State - Usando hooks con localStorage
  const { products: productos, addProduct, updateProduct: updateProductFn, deleteProduct } = useProducts()
  const { transactions: transacciones, addTransaction, deleteTransaction } = useTransactions()
  const { ingresosFijos, gastosFijos, addIngreso, deleteIngreso, addGasto, deleteGasto } = useBudget()
  const { inversiones, addInversion, deleteInversion, adjustInversion } = useInvestments()

  // ============================================================================
  // CALCULATIONS (using lib/calculations.ts)
  // ============================================================================

  const totalBalance = calculateTotalBalance(productos)
  const totalIngresos = calculateTotalIngresos(ingresosFijos)
  const totalGastos = calculateTotalGastos(gastosFijos)
  const estimadoFinMes = calculateEstimadoFinMes(totalIngresos, totalGastos)

  const totalInvertido = calculateTotalInvertido(inversiones)
  const totalActual = calculateTotalActual(inversiones)
  const totalGanancias = calculateTotalGanancias(totalActual, totalInvertido)

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId)
    setSidebarOpen(false)
  }

  // ============================================================================
  // RENDER HELPERS - Now using separate components
  // ============================================================================

  // renderProductSection removed - now using ProductCard component directly

  const renderBudgetCards = () => {
    const budgetItems: any = [];

    return (
      <ItemsListCard
        title="Presupuesto"
        items={budgetItems}
        icon={BarChart3}
        darkMode={darkMode}
        formatCurrencyFn={formatCurrency}
      />
    )
  }

  const renderInvestmentCards = () => {
    const inversionItems: any =  [];

    return (
      <ItemsListCard
        title="Inversiones"
        items={inversionItems}
        icon={TrendingUp}
        darkMode={darkMode}
        formatCurrencyFn={formatCurrency}
      />
    )
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
            onUpdateProduct={updateProductFn}
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
                <h1 className="text-2xl sm:text-4xl font-bold mb-1">{formatCurrency(totalBalance)}</h1>
                <p className="text-slate-300 text-xs sm:text-sm">
                  Solo cuentas incluidas en total • {productos.filter((p) => p.includeInTotal).length} de{" "}
                  {productos.length} cuentas
                </p>
              </CardContent>
            </Card>

            {/* Products Section */}
            {productos.length > 0 && (
              <ItemsListCard
                title="Productos"
                items={productos}
                icon={CreditCard}
                darkMode={darkMode}
                formatCurrencyFn={formatCurrency}
              />
            )}

            {/* Budget Section - Controlado por FEATURES */}
            {FEATURES.showBudget && renderBudgetCards()}

            {/* Investments Section - Controlado por FEATURES */}
            {FEATURES.showInvestments && renderInvestmentCards()}
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
