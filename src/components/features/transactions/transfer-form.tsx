"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Textarea } from "@/src/components/ui/textarea"
import { ArrowRightLeft } from "lucide-react"

interface Product {
  id: number
  name: string
  balance: number
  currency: string
}

interface TransferFormProps {
  productos: Product[]
  onSubmit: (transfer: any) => void
  darkMode?: boolean
}

export function TransferForm({ productos, onSubmit, darkMode = false }: TransferFormProps) {
  const [fromAccount, setFromAccount] = useState("")
  const [toAccount, setToAccount] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!fromAccount || !toAccount || !amount || !description) {
      alert("Por favor completa todos los campos")
      return
    }

    if (fromAccount === toAccount) {
      alert("No puedes transferir a la misma cuenta")
      return
    }

    const fromProduct = productos.find((p) => p.name === fromAccount)
    const transferAmount = Number.parseFloat(amount)

    if (fromProduct && transferAmount > fromProduct.balance) {
      alert("Saldo insuficiente en la cuenta origen")
      return
    }

    onSubmit({
      type: "transfer",
      amount: transferAmount,
      category: "Transferencia",
      description,
      date,
      fromAccount,
      toAccount,
      currency: fromProduct?.currency || "COP",
    })

    // Reset form
    setFromAccount("")
    setToAccount("")
    setAmount("")
    setDescription("")
    setDate(new Date().toISOString().split("T")[0])
  }

  const availableToAccounts = productos.filter((p) => p.name !== fromAccount)
  const selectedFromAccount = productos.find((p) => p.name === fromAccount)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-4">
        <div className="flex items-center justify-center space-x-2 text-blue-600">
          <ArrowRightLeft className="h-5 w-5" />
          <span className="font-medium">Transferencia Entre Cuentas</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fromAccount" className={darkMode ? "text-gray-200" : "text-sm font-medium text-gray-700"}>
          Cuenta Origen *
        </Label>
        <Select value={fromAccount} onValueChange={setFromAccount} required>
          <SelectTrigger className={darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"}>
            <SelectValue placeholder="Selecciona cuenta origen" />
          </SelectTrigger>
          <SelectContent>
            {productos.map((product) => (
              <SelectItem key={product.id} value={product.name}>
                <div className="flex justify-between items-center w-full">
                  <span>{product.name}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    Saldo:{" "}
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: product.currency,
                    }).format(product.balance)}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedFromAccount && (
          <p className="text-xs text-gray-500">
            Saldo disponible:{" "}
            {new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: selectedFromAccount.currency,
            }).format(selectedFromAccount.balance)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="toAccount" className={darkMode ? "text-gray-200" : "text-sm font-medium text-gray-700"}>
          Cuenta Destino *
        </Label>
        <Select value={toAccount} onValueChange={setToAccount} required disabled={!fromAccount}>
          <SelectTrigger className={darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"}>
            <SelectValue placeholder="Selecciona cuenta destino" />
          </SelectTrigger>
          <SelectContent>
            {availableToAccounts.map((product) => (
              <SelectItem key={product.id} value={product.name}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount" className={darkMode ? "text-gray-200" : "text-sm font-medium text-gray-700"}>
            Cantidad *
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date" className={darkMode ? "text-gray-200" : "text-sm font-medium text-gray-700"}>
            Fecha
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className={darkMode ? "text-gray-200" : "text-sm font-medium text-gray-700"}>
          Descripción *
        </Label>
        <Textarea
          id="description"
          placeholder="Describe el motivo de la transferencia..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"}
          required
        />
      </div>

      {fromAccount && toAccount && (
        <div className="p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-1">Resumen de Transferencia</h4>
          <p className="text-sm text-blue-700">
            Transferir desde <strong>{fromAccount}</strong> hacia <strong>{toAccount}</strong>
          </p>
          {amount && (
            <p className="text-sm text-blue-700">
              Monto:{" "}
              <strong>
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: selectedFromAccount?.currency || "COP",
                }).format(Number.parseFloat(amount) || 0)}
              </strong>
            </p>
          )}
        </div>
      )}

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        Realizar Transferencia
      </Button>
    </form>
  )
}
