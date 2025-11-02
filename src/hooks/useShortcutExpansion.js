import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Custom hook for automatic text expansion (Espanso-style shortcuts)
 * 
 * @returns {Object} - { shortcuts, loading, error, expandText }
 */
export function useShortcutExpansion() {
  const [shortcuts, setShortcuts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const lastCheckRef = useRef('')

  // Fetch active shortcuts from API
  const fetchShortcuts = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5002/api/shortcuts?is_active=true')
      if (!response.ok) throw new Error('Failed to fetch shortcuts')
      const data = await response.json()
      setShortcuts(data)
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching shortcuts:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchShortcuts()
    
    // Refresh shortcuts every 30 seconds to pick up changes
    const interval = setInterval(fetchShortcuts, 30000)
    return () => clearInterval(interval)
  }, [fetchShortcuts])

  // Increment use count in backend
  const incrementUseCount = useCallback(async (shortcutId) => {
    try {
      await fetch(`http://localhost:5002/api/shortcuts/${shortcutId}/increment`, {
        method: 'POST'
      })
    } catch (err) {
      console.error('Error incrementing use count:', err)
    }
  }, [])

  /**
   * Check if text contains a shortcut trigger and return expansion
   * 
   * @param {string} text - The current text value
   * @returns {Object|null} - { shortcut, position } or null if no match
   */
  const detectShortcut = useCallback((text) => {
    // Avoid checking the same text repeatedly
    if (text === lastCheckRef.current) {
      return null
    }
    lastCheckRef.current = text

    // Get the last word or token (after last space/newline)
    const lines = text.split('\n')
    const lastLine = lines[lines.length - 1]
    const words = lastLine.split(/\s/)
    const lastWord = words[words.length - 1]

    // Check if any shortcut trigger matches the end of the text
    for (const shortcut of shortcuts) {
      if (text.endsWith(shortcut.trigger)) {
        return {
          shortcut,
          position: text.length - shortcut.trigger.length
        }
      }
      
      // Also check if the last word ends with the trigger
      // This catches triggers that might have punctuation after them
      if (lastWord.endsWith(shortcut.trigger)) {
        return {
          shortcut,
          position: text.length - lastWord.length + lastWord.indexOf(shortcut.trigger)
        }
      }
    }

    return null
  }, [shortcuts])

  /**
   * Manually expand text with a shortcut
   * Used for programmatic expansion or testing
   * 
   * @param {string} text - The text to expand
   * @param {HTMLElement} element - The input/textarea element
   * @returns {Object} - { expanded: boolean, newText: string, shortcut: Object|null }
   */
  const expandText = useCallback((text, element = null) => {
    const match = detectShortcut(text)
    
    if (!match) {
      return { expanded: false, newText: text, shortcut: null }
    }

    const { shortcut, position } = match
    const before = text.substring(0, position)
    const after = text.substring(position + shortcut.trigger.length)
    const newText = before + shortcut.expansion + after

    // Update cursor position if element provided
    if (element) {
      const newCursorPos = before.length + shortcut.expansion.length
      
      // Use setTimeout to ensure the value is updated before setting cursor
      setTimeout(() => {
        element.setSelectionRange(newCursorPos, newCursorPos)
        element.focus()
      }, 0)
    }

    // Increment use count
    incrementUseCount(shortcut.id)

    return { expanded: true, newText, shortcut }
  }, [detectShortcut, incrementUseCount])

  /**
   * Attach shortcut expansion to an input/textarea element
   * 
   * @param {HTMLElement} element - The input or textarea element
   * @param {Function} onChange - The onChange handler to update the value
   */
  const attachToElement = useCallback((element, onChange) => {
    if (!element) return

    const handleInput = (e) => {
      const text = e.target.value
      const result = expandText(text, e.target)
      
      if (result.expanded) {
        // Prevent default and update with expanded text
        e.preventDefault()
        
        // Call the onChange handler with the new value
        onChange(result.newText)
        
        // Show a subtle visual feedback (optional)
        element.style.transition = 'background-color 0.2s'
        element.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'
        setTimeout(() => {
          element.style.backgroundColor = ''
        }, 200)
      }
    }

    element.addEventListener('input', handleInput)
    
    return () => {
      element.removeEventListener('input', handleInput)
    }
  }, [expandText])

  return {
    shortcuts,
    loading,
    error,
    expandText,
    detectShortcut,
    attachToElement
  }
}

/**
 * Hook to apply shortcut expansion to a specific input field
 * 
 * @param {Function} onChange - The onChange handler to update the value
 * @returns {Function} - ref function to attach to the element
 */
export function useShortcutField(onChange) {
  const { expandText } = useShortcutExpansion()
  const elementRef = useRef(null)

  const handleInput = useCallback((e) => {
    const text = e.target.value
    const result = expandText(text, e.target)
    
    if (result.expanded) {
      onChange(result.newText)
      
      // Visual feedback
      e.target.style.transition = 'background-color 0.2s'
      e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'
      setTimeout(() => {
        e.target.style.backgroundColor = ''
      }, 200)
    }
  }, [expandText, onChange])

  const ref = useCallback((element) => {
    // Clean up previous element
    if (elementRef.current) {
      elementRef.current.removeEventListener('input', handleInput)
    }

    // Set up new element
    if (element) {
      element.addEventListener('input', handleInput)
      elementRef.current = element
    }
  }, [handleInput])

  useEffect(() => {
    return () => {
      if (elementRef.current) {
        elementRef.current.removeEventListener('input', handleInput)
      }
    }
  }, [handleInput])

  return ref
}