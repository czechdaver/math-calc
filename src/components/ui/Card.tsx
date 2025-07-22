import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated' | 'filled'
  hoverEffect?: 'none' | 'shadow' | 'translate' | 'scale'
  fullWidth?: boolean
  as?: React.ElementType
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({
    className,
    variant = 'default',
    hoverEffect = 'none',
    fullWidth = false,
    as: Component = 'div',
    ...props
  }, ref) => {
    // Variant styles
    const variantStyles = {
      default: 'bg-card border border-border',
      outlined: 'bg-card border border-border',
      elevated: 'bg-card shadow-sm',
      filled: 'bg-muted/50',
    }

    // Hover effects
    const hoverEffects = {
      none: '',
      shadow: 'hover:shadow-md transition-shadow duration-200',
      translate: 'hover:-translate-y-0.5 transition-transform duration-200',
      scale: 'hover:scale-[1.01] transition-transform duration-200',
    }

    // Width
    const widthClass = fullWidth ? 'w-full' : ''

    return (
      <Component
        ref={ref}
        data-slot="card"
        className={cn(
          'flex flex-col gap-6 rounded-xl py-6',
          variantStyles[variant],
          hoverEffect !== 'none' && 'hover:cursor-pointer',
          hoverEffects[hoverEffect],
          widthClass,
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  withBorder?: boolean
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, withBorder = false, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn(
        'grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6',
        'has-data-[slot=card-action]:grid-cols-[1fr_auto]',
        withBorder && 'border-b pb-6',
        className
      )}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ as: Component = 'h3', className, ...props }, ref) => (
    <Component
      ref={ref}
      data-slot="card-title"
      className={cn('text-lg font-semibold leading-none', className)}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="card-description"
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-action"
    className={cn(
      'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
      className
    )}
    {...props}
  />
))
CardAction.displayName = 'CardAction'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-content"
    className={cn('px-6', className)}
    {...props}
  />
))
CardContent.displayName = 'CardContent'

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  withBorder?: boolean
  align?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, withBorder = false, align = 'start', ...props }, ref) => {
    const alignment = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    }

    return (
      <div
        ref={ref}
        data-slot="card-footer"
        className={cn(
          'flex items-center px-6',
          withBorder && 'border-t pt-6',
          alignment[align],
          className
        )}
        {...props}
      />
    )
  }
)
CardFooter.displayName = 'CardFooter'

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
