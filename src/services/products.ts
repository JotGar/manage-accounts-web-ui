// Products Service
// Lógica de negocio para productos - usa localStorage para persistencia

import { STORAGE_KEYS } from "@/src/constants/storage-keys"
import { getLocalStorage, setLocalStorage } from "@/src/lib/storage"
import type { Product, CreateProductInput, UpdateProductInput } from "@/src/types/products"

/**
 * Obtiene todos los productos desde localStorage o usa datos mock como fallback
 */
const getStoredProducts = (): Product[] => {
  return getLocalStorage<Product[]>(STORAGE_KEYS.PRODUCTS, [])
}

/**
 * Guarda productos en localStorage
 */
const saveProducts = (products: Product[]): void => {
  setLocalStorage(STORAGE_KEYS.PRODUCTS, products)
}

const BALANCE = "Saldo"

export const productsService = {
  /**
   * Obtener todos los productos
   */
  getAll: (): Product[] => {
    return getStoredProducts()
  },

  /**
   * Obtener un producto por ID
   */
  getById: (id: number): Product | undefined => {
    const products = getStoredProducts()
    return products.find((p) => p.id === id)
  },

  /**
   * Crear un nuevo producto
   */
  create: (input: CreateProductInput): Product => {
    const products = getStoredProducts()
    
    const newProduct: Product = {
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
  update: (id: number, input: UpdateProductInput): Product | undefined => {
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
