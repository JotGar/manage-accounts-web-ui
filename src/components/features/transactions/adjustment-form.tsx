"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"

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
}

interface AdjustmentFormProps {
  investment: Investment
  formatCurrency: (amount: number, currency: string) => string
  onSubmit: (newAmount: number, reason: string) => void
}

export function AdjustmentForm({ investment, formatCurrency, onSubmit }: AdjustmentFormProps) {
  const [newAmount, setNewAmount] = useState(investment.currentAmount.toString())
  const [reason, setReason] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newAmount || !reason) {
      alert("Por favor completa todos los campos")
      return
    }

    const amount = Number.parseFloat(newAmount)
    if (amount <= 0) {
      alert("El monto debe ser mayor a 0")
      return
    }

    onSubmit(amount, reason)
  }

  const currentValue = Number.parseFloat(newAmount) || 0
  const difference = currentValue - investment.currentAmount
  const percentageChange = investment.currentAmount > 0 ? (difference / investment.currentAmount) * 100 : 0

  return (
    <div className="space-y-4">
      {/* Investment Info */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">{investment.name}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Valor Actual:</span>
            <p className="font-medium">{formatCurrency(investment.currentAmount, investment.currency)}</p>
          </div>
          <div>
            <span className="text-gray-500">Tipo:</span>
            <p className="font-medium">{investment.type}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="newAmount" className="text-sm font-medium text-gray-700">
            Nuevo Valor *
          </Label>
          <Input
            id="newAmount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            className="border-gray-300"
            required
          />
          {difference !== 0 && (
            <div className={`text-sm ${difference > 0 ? "text-green-600" : "text-red-600"}`}>
              {difference > 0 ? "+" : ""}
              {formatCurrency(difference, investment.currency)}({difference > 0 ? "+" : ""}
              {percentageChange.toFixed(2)}%)
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason" className="text-sm font-medium text-gray-700">
            Motivo del Ajuste *
          </Label>
          <Textarea
            id="reason"
            placeholder="Ej: Valorización del mercado, dividendos recibidos, pérdida por volatilidad..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="border-gray-300"
            rows={3}
            required
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            className={`flex-1 ${difference >= 0 ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
          >
            {difference > 0 ? "Registrar Ganancia" : difference < 0 ? "Registrar Pérdida" : "Actualizar Valor"}
          </Button>
        </div>
      </form>
    </div>
  )
}
