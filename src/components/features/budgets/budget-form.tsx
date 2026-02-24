"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"

const incomeCategories = [
  "Salario",
  "Trabajo Independiente",
  "Bonificaciones",
  "Inversiones",
  "Alquiler",
  "Pensión",
  "Otros Ingresos",
]

const expenseCategories = [
  "Vivienda",
  "Alimentación",
  "Transporte",
  "Servicios",
  "Salud",
  "Educación",
  "Entretenimiento",
  "Seguros",
  "Deudas",
  "Otros Gastos",
]

const currencies = [
  { code: "COP", name: "Peso Colombiano", symbol: "$" },
  { code: "USD", name: "Dólar Estadounidense", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "Libra Esterlina", symbol: "£" },
  { code: "JPY", name: "Yen Japonés", symbol: "¥" },
]

const frequencies = ["Mensual", "Quincenal", "Semanal", "Anual"]

interface BudgetFormProps {
  type: "ingreso" | "gasto"
  onSubmit: (item: any) => void
}

export function BudgetForm({ type, onSubmit }: BudgetFormProps) {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("COP")
  const [category, setCategory] = useState("")
  const [frequency, setFrequency] = useState("Mensual")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !amount || !category) {
      alert("Por favor completa todos los campos obligatorios")
      return
    }

    onSubmit({
      name,
      amount: Number.parseFloat(amount),
      currency,
      category,
      frequency,
    })

    // Reset form
    setName("")
    setAmount("")
    setCurrency("COP")
    setCategory("")
    setFrequency("Mensual")
  }

  const categories = type === "ingreso" ? incomeCategories : expenseCategories

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
          Nombre del {type === "ingreso" ? "Ingreso" : "Gasto"} *
        </Label>
        <Input
          id="name"
          placeholder={`Ej: ${type === "ingreso" ? "Salario Principal" : "Arriendo"}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-gray-300"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
            Cantidad *
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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

      <div className="space-y-2">
        <Label htmlFor="category" className="text-sm font-medium text-gray-700">
          Categoría *
        </Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger className="border-gray-300">
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="frequency" className="text-sm font-medium text-gray-700">
          Frecuencia
        </Label>
        <Select value={frequency} onValueChange={setFrequency}>
          <SelectTrigger className="border-gray-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {frequencies.map((freq) => (
              <SelectItem key={freq} value={freq}>
                {freq}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button
          type="submit"
          className={`flex-1 ${type === "ingreso" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
        >
          Agregar {type === "ingreso" ? "Ingreso" : "Gasto"}
        </Button>
      </div>
    </form>
  )
}
