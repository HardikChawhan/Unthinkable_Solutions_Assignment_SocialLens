import { useEffect, useCallback, useRef } from 'react'

/**
 * Hook for registering keyboard shortcuts
 * @param {Array<{ key: string, ctrlKey?: boolean, shiftKey?: boolean, altKey?: boolean, description: string, handler: Function }>} shortcuts
 * @returns {{ shortcuts: Array }} registered shortcuts list
 */
export function useKeyboardShortcuts(shortcuts = []) {
  const shortcutsRef = useRef(shortcuts)
  shortcutsRef.current = shortcuts

  const handleKeyDown = useCallback((event) => {
    for (const shortcut of shortcutsRef.current) {
      const keyMatch =
        event.key.toLowerCase() === shortcut.key.toLowerCase() ||
        event.code.toLowerCase() === shortcut.key.toLowerCase()

      const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey || event.metaKey : true
      const shiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey || !shortcut.shiftKey
      const altMatch = shortcut.altKey ? event.altKey : true

      // If shortcut has ctrlKey requirement, don't match if no ctrl pressed
      const ctrlRequired = shortcut.ctrlKey === true
      const ctrlPressed = event.ctrlKey || event.metaKey

      if (ctrlRequired && !ctrlPressed) continue
      if (!ctrlRequired && ctrlPressed && shortcut.ctrlKey !== undefined) continue

      if (keyMatch && ctrlMatch && altMatch) {
        // Don't fire shortcuts in input/textarea fields (unless explicitly allowed)
        const isInputFocused =
          document.activeElement instanceof HTMLInputElement ||
          document.activeElement instanceof HTMLTextAreaElement ||
          document.activeElement?.contentEditable === 'true'

        if (!isInputFocused || shortcut.allowInInput) {
          event.preventDefault()
          shortcut.handler(event)
          break
        }
      }
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return { shortcuts }
}

export default useKeyboardShortcuts
