import { createContext, useContext, useEffect, useState } from "react"

const ThemeProviderContext = createContext({
  theme: "system",
  setTheme: () => null,
  resolvedTheme: "light",
})

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "promptlab-theme",
  ...props
}) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme
  )
  const [resolvedTheme, setResolvedTheme] = useState("light")

  useEffect(() => {
    const root = window.document.documentElement
    
    // Add smooth transition for theme changes
    root.style.setProperty('transition', 'background-color 300ms ease, color 300ms ease, border-color 300ms ease')
    
    // Remove old class-based theme system
    root.classList.remove("light", "dark")

    // Determine effective theme
    let effectiveTheme = theme
    if (theme === "system") {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    }

    // Set data-theme attribute for CSS
    root.setAttribute("data-theme", effectiveTheme)
    
    // Also add class for backward compatibility
    root.classList.add(effectiveTheme)
    
    // Update resolved theme state
    setResolvedTheme(effectiveTheme)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e) => {
      if (theme === "system") {
        const newTheme = e.matches ? "dark" : "light"
        root.setAttribute("data-theme", newTheme)
        root.classList.remove("light", "dark")
        root.classList.add(newTheme)
        setResolvedTheme(newTheme)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    
    return () => {
      mediaQuery.removeEventListener("change", handleChange)
      root.style.removeProperty('transition')
    }
  }, [theme])

  const value = {
    theme,
    setTheme: (newTheme) => {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
    resolvedTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
