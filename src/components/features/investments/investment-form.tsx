"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Textarea } from "@/src/components/ui/textarea"

const investmentTypes = [
  "Acciones",
  "Bonos",
  "CDT",
  "Fondos de Inversión",
  "ETF",
  "Bienes Raíces",
  "Criptomonedas",
  "Commodities",
  "REIT",
  "Otros",
]

const currencies = [
  { code: "COP", name: "Peso Colombiano", symbol: "$" },
  { code: "USD", name: "Dólar Estadounidense", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "Libra Esterlina", symbol: "£" },
  { code: "JPY", name: "Yen Japonés", symbol: "¥" },
]

interface InvestmentFormProps {
  onSubmit: (investment: any) => void
}

export function InvestmentForm({ onSubmit }: InvestmentFormProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [initialAmount, setInitialAmount] = useState("")
  const [currency, setCurrency] = useState("COP")
  const [expectedReturn, setExpectedReturn] = useState("")
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !type || !initialAmount || !expectedReturn) {
      alert("Por favor completa todos los campos obligatorios")
      return
    }

    onSubmit({
      name,
      type,
      initialAmount: Number.parseFloat(initialAmount),
      currency,
      expectedReturn: Number.parseFloat(expectedReturn),
      startDate,
      description,
    })

    // Reset form
    setName("")
    setType("")
    setInitialAmount("")
    setCurrency("COP")
    setExpectedReturn("")
    setStartDate(new Date().toISOString().split("T")[0])
    setDescription("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
          Nombre de la Inversión *
        </Label>
        <Input
          id="name"
          placeholder="Ej: Acciones Apple, CDT Bancolombia"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-gray-300"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type" className="text-sm font-medium text-gray-700">
          Tipo de Inversión *
        </Label>
        <Select value={type} onValueChange={setType} required>
          <SelectTrigger className="border-gray-300">
            <SelectValue placeholder="Selecciona el tipo de inversión" />
          </SelectTrigger>
          <SelectContent>
            {investmentTypes.map((investmentType) => (
              <SelectItem key={investmentType} value={investmentType}>
                {investmentType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="initialAmount" className="text-sm font-medium text-gray-700">
            Monto Inicial *
          </Label>
          <Input
            id="initialAmount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={initialAmount}
            onChange={(e) => setInitialAmount(e.target.value)}
            className="border-gray-300"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency" className="text-sm font-medium text-gray-700">
            Moneda
          </Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((curr) => (
                <SelectItem key={curr.code} value={curr.code}>
                  <div className="flex items-center space-x-2">
                    <span>{curr.symbol}</span>
                    <span>{curr.code}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expectedReturn" className="text-sm font-medium text-gray-700">
            Rentabilidad Esperada (%) *
          </Label>
          <Input
            id="expectedReturn"
            type="number"
            step="0.1"
            placeholder="8.5"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(e.target.value)}
            className="border-gray-300"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
            Fecha de Inicio
          </Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border-gray-300"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
          Descripción (Opcional)
        </Label>
        <Textarea
          id="description"
          placeholder="Información adicional sobre la inversión..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border-gray-300"
          rows={3}
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
          Agregar Inversión
        </Button>
      </div>
    </form>
  )
}
