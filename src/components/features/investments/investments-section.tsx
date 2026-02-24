"use client"

import { useState } from "react"
import { Card, CardContent } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { TrendingUp, Plus, Trash2, Edit, TrendingDown, DollarSign, BarChart3 } from "lucide-react"
import { InvestmentForm } from "@/src/components/features/investments/investment-form"
import { AdjustmentForm } from "@/src/components/features/transactions/adjustment-form"

interface Investment {
  id: number
  name: string
  type: string
  initialAmount: number
  currentAmount: number
  currency: string
  expectedReturn: number
  startDate: string
  status: string
  adjustments: Array<{
    id: number
    date: string
    previousAmount: number
    newAmount: number
    reason: string
    type: "increase" | "decrease"
  }>
}

interface InvestmentsSectionProps {
  inversiones: Investment[]
  onAddInversion: (inversion: any) => void
  onDeleteInversion: (id: number) => void
  onAdjustInversion: (id: number, newAmount: number, reason: string) => void
  formatCurrency: (amount: number, currency: string) => string
  totalInvertido: number
  totalActual: number
  totalGanancias: number
}

export function InvestmentsSection({
  inversiones,
  onAddInversion,
  onDeleteInversion,
  onAdjustInversion,
  formatCurrency,
  totalInvertido,
  totalActual,
  totalGanancias,
}: InvestmentsSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [showAdjustForm, setShowAdjustForm] = useState(false)
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null)

  const calculateReturn = (initial: number, current: number) => {
    if (initial === 0) return 0
    return ((current - initial) / initial) * 100
  }

  const handleAdjustClick = (investment: Investment) => {
    setSelectedInvestment(investment)
    setShowAdjustForm(true)
  }

  const handleAdjustSubmit = (newAmount: number, reason: string) => {
    if (selectedInvestment) {
      onAdjustInversion(selectedInvestment.id, newAmount, reason)
      setShowAdjustForm(false)
      setSelectedInvestment(null)
    }
  }

  const totalReturnPercentage = totalInvertido > 0 ? (totalGanancias / totalInvertido) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-gray-700">
          <TrendingUp className="h-6 w-6" />
          <h1 className="text-2xl font-bold text-gray-900">Portafolio de Inversiones</h1>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nueva Inversión</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Total Invertido</span>
            </div>
            <h2 className="text-2xl font-bold text-blue-800">{formatCurrency(totalInvertido)}</h2>
            <p className="text-blue-600 text-sm">{inversiones.length} inversiones</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Valor Actual</span>
            </div>
            <h2 className="text-2xl font-bold text-purple-800">{formatCurrency(totalActual)}</h2>
            <p className="text-purple-600 text-sm">Valor presente</p>
          </CardContent>
        </Card>

        <Card className={`${totalGanancias >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              {totalGanancias >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
              <span className={`text-sm font-medium ${totalGanancias >= 0 ? "text-green-700" : "text-red-700"}`}>
                Ganancias/Pérdidas
              </span>
            </div>
            <h2 className={`text-2xl font-bold ${totalGanancias >= 0 ? "text-green-800" : "text-red-800"}`}>
              {totalGanancias >= 0 ? "+" : ""}
              {formatCurrency(totalGanancias)}
            </h2>
            <p className={`text-sm ${totalGanancias >= 0 ? "text-green-600" : "text-red-600"}`}>
              {totalGanancias >= 0 ? "Ganancia" : "Pérdida"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Rentabilidad</span>
            </div>
            <h2 className={`text-2xl font-bold ${totalReturnPercentage >= 0 ? "text-green-800" : "text-red-800"}`}>
              {totalReturnPercentage >= 0 ? "+" : ""}
              {totalReturnPercentage.toFixed(2)}%
            </h2>
            <p className="text-gray-600 text-sm">Retorno total</p>
          </CardContent>
        </Card>
      </div>

      {/* Investments List */}
      <Card className="bg-gray-100 border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <TrendingUp className="h-5 w-5" />
              <h2 className="text-lg font-medium">Mis Inversiones</h2>
              <span className="text-sm text-gray-500">({inversiones.length} inversiones)</span>
            </div>

            {inversiones.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No tienes inversiones registradas</p>
                <p className="text-sm">Comienza a construir tu portafolio de inversiones</p>
              </div>
            ) : (
              <div className="space-y-3">
                {inversiones.map((investment) => {
                  const returnPercentage = calculateReturn(investment.initialAmount, investment.currentAmount)
                  const gainLoss = investment.currentAmount - investment.initialAmount

                  return (
                    <Card key={investment.id} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-gray-900">{investment.name}</h3>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {investment.type}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  returnPercentage >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                              >
                                {returnPercentage >= 0 ? "+" : ""}
                                {returnPercentage.toFixed(2)}%
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="text-gray-500">Inicial: </span>
                                <span className="font-medium">
                                  {formatCurrency(investment.initialAmount, investment.currency)}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">Actual: </span>
                                <span className="font-medium">
                                  {formatCurrency(investment.currentAmount, investment.currency)}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">Ganancia/Pérdida: </span>
                                <span className={`font-medium ${gainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                                  {gainLoss >= 0 ? "+" : ""}
                                  {formatCurrency(gainLoss, investment.currency)}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">Fecha inicio: </span>
                                <span className="font-medium">
                                  {new Date(investment.startDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAdjustClick(investment)}
                              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDeleteInversion(investment.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Investment Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Nueva Inversión</h2>
              <Button variant="ghost" onClick={() => setShowAddForm(false)} className="text-gray-500">
                ✕
              </Button>
            </div>
            <InvestmentForm
              onSubmit={(investment) => {
                onAddInversion(investment)
                setShowAddForm(false)
              }}
            />
          </div>
        </div>
      )}

      {/* Adjust Investment Form Modal */}
      {showAdjustForm && selectedInvestment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Ajustar Inversión</h2>
              <Button variant="ghost" onClick={() => setShowAdjustForm(false)} className="text-gray-500">
                ✕
              </Button>
            </div>
            <AdjustmentForm
              investment={selectedInvestment}
              formatCurrency={formatCurrency}
              onSubmit={handleAdjustSubmit}
            />
          </div>
        </div>
      )}
    </div>
  )
}
