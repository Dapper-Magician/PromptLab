import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'

/**
 * Layout Component - Three-Panel IDE Structure
 * 
 * Structure: Sidebar (256px) | Main Editor (flexible) | Testing Panel (400px)
 * Features:
 * - Collapsible sidebar (64px collapsed, 256px expanded)
 * - Smooth Framer Motion animations (<300ms)
 * - Responsive design (hide panels on mobile)
 * - Design system tokens for colors and spacing
 */

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--bg-primary)]">
      {children}
    </div>
  )
}

/**
 * Layout.Sidebar - Collapsible sidebar panel
 * Width: 256px (expanded) / 64px (collapsed)
 */
const LayoutSidebar = ({ children, isCollapsed = false, className }) => {
  return (
    <motion.aside
      initial={false}
      animate={{
        width: isCollapsed ? '64px' : '256px',
      }}
      transition={{
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1], // cubic-bezier easing
      }}
      className={cn(
        'flex-shrink-0 border-r border-[var(--border-primary)]',
        'bg-[var(--bg-secondary)] overflow-hidden',
        'hidden md:flex md:flex-col',
        className
      )}
      style={{
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {children}
    </motion.aside>
  )
}

/**
 * Layout.Main - Main content area (flexible width)
 * Contains the primary editor/content
 */
const LayoutMain = ({ children, className }) => {
  return (
    <main
      className={cn(
        'flex-1 flex flex-col overflow-hidden',
        'bg-[var(--bg-primary)]',
        className
      )}
    >
      {children}
    </main>
  )
}

/**
 * Layout.Panel - Right testing panel
 * Width: 400px (fixed for now, resizable in future)
 */
const LayoutPanel = ({ children, isVisible = true, className }) => {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: '400px',
            opacity: 1,
          }}
          exit={{
            width: 0,
            opacity: 0,
          }}
          transition={{
            duration: 0.25,
            ease: [0.4, 0, 0.2, 1],
          }}
          className={cn(
            'flex-shrink-0 border-l border-[var(--border-primary)]',
            'bg-[var(--bg-secondary)] overflow-hidden',
            'hidden lg:flex lg:flex-col',
            className
          )}
          style={{
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {children}
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

// Export compound component
Layout.Sidebar = LayoutSidebar
Layout.Main = LayoutMain
Layout.Panel = LayoutPanel

export { Layout }