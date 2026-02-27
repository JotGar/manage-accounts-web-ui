// Products Service
// Lógica de negocio para productos - usa localStorage para persistencia

import { STORAGE_KEYS } from "@/src/constants/storage-keys"
import { getLocalStorage, setLocalStorage } from "@/src/lib/storage"
import { mockProducts } from "@/src/data"
import type { Producto, CreateProductInput, UpdateProductInput } from "@/src/types/producto"

/**
 * Obtiene todos los productos desde localStorage o usa datos mock como fallback
 */
const getStoredProducts = (): Producto[] => {
  return getLocalStorage<Producto[]>(STORAGE_KEYS.PRODUCTOS, [])
}

/**
 * Guarda productos en localStorage
 */
const saveProducts = (products: Producto[]): void => {
  setLocalStorage(STORAGE_KEYS.PRODUCTOS, products)
}

const BALANCE = "Saldo"

export const productsService = {
  /**
   * Obtener todos los productos
   */
  getAll: (): Producto[] => {
    return getStoredProducts()
  },

  /**
   * Obtener un producto por ID
   */
  getById: (id: number): Producto | undefined => {
    const products = getStoredProducts()
    return products.find((p) => p.id === id)
  },

  /**
   * Crear un nuevo producto
   */
  create: (input: CreateProductInput): Producto => {
    const products = getStoredProducts()
    
    const newProduct: Producto = {
      ...input,
      id: Math.max(0, ...products.map((p) => p.id)) + 1,
      status: BALANCE,
      includeInTotal: input.includeInTotal ?? true,
    }

    const updatedProducts = [...products, newProduct]
    saveProducts(updatedProducts)
    
    return newProduct
  },

  /**
   * Actualizar un producto existente
   */
  update: (id: number, input: UpdateProductInput): Producto | undefined => {
    const products = getStoredProducts()
    const index = products.findIndex((p) => p.id === id)
    
    if (index === -1) return undefined

    const updatedProduct = { ...products[index], ...input }
    const updatedProducts = [...products]
    updatedProducts[index] = updatedProduct
    
    saveProducts(updatedProducts)
    
    return updatedProduct
  },

  /**
   * Eliminar un producto
   */
  delete: (id: number): boolean => {
    const products = getStoredProducts()
    const index = products.findIndex((p) => p.id === id)
    
    if (index === -1) return false

    const updatedProducts = products.filter((p) => p.id !== id)
    saveProducts(updatedProducts)
    
    return true
  },
}
