import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, showCharCount = false, maxLength, ...props }, ref) => {
  const [isFocused, setIsFocused] = React.useState(false)
  const [charCount, setCharCount] = React.useState(0)
  
  const handleChange = (e) => {
    setCharCount(e.target.value.length)
    props.onChange?.(e)
  }
  
  return (
    <div className="relative">
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-200",
          showCharCount && "pb-8",
          className
        )}
        ref={ref}
        maxLength={maxLength}
        onFocus={(e) => {
          setIsFocused(true)
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          setIsFocused(false)
          props.onBlur?.(e)
        }}
        onChange={handleChange}
        {...props}
      />
      <motion.div
        className="absolute inset-0 rounded-md pointer-events-none"
        initial={false}
        animate={{
          boxShadow: isFocused
            ? "0 0 0 2px hsl(var(--ring))"
            : "0 0 0 0px hsl(var(--ring))"
        }}
        transition={{ duration: 0.2 }}
      />
      {showCharCount && (
        <motion.div
          className="absolute bottom-2 right-3 text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: isFocused ? 1 : 0.5 }}
          transition={{ duration: 0.2 }}
        >
          {charCount}
          {maxLength && ` / ${maxLength}`}
        </motion.div>
      )}
    </div>
  );
})
Textarea.displayName = "Textarea"

export { Textarea }
