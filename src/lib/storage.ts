// Storage utilities for localStorage operations
// Helper functions to manage data persistence in the browser

/**
 * Save data to localStorage
 */
export const setLocalStorage = <T>(key: string, value: T): void => {
  if (typeof window === "undefined") return

  try {
    const serializedValue = JSON.stringify(value)
    localStorage.setItem(key, serializedValue)
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error)
  }
}

/**
 * Get data from localStorage
 */
export const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue

  try {
    const item = localStorage.getItem(key)
    if (item === null) return defaultValue
    return JSON.parse(item) as T
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error)
    return defaultValue
  }
}

/**
 * Remove a specific key from localStorage
 */
export const removeLocalStorage = (key: string): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error)
  }
}

/**
 * Clear all data from localStorage
 */
export const clearLocalStorage = (): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.clear()
  } catch (error) {
    console.error("Error clearing localStorage:", error)
  }
}
