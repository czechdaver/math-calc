import * as React from "react"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  containerClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      containerClassName = "",
      id: propId,
      ...props
    },
    ref
  ) => {
    const id = propId || React.useId()
    const hasError = !!error
    const widthClass = fullWidth ? "w-full" : ""

    const inputElement = (
      <div className="relative rounded-md shadow-sm">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-muted-foreground">{leftIcon}</span>
          </div>
        )}

        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            hasError && "border-destructive text-destructive focus-visible:ring-destructive/50",
            leftIcon && "pl-10",
            (rightIcon || hasError) && "pr-10",
            className
          )}
          ref={ref}
          id={id}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${id}-error` : helperText ? `${id}-description` : undefined
          }
          {...props}
        />

        {hasError ? (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="h-5 w-5 text-destructive" />
          </div>
        ) : rightIcon ? (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-muted-foreground">{rightIcon}</span>
          </div>
        ) : null}
      </div>
    )

    if (!label && !helperText && !hasError) {
      return inputElement
    }

    return (
      <div className={cn("space-y-1", widthClass, containerClassName)}>
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              hasError ? "text-destructive" : "text-foreground"
            )}
          >
            {label}
            {props.required && (
              <span className="text-destructive ml-1">*</span>
            )}
          </label>
        )}

        {inputElement}

        {hasError ? (
          <p className="text-sm font-medium text-destructive" id={`${id}-error`}>
            {error}
          </p>
        ) : helperText ? (
          <p
            className="text-sm text-muted-foreground"
            id={`${id}-description`}
          >
            {helperText}
          </p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }
