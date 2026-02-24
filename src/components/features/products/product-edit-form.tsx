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

interface Product {
  id: number
  name: string
  type: string
  code: string
  balance: number
  status: string
  currency: string
  productType: string
  includeInTotal: boolean
}

interface ProductEditFormProps {
  product: Product
  onSubmit: (product: any) => void
  darkMode?: boolean
}

export function ProductEditForm({ product, onSubmit, darkMode = false }: ProductEditFormProps) {
  const [name, setName] = useState(product.name)
  const [productType, setProductType] = useState(product.productType)
  const [currency, setCurrency] = useState(product.currency)
  const [balance, setBalance] = useState(product.balance.toString())
  const [description, setDescription] = useState("")
  const [includeInTotal, setIncludeInTotal] = useState(product.includeInTotal)

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
  }

  const hasChanges =
    name !== product.name ||
    productType !== product.productType ||
    currency !== product.currency ||
    Number.parseFloat(balance) !== product.balance ||
    includeInTotal !== product.includeInTotal

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Información del producto actual */}
      <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
        <h4 className={`font-medium mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>Producto Actual</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Nombre:</span>
            <p className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{product.name}</p>
          </div>
          <div>
            <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Tipo:</span>
            <p className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{product.productType}</p>
          </div>
          <div>
            <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Moneda:</span>
            <p className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{product.currency}</p>
          </div>
          <div>
            <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Saldo:</span>
            <p className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
              {new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: product.currency,
              }).format(product.balance)}
            </p>
          </div>
        </div>
      </div>

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
        {currency !== product.currency && (
          <p className="text-sm text-orange-600">⚠️ Cambiar la moneda puede afectar el cálculo del saldo total</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="balance" className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
          Saldo Actual *
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
        {Number.parseFloat(balance) !== product.balance && (
          <p className={`text-sm ${Number.parseFloat(balance) > product.balance ? "text-green-600" : "text-red-600"}`}>
            {Number.parseFloat(balance) > product.balance ? "+" : ""}
            {new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: currency,
            }).format(Number.parseFloat(balance) - product.balance)}{" "}
            de diferencia
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
          Notas de Edición (Opcional)
        </Label>
        <Textarea
          id="description"
          placeholder="Describe los cambios realizados..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"}
          rows={3}
        />
      </div>

      {/* Toggle para incluir en total */}
      <div className={`flex items-center space-x-2 p-3 rounded-lg ${includeInTotal ? "bg-green-50" : "bg-gray-50"}`}>
        <Switch checked={includeInTotal} onCheckedChange={setIncludeInTotal} />
        <div>
          <Label
            className={`font-medium ${darkMode ? "text-gray-200" : includeInTotal ? "text-green-900" : "text-gray-700"}`}
          >
            Incluir en saldo total
          </Label>
          <p className={`text-sm ${darkMode ? "text-gray-400" : includeInTotal ? "text-green-700" : "text-gray-600"}`}>
            {includeInTotal
              ? "Esta cuenta se sumará al saldo principal"
              : "Esta cuenta estará separada del saldo principal"}
          </p>
        </div>
      </div>

      {/* Resumen de cambios */}
      {hasChanges && (
        <div
          className={`p-3 rounded-lg border-l-4 ${darkMode ? "bg-blue-900 border-blue-500" : "bg-blue-50 border-blue-400"}`}
        >
          <h4 className={`font-medium mb-2 ${darkMode ? "text-blue-200" : "text-blue-900"}`}>Cambios Detectados</h4>
          <ul className={`text-sm space-y-1 ${darkMode ? "text-blue-300" : "text-blue-700"}`}>
            {name !== product.name && (
              <li>
                • Nombre: "{product.name}" → "{name}"
              </li>
            )}
            {productType !== product.productType && (
              <li>
                • Tipo: "{product.productType}" → "{productType}"
              </li>
            )}
            {currency !== product.currency && (
              <li>
                • Moneda: {product.currency} → {currency}
              </li>
            )}
            {Number.parseFloat(balance) !== product.balance && (
              <li>
                • Saldo: {product.balance} → {Number.parseFloat(balance)}
              </li>
            )}
            {includeInTotal !== product.includeInTotal && (
              <li>
                • Incluir en total: {product.includeInTotal ? "Sí" : "No"} → {includeInTotal ? "Sí" : "No"}
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="flex space-x-3 pt-4">
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={!hasChanges}>
          {hasChanges ? "Guardar Cambios" : "Sin Cambios"}
        </Button>
      </div>
    </form>
  )
}
