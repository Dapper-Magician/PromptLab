import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const Card = React.forwardRef(({ className, clickable = false, selected = false, ...props }, ref) => {
  const baseClasses = "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200"
  const interactiveClasses = clickable
    ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5"
    : ""
  const selectedClasses = selected
    ? "ring-2 ring-primary border-primary"
    : ""
  
  if (clickable) {
    return (
      <motion.div
        ref={ref}
        className={cn(baseClasses, interactiveClasses, selectedClasses, className)}
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        {...props}
      />
    )
  }
  
  return (
    <div
      ref={ref}
      className={cn(baseClasses, selectedClasses, className)}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
