// useProducts Hook
// Hook personalizado para gestionar productos con estado de React

import { useState, useEffect, useCallback } from "react"
import { productsService } from "@/src/services/products"
import type { Producto, CreateProductInput } from "@/src/types/producto"

interface UseProductsReturn {
  products: Producto[]
  isLoading: boolean
  error: string | null
  addProduct: (product: CreateProductInput) => void
  updateProduct: (id: number, updates: any) => void
  deleteProduct: (id: number) => void
  refreshProducts: () => void
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Producto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar productos inicialmente
  const refreshProducts = useCallback(() => {
    try {
      setIsLoading(true)
      setError(null)
      const data = productsService.getAll()
      setProducts(data)
    } catch (err) {
      setError("Error al cargar productos")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshProducts()
  }, [refreshProducts])

  // Agregar producto
  const addProduct = useCallback((input: CreateProductInput) => {
    try {
      setError(null)
      const newProduct = productsService.create(input)
      setProducts((prev) => [...prev, newProduct])
    } catch (err) {
      setError("Error al crear producto")
      console.error(err)
    }
  }, [])

  // Actualizar producto
  const updateProduct = useCallback((id: number, updates: any) => {
    try {
      setError(null)
      const updatedProduct = productsService.update(id, { id, ...updates })
      if (updatedProduct) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? updatedProduct : p))
        )
      }
    } catch (err) {
      setError("Error al actualizar producto")
      console.error(err)
    }
  }, [])

  // Eliminar producto
  const deleteProduct = useCallback((id: number) => {
    try {
      setError(null)
      const success = productsService.delete(id)
      if (success) {
        setProducts((prev) => prev.filter((p) => p.id !== id))
      }
    } catch (err) {
      setError("Error al eliminar producto")
      console.error(err)
    }
  }, [])

  return {
    products,
    isLoading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
  }
}
