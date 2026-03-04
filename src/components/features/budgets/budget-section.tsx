"use client"

import { useState } from "react"
import { Card, CardContent } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { BarChart3, Plus, Trash2, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { BudgetForm } from "@/src/components/features/budgets/budget-form"

interface BudgetItem {
  id: number
  name: string
  amount: number
  currency: string
  category: string
  frequency: string
}

interface BudgetSectionProps {
  ingresosFijos: BudgetItem[]
  gastosFijos: BudgetItem[]
  onAddIngreso: (ingreso: any) => void
  onDeleteIngreso: (id: number) => void
  onAddGasto: (gasto: any) => void
  onDeleteGasto: (id: number) => void
  formatCurrency: (amount: number, currency?: string) => string
  totalIngresos: number
  totalGastos: number
  estimadoFinMes: number
}

export function BudgetSection({
  ingresosFijos,
  gastosFijos,
  onAddIngreso,
  onDeleteIngreso,
  onAddGasto,
  onDeleteGasto,
  formatCurrency,
  totalIngresos,
  totalGastos,
  estimadoFinMes,
}: BudgetSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [formType, setFormType] = useState<"ingreso" | "gasto">("ingreso")

  const handleAddClick = (type: "ingreso" | "gasto") => {
    setFormType(type)
    setShowAddForm(true)
  }

  const handleSubmit = (item: any) => {
    if (formType === "ingreso") {
      onAddIngreso(item)
    } else {
      onAddGasto(item)
    }
    setShowAddForm(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-gray-700">
          <BarChart3 className="h-6 w-6" />
          <h1 className="text-2xl font-bold text-gray-900">Presupuesto Mensual</h1>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">Ingresos Totales</span>
            </div>
            <h2 className="text-3xl font-bold text-green-800">{formatCurrency(totalIngresos)}</h2>
            <p className="text-green-600 text-sm">{ingresosFijos.length} fuentes de ingreso</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-red-700">Gastos Totales</span>
            </div>
            <h2 className="text-3xl font-bold text-red-800">{formatCurrency(totalGastos)}</h2>
            <p className="text-red-600 text-sm">{gastosFijos.length} gastos fijos</p>
          </CardContent>
        </Card>

        <Card className={`${estimadoFinMes >= 0 ? "bg-blue-50 border-blue-200" : "bg-orange-50 border-orange-200"}`}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className={`h-5 w-5 ${estimadoFinMes >= 0 ? "text-blue-600" : "text-orange-600"}`} />
              <span className={`text-sm font-medium ${estimadoFinMes >= 0 ? "text-blue-700" : "text-orange-700"}`}>
                Estimado Fin de Mes
              </span>
            </div>
            <h2 className={`text-3xl font-bold ${estimadoFinMes >= 0 ? "text-blue-800" : "text-orange-800"}`}>
              {formatCurrency(estimadoFinMes)}
            </h2>
            <p className={`text-sm ${estimadoFinMes >= 0 ? "text-blue-600" : "text-orange-600"}`}>
              {estimadoFinMes >= 0 ? "Superávit" : "Déficit"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ingresos Section */}
      <Card className="bg-gray-100 border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-gray-700">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-medium">Ingresos Fijos</h2>
                <span className="text-sm text-gray-500">({ingresosFijos.length} ingresos)</span>
              </div>
              <Button
                onClick={() => handleAddClick("ingreso")}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
                size="sm"
              >
                <Plus className="h-4 w-4" />
                <span>Agregar Ingreso</span>
              </Button>
            </div>

            {ingresosFijos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No tienes ingresos fijos registrados</p>
                <p className="text-sm">Agrega tus fuentes de ingreso mensuales</p>
              </div>
            ) : (
              <div className="space-y-3">
                {ingresosFijos.map((ingreso) => (
                  <Card key={ingreso.id} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900">{ingreso.name}</h3>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              {ingreso.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{ingreso.frequency}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <p className="text-lg font-semibold text-green-600">
                              +{formatCurrency(ingreso.amount, ingreso.currency)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteIngreso(ingreso.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Gastos Section */}
      <Card className="bg-gray-100 border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-gray-700">
                <TrendingDown className="h-5 w-5 text-red-600" />
                <h2 className="text-lg font-medium">Gastos Fijos</h2>
                <span className="text-sm text-gray-500">({gastosFijos.length} gastos)</span>
              </div>
              <Button
                onClick={() => handleAddClick("gasto")}
                className="bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2"
                size="sm"
              >
                <Plus className="h-4 w-4" />
                <span>Agregar Gasto</span>
              </Button>
            </div>

            {gastosFijos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <TrendingDown className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No tienes gastos fijos registrados</p>
                <p className="text-sm">Agrega tus gastos mensuales recurrentes</p>
              </div>
            ) : (
              <div className="space-y-3">
                {gastosFijos.map((gasto) => (
                  <Card key={gasto.id} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900">{gasto.name}</h3>
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                              {gasto.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{gasto.frequency}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <p className="text-lg font-semibold text-red-600">
                              -{formatCurrency(gasto.amount, gasto.currency)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteGasto(gasto.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Budget Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {formType === "ingreso" ? "Agregar Ingreso Fijo" : "Agregar Gasto Fijo"}
              </h2>
              <Button variant="ghost" onClick={() => setShowAddForm(false)} className="text-gray-500">
                ✕
              </Button>
            </div>
            <BudgetForm type={formType} onSubmit={handleSubmit} />
          </div>
        </div>
      )}
    </div>
  )
}
