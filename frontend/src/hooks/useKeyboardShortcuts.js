import { useEffect } from 'react'

export const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if key combination matches any shortcut
      Object.entries(shortcuts).forEach(([combo, handler]) => {
        const keys = combo.toLowerCase().split('+')
        const pressedKeys = []
        
        if (event.ctrlKey || event.metaKey) pressedKeys.push('ctrl')
        if (event.shiftKey) pressedKeys.push('shift')
        if (event.altKey) pressedKeys.push('alt')
        pressedKeys.push(event.key.toLowerCase())
        
        const match = keys.every(key => pressedKeys.includes(key))
        
        if (match) {
          event.preventDefault()
          handler(event)
        }
      })
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

// Common keyboard shortcuts
export const SHORTCUTS = {
  SEARCH: 'ctrl+k',
  DASHBOARD: 'ctrl+d',
  MAP: 'ctrl+m',
  FORECASTS: 'ctrl+f',
  SETTINGS: 'ctrl+,',
  HELP: '?',
}
