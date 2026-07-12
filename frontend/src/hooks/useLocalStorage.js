import { useState, useCallback } from 'react'

/**
 * Generic localStorage hook with JSON serialization
 * @param {string} key - localStorage key
 * @param {any} initialValue - default value
 * @returns {[any, Function]} [value, setValue]
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item === null) return initialValue
      return JSON.parse(item)
    } catch (error) {
      console.warn(`useLocalStorage: Error reading key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback(
    (value) => {
      try {
        // Allow value to be a function (like setState)
        const valueToStore =
          typeof value === 'function' ? value(storedValue) : value

        setStoredValue(valueToStore)

        if (valueToStore === undefined) {
          window.localStorage.removeItem(key)
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.warn(`useLocalStorage: Error setting key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      window.localStorage.removeItem(key)
    } catch (error) {
      console.warn(`useLocalStorage: Error removing key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

export default useLocalStorage
