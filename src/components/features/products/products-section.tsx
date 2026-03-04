"use client"

import { useState } from "react"
import { Card, CardContent } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Switch } from "@/src/components/ui/switch"
import { CreditCard, Plus, Trash2, Settings, Edit, X } from "lucide-react"
import { ProductForm } from "./product-form"
import { ProductEditForm } from "./product-edit-form"



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

interface ProductsSectionProps {
  productos: Product[]
  onAddProduct: (product: any) => void
  onDeleteProduct: (id: number) => void
  onUpdateProduct: (id: number, updates: any) => void
  formatCurrency: (amount: number, currency?: string) => string
  darkMode?: boolean
}

export function ProductsSection({
  productos,
  onAddProduct,
  onDeleteProduct,
  onUpdateProduct,
  formatCurrency,
  darkMode = false,
}: ProductsSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const handleToggleIncludeInTotal = (id: number, includeInTotal: boolean) => {
    onUpdateProduct(id, { includeInTotal })
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowEditForm(true)
  }

  const totalIncluded = productos
    .filter((p) => p.includeInTotal && p.currency === "COP")
    .reduce((sum, p) => sum + p.balance, 0)

  const totalExcluded = productos
    .filter((p) => !p.includeInTotal && p.currency === "COP")
    .reduce((sum, p) => sum + p.balance, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2 text-gray-700">
          <CreditCard className="h-6 w-6" />
          <h1 className={`text-xl sm:text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            Productos Financieros
          </h1>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Agregar Producto</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : ""} bg-green-50 border-green-200`}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-2 mb-2">
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              <span className="text-xs sm:text-sm font-medium text-green-700">Incluidas en Total</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-green-800">{formatCurrency(totalIncluded)}</h2>
            <p className="text-green-600 text-xs sm:text-sm">
              {productos.filter((p) => p.includeInTotal).length} cuentas activas
            </p>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : ""} bg-blue-50 border-blue-200`}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span className="text-xs sm:text-sm font-medium text-blue-700">Excluidas del Total</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-blue-800">{formatCurrency(totalExcluded)}</h2>
            <p className="text-blue-600 text-xs sm:text-sm">
              {productos.filter((p) => !p.includeInTotal).length} cuentas separadas
            </p>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : ""} bg-purple-50 border-purple-200`}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-2 mb-2">
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              <span className="text-xs sm:text-sm font-medium text-purple-700">Total General</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-purple-800">
              {formatCurrency(totalIncluded + totalExcluded)}
            </h2>
            <p className="text-purple-600 text-xs sm:text-sm">{productos.length} productos totales</p>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100"} border-0 shadow-sm`}>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
              <h2 className={`text-base sm:text-lg font-medium ${darkMode ? "text-white" : ""}`}>Mis Productos</h2>
              <span className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                ({productos.length} productos)
              </span>
            </div>

            {productos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No tienes productos financieros</p>
                <p className="text-sm">Agrega tu primera cuenta o producto financiero</p>
              </div>
            ) : (
              <div className="space-y-3">
                {productos.map((product) => (
                  <Card
                    key={product.id}
                    className={`${darkMode ? "bg-gray-700 border-gray-600" : "bg-white"} border-0 shadow-sm hover:shadow-md transition-shadow`}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
                        <div className="space-y-1 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3
                              className={`font-medium text-sm sm:text-base ${darkMode ? "text-white" : "text-gray-900"}`}
                            >
                              {product.name}
                            </h3>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {product.productType}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                product.includeInTotal ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {product.includeInTotal ? "Incluida" : "Excluida"}
                            </span>
                          </div>
                          <p className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            {product.type}
                          </p>
                          <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{product.code}</p>

                          {/* Toggle para incluir en total */}
                          <div className="flex items-center space-x-2 pt-2">
                            <Switch
                              checked={product.includeInTotal}
                              onCheckedChange={(checked) => handleToggleIncludeInTotal(product.id, checked)}
                            />
                            <span className={`text-xs sm:text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                              Incluir en saldo total
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end space-x-3">
                          <div className="text-left sm:text-right">
                            <p
                              className={`text-base sm:text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                            >
                              {formatCurrency(product.balance, product.currency)}
                            </p>
                            <p className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-400"}`}>
                              {product.status}
                            </p>
                          </div>
                          <div className="flex space-x-1 sm:space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0"
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDeleteProduct(product.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
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

      {/* Add Product Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg sm:text-xl font-semibold ${darkMode ? "text-white" : ""}`}>
                Agregar Producto Financiero
              </h2>
              <Button variant="ghost" onClick={() => setShowAddForm(false)} className="text-gray-500">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ProductForm
              onSubmit={(product) => {
                onAddProduct(product)
                setShowAddForm(false)
              }}
              darkMode={darkMode}
            />
          </div>
        </div>
      )}

      {/* Edit Product Form Modal */}
      {showEditForm && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : ""}`}>Editar Producto</h2>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowEditForm(false)
                  setEditingProduct(null)
                }}
                className="text-gray-500"
              >
                ✕
              </Button>
            </div>
            <ProductEditForm
              product={editingProduct}
              onSubmit={(updatedProduct) => {
                onUpdateProduct(editingProduct.id, updatedProduct)
                setShowEditForm(false)
                setEditingProduct(null)
              }}
              darkMode={darkMode}
            />
          </div>
        </div>
      )}
    </div>
  )
}
