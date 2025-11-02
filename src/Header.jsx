import { Search, Menu, Command, Settings, BarChart3, TestTube, Moon, Sun, Monitor, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from "./ThemeProvider"
import { motion, AnimatePresence } from 'framer-motion'

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const getIcon = () => {
    if (theme === 'system') return <Monitor className="h-[1.2rem] w-[1.2rem]" />
    if (resolvedTheme === 'dark') return <Moon className="h-[1.2rem] w-[1.2rem]" />
    return <Sun className="h-[1.2rem] w-[1.2rem]" />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 px-0 relative overflow-hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              {getIcon()}
            </motion.div>
          </AnimatePresence>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="cursor-pointer"
        >
          <Sun className="h-4 w-4 mr-2" />
          Light
          {theme === 'light' && (
            <motion.div
              layoutId="active-theme"
              className="ml-auto w-2 h-2 rounded-full bg-primary"
              initial={false}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="cursor-pointer"
        >
          <Moon className="h-4 w-4 mr-2" />
          Dark
          {theme === 'dark' && (
            <motion.div
              layoutId="active-theme"
              className="ml-auto w-2 h-2 rounded-full bg-primary"
              initial={false}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="cursor-pointer"
        >
          <Monitor className="h-4 w-4 mr-2" />
          System
          {theme === 'system' && (
            <motion.div
              layoutId="active-theme"
              className="ml-auto w-2 h-2 rounded-full bg-primary"
              initial={false}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


export function Header({ onCommandPaletteOpen, onSidebarToggle }) {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Prompts', icon: Command },
    { path: '/templates', label: 'Templates', icon: Sparkles },
    { path: '/testing', label: 'Testing', icon: TestTube },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSidebarToggle}
            className="h-8 w-8 p-0"
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <Command className="h-4 w-4 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-semibold">PromptLab</h1>
          </div>
        </div>

        {/* Center - Navigation */}
        <nav className="flex items-center space-x-1 mx-6">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Button
                key={item.path}
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                onClick={() => navigate(item.path)}
                className="flex items-center space-x-2"
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            )
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center space-x-2 ml-auto">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search prompts... (Ctrl+K)"
              className="w-64 pl-8"
              onClick={onCommandPaletteOpen}
              readOnly
            />
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onCommandPaletteOpen}
            className="flex items-center space-x-1"
          >
            <Command className="h-4 w-4" />
            <span className="text-xs">⌘K</span>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}