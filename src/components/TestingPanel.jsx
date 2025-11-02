import { motion } from 'framer-motion'
import { TestTube, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

/**
 * TestingPanel Component - Placeholder for Phase 5
 * 
 * This is a placeholder component that will be fully implemented in Phase 5.
 * For now, it shows a "Coming Soon" message with design system styling.
 */

export function TestingPanel() {
  return (
    <div className="flex flex-col h-full w-full bg-[var(--bg-secondary)]">
      {/* Header */}
      <div className="border-b border-[var(--border-primary)] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TestTube className="h-5 w-5 text-[var(--text-secondary)]" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Testing Workbench
            </h2>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="max-w-md w-full"
        >
          <Card className="p-8 text-center space-y-6 bg-[var(--bg-primary)] border-[var(--border-primary)]">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.1,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-[var(--primary-500)] opacity-20 blur-2xl rounded-full" />
                <div className="relative bg-[var(--primary-100)] dark:bg-[var(--primary-950)] rounded-full p-6">
                  <TestTube className="h-12 w-12 text-[var(--primary-600)] dark:text-[var(--primary-400)]" />
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                Testing Workbench
              </h3>
              <p className="text-[var(--text-secondary)] text-sm">
                Coming Soon in Phase 5
              </p>
            </div>

            {/* Description */}
            <div className="space-y-3 text-left">
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                The Testing Workbench will be a powerful multi-model testing environment where you can:
              </p>
              
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                <li className="flex items-start space-x-2">
                  <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0 text-[var(--primary-500)]" />
                  <span>Test prompts with multiple AI providers simultaneously</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0 text-[var(--primary-500)]" />
                  <span>Compare responses side-by-side</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0 text-[var(--primary-500)]" />
                  <span>Track performance metrics and costs</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0 text-[var(--primary-500)]" />
                  <span>Save and analyze test results</span>
                </li>
              </ul>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Button
                variant="outline"
                className="w-full group"
                disabled
              >
                <span>Learn More</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Status Badge */}
            <div className="pt-2">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--warning-50)] dark:bg-[var(--warning-950)] border border-[var(--warning-200)] dark:border-[var(--warning-800)]">
                <div className="w-2 h-2 rounded-full bg-[var(--warning-500)] mr-2 animate-pulse" />
                <span className="text-xs font-medium text-[var(--warning-700)] dark:text-[var(--warning-400)]">
                  In Development
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}