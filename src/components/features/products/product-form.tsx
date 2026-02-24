"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Textarea } from "@/src/components/ui/textarea"
import { Switch } from "@/src/components/ui/switch"

const productTypes = [
  "Cuenta de Ahorros",
  "Cuenta Corriente",
  "Tarjeta de Crédito",
  "Billetera Digital",
  "Cuenta de Inversión",
  "Cuenta Extranjera",
  "Criptomonedas",
]

const currencies = [
  { code: "COP", name: "Peso Colombiano", symbol: "$" },
  { code: "USD", name: "Dólar Estadounidense", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "Libra Esterlina", symbol: "£" },
  { code: "JPY", name: "Yen Japonés", symbol: "¥" },
]

const exchangeRates = {
  COP: "3914 COP • 1 USD",
  USD: "1 USD • 3914 COP",
  EUR: "1 EUR • 1.1 USD",
  GBP: "1 GBP • 1.3 USD",
  JPY: "150 JPY • 1 USD",
}

interface ProductFormProps {
  onSubmit: (product: any) => void
  darkMode?: boolean
}

export function ProductForm({ onSubmit, darkMode = false }: ProductFormProps) {
  const [name, setName] = useState("")
  const [productType, setProductType] = useState("")
  const [currency, setCurrency] = useState("")
  const [balance, setBalance] = useState("")
  const [description, setDescription] = useState("")
  const [includeInTotal, setIncludeInTotal] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !productType || !currency || !balance) {
      alert("Por favor completa todos los campos obligatorios")
      return
    }

    const selectedCurrency = currencies.find((c) => c.code === currency)

    onSubmit({
      name,
      productType,
      currency,
      balance: Number.parseFloat(balance),
      type: selectedCurrency?.name || currency,
      code: exchangeRates[currency as keyof typeof exchangeRates] || `1 ${currency}`,
      description,
      includeInTotal,
    })

    // Reset form
    setName("")
    setProductType("")
    setCurrency("")
    setBalance("")
    setDescription("")
    setIncludeInTotal(true)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
          Nombre del Producto *
        </Label>
        <Input
          id="name"
          placeholder="Ej: Mi Cuenta de Ahorros"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="productType" className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
          Tipo de Producto *
        </Label>
        <Select value={productType} onValueChange={setProductType} required>
          <SelectTrigger className={darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"}>
            <SelectValue placeholder="Selecciona el tipo de producto" />
          </SelectTrigger>
          <SelectContent>
            {productTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="currency" className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
          Moneda *
        </Label>
        <Select value={currency} onValueChange={setCurrency} required>
          <SelectTrigger className={darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"}>
            <SelectValue placeholder="Selecciona la moneda" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((curr) => (
              <SelectItem key={curr.code} value={curr.code}>
                <div className="flex items-center space-x-2">
                  <span>{curr.symbol}</span>
                  <span>
                    {curr.name} ({curr.code})
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="balance" className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
          Saldo Inicial *
        </Label>
        <Input
          id="balance"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          className={darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
          Descripción (Opcional)
        </Label>
        <Textarea
          id="description"
          placeholder="Información adicional sobre el producto..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"}
          rows={3}
        />
      </div>

      {/* Toggle para incluir en total */}
      <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
        <Switch checked={includeInTotal} onCheckedChange={setIncludeInTotal} />
        <div>
          <Label className={`font-medium ${darkMode ? "text-gray-200" : "text-blue-900"}`}>
            Incluir en saldo total
          </Label>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-blue-700"}`}>
            Esta cuenta se sumará al saldo principal mostrado en el inicio
          </p>
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
          Agregar Producto
        </Button>
      </div>
    </form>
  )
}
