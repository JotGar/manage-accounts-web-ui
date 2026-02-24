"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Textarea } from "@/src/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group"

const expenseCategories = [
  "Vivienda",
  "Alimentación",
  "Transporte",
  "Salud",
  "Entretenimiento",
  "Educación",
  "Ropa",
  "Servicios",
  "Otros",
]

const incomeCategories = ["Salario", "Freelance", "Inversiones", "Bonos", "Otros"]

interface TransactionFormProps {
  productos?: Product[]
  onSubmit: (transaction: any) => void
  darkMode?: boolean
}

interface Product {
  id: number
  name: string
  balance: number
  currency: string
}

export function TransactionForm({ productos = [], onSubmit, darkMode = false }: TransactionFormProps) {
  const [type, setType] = useState<"income" | "expense">("expense")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [account, setAccount] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !category || !description) {
      alert("Por favor completa todos los campos")
      return
    }

    onSubmit({
      type,
      amount: Number.parseFloat(amount),
      category,
      description,
      date,
      account,
      currency: "COP",
    })

    // Reset form
    setAmount("")
    setCategory("")
    setDescription("")
    setDate(new Date().toISOString().split("T")[0])
    setAccount("")
  }

  const categories = type === "income" ? incomeCategories : expenseCategories

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">Tipo de Transacción</Label>
        <RadioGroup value={type} onValueChange={(value: "income" | "expense") => setType(value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="income" id="income" />
            <Label htmlFor="income" className="text-green-600 font-medium">
              Ingreso
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="expense" id="expense" />
            <Label htmlFor="expense" className="text-red-600 font-medium">
              Gasto
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
            Cantidad ($)
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`border-gray-300 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-medium text-gray-700">
            Fecha
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`border-gray-300 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="text-sm font-medium text-gray-700">
          Categoría
        </Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger className={darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"}>
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
        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
          Descripción
        </Label>
        <Textarea
          id="description"
          placeholder="Describe la transacción..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`border-gray-300 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
          required
        />
      </div>

      {productos.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="account" className={darkMode ? "text-gray-200" : "text-sm font-medium text-gray-700"}>
            Cuenta *
          </Label>
          <Select value={account} onValueChange={setAccount} required>
            <SelectTrigger className={darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"}>
              <SelectValue placeholder="Selecciona una cuenta" />
            </SelectTrigger>
            <SelectContent>
              {productos.map((product) => (
                <SelectItem key={product.id} value={product.name}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        Agregar Transacción
      </Button>
    </form>
  )
}
